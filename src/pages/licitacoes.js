import { config } from '../config.js';

// Licitacoes nao estao na base aberta do SICONFI (que cobre receitas e
// despesas). Em vez de inventar numeros, explicamos o que sao e levamos a
// pessoa, em poucos passos, ate a consulta oficial. A integracao automatica
// entrara aqui quando houver uma fonte de dados aberta para licitacoes.

export async function render(container) {
  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>🛒 O que a Prefeitura está comprando?</h1>
    <p class="explicacao">
      Quando a Prefeitura precisa comprar algo ou contratar um serviço, ela faz uma
      <strong>licitação</strong>: uma espécie de concurso entre empresas, em que vence
      quem oferece a melhor proposta. Isso evita favorecimentos e ajuda a economizar
      dinheiro público.
    </p>

    <p class="aviso-fonte" role="note">
      ℹ️ As licitações em detalhe ficam no portal oficial da Prefeitura. Como ainda não há
      uma fonte de dados aberta para integrá-las automaticamente aqui, preparamos o
      caminho mais curto para você consultá-las.
    </p>

    <section aria-labelledby="t-passos">
      <h2 id="t-passos">Como consultar as compras públicas</h2>
      <ol class="passo-a-passo">
        <li>
          <strong>Abra o portal de transparência da Prefeitura:</strong>
          <a href="${config.linksOficiais.grp}" target="_blank" rel="noopener">portal oficial (abre em nova aba)</a>.
        </li>
        <li>
          <strong>Procure a seção "Licitações" ou "Compras".</strong>
          Lá ficam os editais (as regras da compra), os prazos e os resultados.
        </li>
        <li>
          <strong>Use os filtros</strong> por ano, tipo (pregão, concorrência) ou situação
          (aberta, em andamento, concluída) para achar o que procura.
        </li>
        <li>
          <strong>Não encontrou ou ficou em dúvida?</strong>
          Você pode pedir a informação diretamente à Prefeitura — veja
          <a href="#/ajuda">como perguntar à Prefeitura</a>.
        </li>
      </ol>
    </section>

    <section aria-labelledby="t-termos">
      <h2 id="t-termos">Palavras que você vai encontrar</h2>
      <ul class="lista-explicada">
        <li><strong>Edital</strong><p>O documento com as regras da compra: o que será comprado, prazos e condições.</p></li>
        <li><strong>Pregão</strong><p>O tipo mais comum de licitação, geralmente pela internet. Costuma vencer o menor preço.</p></li>
        <li><strong>Homologação</strong><p>O momento em que a Prefeitura confirma o vencedor e a compra pode seguir.</p></li>
      </ul>
      <p>Veja todos os termos no <a href="#/glossario">dicionário de palavras difíceis</a>.</p>
    </section>
  `;
}
