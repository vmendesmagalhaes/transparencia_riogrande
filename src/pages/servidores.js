import { dados } from '../connectors/index.js';
import { dinheiroCurto, numero } from '../utils/formato.js';
import { config } from '../config.js';

export async function render(container) {
  container.innerHTML = `<p class="carregando" role="status">Buscando os dados de pessoal…</p>`;
  const pessoal = await dados.pessoal();

  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>👥 Quem trabalha na Prefeitura?</h1>
    <p class="explicacao">
      Os <strong>servidores públicos</strong> são as pessoas que fazem a cidade funcionar:
      professores, médicos, garis, guardas, engenheiros e muitos outros.
      Os salários deles são pagos com dinheiro público, por isso são informações abertas.
    </p>

    <section class="painel-resumo" aria-label="Resumo do pessoal">
      <div class="cartoes-numeros">
        <div class="numero-grande">
          <span class="valor">${numero(pessoal.totalAtivos)}</span>
          <span class="legenda">servidores ativos</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${dinheiroCurto(pessoal.folhaMensal)}</span>
          <span class="legenda">é o custo da folha de pagamento por mês</span>
        </div>
      </div>
    </section>

    <section aria-labelledby="t-vinculo">
      <h2 id="t-vinculo">Tipos de vínculo</h2>
      <ul class="lista-explicada">
        ${pessoal.porVinculo.map((v) => `
          <li><strong>${v.vinculo}</strong> — ${numero(v.quantidade)} pessoas</li>
        `).join('')}
      </ul>
    </section>

    <p class="link-fonte">
      A lista completa, com nome, cargo e salário de cada servidor, está no
      <a href="${config.linksOficiais.grp}" target="_blank" rel="noopener">portal oficial (abre em nova aba)</a>.
    </p>
  `;
}
