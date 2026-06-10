// Captura dados REAIS de Rio Grande/RS na API aberta do SICONFI (Tesouro
// Nacional) e os converte para o formato simples que o site consome.
//
// Fonte: https://apidatalake.tesouro.gov.br/docs/siconfi/  (REST, JSON, sem
// autenticacao, cobre todos os municipios). Usamos o RREO (Relatorio
// Resumido da Execucao Orcamentaria), publicado a cada bimestre.
//
// Por que via SICONFI e nao pelo portal GRP da Prefeitura? O portal GRP esta
// atras de um firewall (WAF) que bloqueia qualquer acesso automatizado. O
// SICONFI publica os mesmos numeros oficiais de forma aberta e estavel.
//
// Saida: public/dados/transparencia.json  (servido junto com o site).

import { writeFile, mkdir } from 'node:fs/promises';

const BASE = 'https://apidatalake.tesouro.gov.br/ords/siconfi/tt';
const ID_ENTE = 4315602; // Rio Grande/RS (codigo IBGE)

async function buscarRREO(ano, periodo, anexo) {
  const url =
    `${BASE}/rreo?an_exercicio=${ano}&nr_periodo=${periodo}` +
    `&co_tipo_demonstrativo=RREO&no_anexo=${encodeURIComponent(anexo)}&id_ente=${ID_ENTE}`;
  const resp = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!resp.ok) throw new Error(`SICONFI ${anexo} ${ano}/${periodo}: HTTP ${resp.status}`);
  const json = await resp.json();
  return Array.isArray(json.items) ? json.items : [];
}

// Lista candidatos (ano, periodo) do mais recente para o mais antigo.
function candidatosPeriodo() {
  const anoAtual = new Date().getFullYear();
  const lista = [];
  for (const ano of [anoAtual, anoAtual - 1, anoAtual - 2]) {
    for (const periodo of [6, 4, 2]) lista.push({ ano, periodo });
  }
  return lista;
}

const norm = (s) => (s ?? '').toString().toUpperCase().trim();

// Acha um valor pela conta (igualdade) e por um trecho do nome da coluna.
function valorPorConta(itens, contaAlvo, trechoColuna) {
  const alvo = norm(contaAlvo);
  const tre = norm(trechoColuna);
  const achado = itens.find((i) => norm(i.conta) === alvo && norm(i.coluna).includes(tre));
  return achado ? Number(achado.valor) || 0 : 0;
}

function somaPorContas(itens, contas, trechoColuna) {
  return contas.reduce((soma, c) => soma + valorPorConta(itens, c, trechoColuna), 0);
}

// Funcoes de governo padrao (lista canonica). Usada para nao confundir
// FUNCAO com subfuncao e nao contar valor em dobro no Anexo 02.
const FUNCOES = {
  'Saúde': { icone: '🏥', explicacao: 'Postos de saúde, hospitais, remédios e salários de médicos e enfermeiros.' },
  'Educação': { icone: '🏫', explicacao: 'Escolas, creches, merenda, transporte escolar e salários de professores.' },
  'Administração': { icone: '🏛️', explicacao: 'Funcionamento da Prefeitura: prédios, sistemas e pessoal administrativo.' },
  'Urbanismo': { icone: '🏙️', explicacao: 'Ruas, calçadas, praças, iluminação e cuidado com a cidade.' },
  'Assistência Social': { icone: '🤝', explicacao: 'Apoio a famílias em situação de vulnerabilidade, CRAS e abrigos.' },
  'Saneamento': { icone: '💧', explicacao: 'Água, esgoto e drenagem.' },
  'Gestão Ambiental': { icone: '🌳', explicacao: 'Proteção do meio ambiente e coleta/limpeza.' },
  'Previdência Social': { icone: '👴', explicacao: 'Aposentadorias e pensões dos servidores municipais.' },
  'Segurança Pública': { icone: '🚓', explicacao: 'Guarda municipal, trânsito e defesa civil.' },
  'Cultura': { icone: '🎭', explicacao: 'Bibliotecas, eventos, patrimônio e incentivo à cultura.' },
  'Desporto e Lazer': { icone: '⚽', explicacao: 'Quadras, ginásios, praças esportivas e eventos de lazer.' },
  'Agricultura': { icone: '🌾', explicacao: 'Apoio a produtores rurais e abastecimento.' },
  'Trabalho': { icone: '💼', explicacao: 'Qualificação profissional e geração de emprego e renda.' },
  'Habitação': { icone: '🏠', explicacao: 'Moradia popular e regularização de áreas.' },
  'Comércio e Serviços': { icone: '🏪', explicacao: 'Apoio ao comércio, turismo e serviços locais.' },
  'Direitos da Cidadania': { icone: '⚖️', explicacao: 'Defesa de direitos e atendimento ao cidadão.' },
  'Legislativa': { icone: '🏛️', explicacao: 'Câmara de Vereadores e a atividade de fazer leis.' },
  'Judiciária': { icone: '⚖️', explicacao: 'Despesas com a função judiciária.' },
  'Encargos Especiais': { icone: '📑', explicacao: 'Dívidas, ressarcimentos e outros encargos obrigatórios.' },
};

