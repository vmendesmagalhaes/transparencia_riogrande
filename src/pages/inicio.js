import { dados } from '../connectors/index.js';
import { dinheiroCurto, numero, dataBr } from '../utils/formato.js';

// Página inicial: organizada por PERGUNTAS que qualquer pessoa faria,
// não por jargão técnico ("execução orçamentária", "empenho" etc.).

const CARTOES = [
  {
    rota: '#/receitas',
    icone: '💰',
    titulo: 'Quanto dinheiro entrou?',
    descricao: 'Veja quanto a Prefeitura arrecadou com impostos e repasses, mês a mês.',
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
    descricao: 'Compras e contratações em andamento, explicadas de forma simples.',
  },
  {
    rota: '#/servidores',
    icone: '👥',
    titulo: 'Quem trabalha na Prefeitura?',
    descricao: 'Quantidade de servidores e quanto custa a folha de pagamento.',
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
        ⚠️ Estamos em fase de testes: os números abaixo são <strong>exemplos ilustrativos</strong>.
        Para os valores oficiais, visite o
        <a href="https://grp.riogrande.rs.gov.br/transparencia/prefeitura/#/" target="_blank" rel="noopener">portal oficial</a>.
      </p>` : ''}

    <section class="painel-resumo" aria-label="Resumo do ano de ${resumo.ano}">
      <h2>Resumo de ${resumo.ano} <small>(atualizado em ${dataBr(resumo.atualizadoEm)})</small></h2>
      <div class="cartoes-numeros">
        <div class="numero-grande">
          <span class="valor">${dinheiroCurto(resumo.receitaArrecadada)}</span>
          <span class="legenda">entraram nos cofres da cidade</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${dinheiroCurto(resumo.despesaPaga)}</span>
          <span class="legenda">foram gastos em serviços públicos</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${numero(resumo.licitacoesAbertas)}</span>
          <span class="legenda">compras públicas abertas agora</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${numero(resumo.servidoresAtivos)}</span>
          <span class="legenda">pessoas trabalham na Prefeitura</span>
        </div>
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
