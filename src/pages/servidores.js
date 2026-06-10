import { config } from '../config.js';

// A relacao nominal de servidores e salarios nao esta na base aberta do
// SICONFI. Em vez de inventar numeros, explicamos o tema e levamos a pessoa
// ao portal oficial, onde a folha esta publicada nome a nome.

export async function render(container) {
  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>👥 Quem trabalha na Prefeitura?</h1>
    <p class="explicacao">
      Os <strong>servidores públicos</strong> são as pessoas que fazem a cidade funcionar:
      professores, médicos, garis, guardas, engenheiros e muitos outros.
      Os salários deles são pagos com dinheiro público, por isso são informações abertas —
      qualquer pessoa pode consultar nome, cargo e salário.
    </p>

    <p class="aviso-fonte" role="note">
      ℹ️ A lista nome a nome fica no portal oficial da Prefeitura. Como ainda não há uma
      fonte de dados aberta para trazê-la automaticamente para cá, deixamos o caminho pronto.
      O total gasto com pessoal, porém, já aparece na página
      <a href="#/despesas">"Com o que foi gasto?"</a>, dentro das áreas de Administração,
      Saúde e Educação.
    </p>

    <section aria-labelledby="t-passos">
      <h2 id="t-passos">Como consultar os servidores e salários</h2>
      <ol class="passo-a-passo">
        <li>
          <strong>Abra o portal de transparência da Prefeitura:</strong>
          <a href="${config.linksOficiais.grp}" target="_blank" rel="noopener">portal oficial (abre em nova aba)</a>.
        </li>
        <li>
          <strong>Procure por "Servidores", "Pessoal" ou "Folha de pagamento".</strong>
        </li>
        <li>
          <strong>Pesquise pelo nome ou cargo.</strong>
          É possível ver o salário e o vínculo (concursado, contratado, comissionado).
        </li>
        <li>
          <strong>Quer um dado que não está lá?</strong>
          Você pode pedir à Prefeitura — veja <a href="#/ajuda">como perguntar</a>.
        </li>
      </ol>
    </section>

    <section aria-labelledby="t-vinculos">
      <h2 id="t-vinculos">Tipos de vínculo, em palavras simples</h2>
      <ul class="lista-explicada">
        <li><strong>Concursado (efetivo)</strong><p>Passou em concurso público e tem estabilidade no cargo.</p></li>
        <li><strong>Contratado temporário</strong><p>Contratado por tempo determinado, para uma necessidade específica.</p></li>
        <li><strong>Comissionado (cargo de confiança)</strong><p>Nomeado para um cargo de chefia ou assessoria, sem concurso.</p></li>
      </ul>
    </section>
  `;
}