function montarDespesasPorArea(anexo02) {
  const COL = 'LIQUIDADAS ATÉ O BIMESTRE'; // o que de fato foi gasto e comprovado
  const linhas = [];
  for (const [nome, meta] of Object.entries(FUNCOES)) {
    const valor = valorPorConta(anexo02, nome, COL);
    if (valor > 0) linhas.push({ area: nome, valor, icone: meta.icone, explicacao: meta.explicacao });
  }
  linhas.sort((a, b) => b.valor - a.valor);
  // Agrupa a cauda longa em "Outras áreas" para o grafico ficar legivel.
  if (linhas.length > 8) {
    const principais = linhas.slice(0, 7);
    const resto = linhas.slice(7).reduce((s, l) => s + l.valor, 0);
    principais.push({ area: 'Outras áreas', valor: resto, icone: '📋', explicacao: 'Demais áreas com menor participação no orçamento.' });
    return principais;
  }
  return linhas;
}

function montarReceitasPorOrigem(anexo01) {
  const COL = 'Até o Bimestre';
  const grupos = [
    {
      origem: 'Impostos e taxas pagos na cidade',
      contas: ['IMPOSTOS, TAXAS E CONTRIBUIÇÕES DE MELHORIA'],
      explicacao: 'Dinheiro pago por moradores e empresas da cidade, como IPTU, ISS e ITBI.',
    },
    {
      origem: 'Repasses de outros governos',
      contas: ['TRANSFERÊNCIAS CORRENTES', 'TRANSFERÊNCIAS DE CAPITAL'],
      explicacao: 'Parte dos impostos federais e estaduais (como FPM e ICMS) que volta para o município.',
    },
    {
      origem: 'Serviços, patrimônio e contribuições',
      contas: ['RECEITA DE SERVIÇOS', 'RECEITA PATRIMONIAL', 'CONTRIBUIÇÕES', 'RECEITA AGROPECUÁRIA', 'RECEITA INDUSTRIAL'],
      explicacao: 'Taxas por serviços, aluguéis, rendimentos e contribuições.',
    },
    {
      origem: 'Empréstimos e financiamentos',
      contas: ['OPERAÇÕES DE CRÉDITO'],
      explicacao: 'Dinheiro tomado emprestado para investimentos, que será pago no futuro.',
    },
    {
      origem: 'Outras receitas',
      contas: ['OUTRAS RECEITAS CORRENTES', 'OUTRAS RECEITAS DE CAPITAL', 'ALIENAÇÃO DE BENS', 'AMORTIZAÇÃO DE EMPRÉSTIMOS'],
      explicacao: 'Multas, indenizações, venda de bens e demais receitas.',
    },
  ];
  return grupos
    .map((g) => ({ origem: g.origem, valor: somaPorContas(anexo01, g.contas, COL), explicacao: g.explicacao }))
    .filter((g) => g.valor > 0);
}

async function montarReceitasPorBimestre(ano, periodoMax) {
  const CONTA = 'RECEITAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)';
  const COL = 'Até o Bimestre';
  const linhas = [];
  for (let p = 2; p <= periodoMax; p += 2) {
    const itens = await buscarRREO(ano, p, 'RREO-Anexo 01').catch(() => []);
    const valor = valorPorConta(itens, CONTA, COL);
    if (valor > 0) linhas.push({ rotulo: `Até o ${p / 2}º bim.`, valor });
  }
  return linhas;
}

