import { dados } from '../connectors/index.js';
import { dinheiroCurto, numero, dataBr } from '../utils/formato.js';

// Pagina inicial: organizada por PERGUNTAS que qualquer pessoa faria,
// nao por jargao tecnico ("execucao orcamentaria", "empenho" etc.).

const CARTOES = [
  {
    rota: '#/receitas',
    icone: '💰',
    titulo: 'Quanto dinheiro entrou?',
    descricao: 'Veja quanto a Prefeitura arrecadou com impostos e repasses.',
  },
  {
    rota: '#/despesas',
    icone: '🧾',
    titulo: 'Com o que foi gasto?',
    descricao: 'Saúde, educação, obras… descubra para onde foi o dinheiro.',
  },
  {
    rota: '#/licitacoes',
    icone: '🛒',
    titulo: 'O que a Prefeitura está comprando?',
    descricao: 'Como acompanhar as compras e contratações públicas.',
  },
  {
    rota: '#/servidores',
    icone: '👥',
    titulo: 'Quem trabalha na Prefeitura?',
    descricao: 'Pesquise os servidores por nome, cargo ou secretaria.',
  },
  {
    rota: '#/glossario',
    icone: '📖',
    titulo: 'O que significam essas palavras?',
    descricao: 'Licitação? Empenho? Entenda os termos difíceis em palavras simples.',
  },
  {
    rota: '#/ajuda',
    icone: '🙋',
    titulo: 'Quero perguntar algo à Prefeitura',
    descricao: 'Saiba como pedir qualquer informação pública. É seu direito e é de graça.',
  },
];

export async function render(container) {
  container.innerHTML = `<p class="carregando" role="status">Carregando os números da cidade…</p>`;
  const resumo = await dados.resumo();
  const sobra = resumo.receitaRealizada - resumo.despesaLiquidada;

  container.innerHTML = `
    <section class="hero" aria-labelledby="titulo-hero">
      <h1 id="titulo-hero">O dinheiro da nossa cidade, explicado de forma simples</h1>
      <p class="hero-sub">
        Todo o dinheiro da Prefeitura é público: vem dos impostos e deve voltar para você
        em forma de saúde, educação, ruas e serviços. Aqui você acompanha tudo isso sem
        precisar entender de termos técnicos.
      </p>
    </section>

    ${resumo.ilustrativo ? `
      <p class="aviso-amostra" role="note">
        ⚠️ Os dados oficiais ainda não foram carregados neste momento. Os números abaixo são
        um exemplo. Atualize a página em instantes ou veja a
        <a href="https://siconfi.tesouro.gov.br/" target="_blank" rel="noopener">fonte oficial</a>.
      </p>` : `
      <p class="aviso-fonte" role="note">
        ✅ Dados oficiais da <strong>${resumo.fonte}</strong>, referentes ao
        <strong>${resumo.periodoLabel}</strong>. Atualizado em ${dataBr(resumo.atualizadoEm)}.
      </p>`}

    <section class="painel-resumo" aria-label="Resumo de ${resumo.exercicio}">
      <h2>Resumo de ${resumo.exercicio}</h2>
      <div class="cartoes-numeros">
        <div class="numero-grande">
          <span class="valor">${dinheiroCurto(resumo.receitaRealizada)}</span>
          <span class="legenda">entraram nos cofres da cidade (arrecadação)</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${dinheiroCurto(resumo.despesaLiquidada)}</span>
          <span class="legenda">foram gastos em serviços públicos</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${dinheiroCurto(Math.abs(sobra))}</span>
          <span class="legenda">${sobra >= 0 ? 'sobraram (entrou mais do que saiu)' : 'a mais foi gasto do que entrou'}</span>
        </div>
        ${resumo.populacao ? `
        <div class="numero-grande">
          <span class="valor">${numero(resumo.populacao)}</span>
          <span class="legenda">moradores na cidade (IBGE)</span>
        </div>` : ''}
      </div>
    </section>

    <section aria-label="O que você quer saber?">
      <h2>O que você quer saber?</h2>
      <div class="grade-cartoes">
        ${CARTOES.map((c) => `
          <a class="cartao" href="${c.rota}">
            <span class="cartao-icone" aria-hidden="true">${c.icone}</span>
            <span class="cartao-titulo">${c.titulo}</span>
            <span class="cartao-descricao">${c.descricao}</span>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}
