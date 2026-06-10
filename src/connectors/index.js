import { amostra } from '../data/amostra.js';

// Fachada de dados do site.
//
// A fonte real e o arquivo public/dados/transparencia.json, gerado pelo
// script scripts/fetch-siconfi.mjs a partir da API aberta do SICONFI
// (Tesouro Nacional) e atualizado automaticamente pelo workflow
// .github/workflows/dados.yml. Aqui apenas carregamos esse JSON.
//
// Se o arquivo ainda nao existir (primeira execucao antes do workflow rodar),
// caimos para a amostra local com aviso de "ilustrativo", para a pagina nao
// quebrar. Assim que o JSON real existe, todos os numeros sao oficiais.

let cache = null;

async function carregar() {
  if (cache) return cache;
  try {
    const resp = await fetch(new URL('./dados/transparencia.json', document.baseURI), {
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    cache = await resp.json();
    cache.ilustrativo = false;
  } catch {
    cache = { ...amostraComoReal(), ilustrativo: true };
  }
  return cache;
}

// Adapta a amostra antiga ao novo formato (usada so como reserva).
function amostraComoReal() {
  return {
    fonte: 'Amostra local (sem dados oficiais carregados)',
    fonteUrl: 'https://apidatalake.tesouro.gov.br/docs/siconfi/',
    instituicao: 'Prefeitura Municipal de Rio Grande - RS',
    populacao: null,
    exercicio: amostra.resumo.ano,
    periodoLabel: `exercício de ${amostra.resumo.ano}`,
    atualizadoEm: amostra.resumo.atualizadoEm,
    resumo: {
      receitaRealizada: amostra.resumo.receitaArrecadada,
      despesaLiquidada: amostra.resumo.despesaPaga,
    },
    receitasPorBimestre: amostra.receitasPorMes
      .filter((m) => m.valor > 0)
      .map((m) => ({ rotulo: m.mes, valor: m.valor })),
    receitasPorOrigem: amostra.receitasPorOrigem,
    despesasPorArea: amostra.despesasPorArea,
  };
}

export const dados = {
  async tudo() {
    return carregar();
  },
  async resumo() {
    const d = await carregar();
    return {
      ...d.resumo,
      exercicio: d.exercicio,
      periodoLabel: d.periodoLabel,
      populacao: d.populacao,
      atualizadoEm: d.atualizadoEm,
      fonte: d.fonte,
      ilustrativo: d.ilustrativo,
    };
  },
  async receitasPorBimestre() {
    return (await carregar()).receitasPorBimestre;
  },
  async receitasPorOrigem() {
    return (await carregar()).receitasPorOrigem;
  },
  async despesasPorArea() {
    return (await carregar()).despesasPorArea;
  },
};