// Monta o objeto de dados para um (ano, periodo). Devolve null se os dados
// estiverem incompletos (ex.: ano corrente sem despesa liquidada ainda).
async function montarParaPeriodo(ano, periodo) {
  const [anexo01, anexo02] = await Promise.all([
    buscarRREO(ano, periodo, 'RREO-Anexo 01').catch(() => []),
    buscarRREO(ano, periodo, 'RREO-Anexo 02').catch(() => []),
  ]);
  if (anexo01.length === 0 || anexo02.length === 0) return null;

  const receitaRealizada = valorPorConta(anexo01, 'RECEITAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)', 'Até o Bimestre');
  const despesaLiquidada = valorPorConta(anexo02, 'DESPESAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)', 'LIQUIDADAS ATÉ O BIMESTRE');
  const despesasPorArea = montarDespesasPorArea(anexo02);
  if (!receitaRealizada || !despesaLiquidada || despesasPorArea.length === 0) {
    if (process.env.DEBUG_SICONFI) {
      console.log(`  [debug] receita=${receitaRealizada} despesa=${despesaLiquidada} areas=${despesasPorArea.length}`);
      console.log('  [debug] colunas Anexo01:', JSON.stringify([...new Set(anexo01.map((i) => i.coluna))]));
      console.log('  [debug] contas receita I:', JSON.stringify(anexo01.filter((i) => norm(i.conta).includes('EXCETO INTRA')).map((i) => i.conta)));
      console.log('  [debug] colunas Anexo02:', JSON.stringify([...new Set(anexo02.map((i) => i.coluna))]));
    }
    return null;
  }

  const meta = anexo02[0] ?? anexo01[0] ?? {};
  return {
    fonte: 'SICONFI - Tesouro Nacional (RREO)',
    fonteUrl: 'https://apidatalake.tesouro.gov.br/docs/siconfi/',
    instituicao: meta.instituicao ?? 'Prefeitura Municipal de Rio Grande - RS',
    populacao: meta.populacao ?? null,
    exercicio: ano,
    periodo,
    periodoLabel: `${periodo / 2}º bimestre de ${ano}`,
    atualizadoEm: new Date().toISOString().slice(0, 10),
    resumo: { receitaRealizada, despesaLiquidada },
    receitasPorBimestre: await montarReceitasPorBimestre(ano, periodo),
    receitasPorOrigem: montarReceitasPorOrigem(anexo01),
    despesasPorArea,
  };
}

async function main() {
  console.log('Procurando o periodo mais recente do RREO com dados completos...');
  let dados = null;
  for (const { ano, periodo } of candidatosPeriodo()) {
    dados = await montarParaPeriodo(ano, periodo);
    if (dados) {
      console.log(`Usando exercicio ${ano}, periodo ${periodo}.`);
      break;
    }
    console.log(`  ${ano}/${periodo}: sem dados completos, tentando anterior...`);
  }
  if (!dados) {
    throw new Error('Nenhum periodo do RREO retornou dados completos para Rio Grande/RS.');
  }

  await mkdir('public/dados', { recursive: true });
  await writeFile('public/dados/transparencia.json', JSON.stringify(dados, null, 2) + '\n');
  console.log('OK: public/dados/transparencia.json gerado.');
  console.log(`  Receita realizada: R$ ${dados.resumo.receitaRealizada.toLocaleString('pt-BR')}`);
  console.log(`  Despesa liquidada: R$ ${dados.resumo.despesaLiquidada.toLocaleString('pt-BR')}`);
  console.log(`  Areas de despesa: ${dados.despesasPorArea.length}`);
}

// Exportado para o smoke test validar a logica sem rede.
export const montarDespesasPorAreaTest = montarDespesasPorArea;

// So executa a captura quando rodado diretamente (node scripts/fetch-siconfi.mjs),
// nao quando importado pelo teste.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error('FALHA:', e.message);
    process.exit(1);
  });
}
