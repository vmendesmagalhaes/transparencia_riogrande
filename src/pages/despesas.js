import { dados } from '../connectors/index.js';
import { graficoRosca, tabelaAcessivel } from '../components/graficos.js';
import { dinheiroCurto } from '../utils/formato.js';

export async function render(container) {
  container.innerHTML = `<p class="carregando" role="status">Buscando os dados de gastos…</p>`;
  const [resumo, porArea] = await Promise.all([dados.resumo(), dados.despesasPorArea()]);
  const total = porArea.reduce((soma, a) => soma + a.valor, 0);

  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>🧾 Com o que foi gasto?</h1>
    <p class="explicacao">
      <strong>Despesa</strong> é todo o dinheiro que a Prefeitura paga: salários,
      obras, remédios, merenda escolar e muito mais. Por lei, parte do orçamento
      tem destino obrigatório — por exemplo, no mínimo <strong>25% para educação</strong>
      e <strong>15% para saúde</strong>.
    </p>

    <section aria-labelledby="t-areas">
      <h2 id="t-areas">Para onde foi o dinheiro em ${resumo.exercicio}</h2>
      <p>No total, foram gastos <strong>${dinheiroCurto(resumo.despesaLiquidada)}</strong>.</p>
      <div class="moldura-grafico"><canvas id="grafico-areas" role="img" aria-label="Gráfico mostrando quanto foi gasto em cada área. Os mesmos valores estão na lista abaixo."></canvas></div>
      <ul class="lista-explicada">
        ${porArea.map((a) => {
          const pct = total ? Math.round((a.valor / total) * 100) : 0;
          return `
            <li>
              <strong><span aria-hidden="true">${a.icone}</span> ${a.area}</strong>
              — ${dinheiroCurto(a.valor)} (${pct}% do total)
              ${a.explicacao ? `<p>${a.explicacao}</p>` : ''}
            </li>
          `;
        }).join('')}
      </ul>
      ${tabelaAcessivel('Gastos por área', porArea.map((a) => ({ rotulo: a.area, valor: a.valor })), dinheiroCurto)}
    </section>

    <p class="link-fonte">
      Fonte: <strong>${resumo.fonte}</strong> (despesas liquidadas — o que de fato foi gasto).
      <a href="https://siconfi.tesouro.gov.br/" target="_blank" rel="noopener">Ver no portal do Tesouro Nacional (abre em nova aba)</a>.
    </p>
  `;

  graficoRosca(
    container.querySelector('#grafico-areas'),
    porArea.map((a) => a.area),
    porArea.map((a) => a.valor),
  );
}
