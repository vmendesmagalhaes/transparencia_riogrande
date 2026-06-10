import { dados } from '../connectors/index.js';
import { graficoBarras, graficoRosca, tabelaAcessivel } from '../components/graficos.js';
import { dinheiroCurto } from '../utils/formato.js';
import { config } from '../config.js';

export async function render(container) {
  container.innerHTML = `<p class="carregando" role="status">Buscando os dados de arrecadação…</p>`;
  const [porMes, porOrigem] = await Promise.all([dados.receitasPorMes(), dados.receitasPorOrigem()]);
  const total = porMes.reduce((soma, m) => soma + m.valor, 0);

  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>💰 Quanto dinheiro entrou?</h1>
    <p class="explicacao">
      <strong>Receita</strong> é todo o dinheiro que entra nos cofres da Prefeitura.
      Ele vem principalmente de <strong>impostos pagos na cidade</strong> (como IPTU e ISS)
      e de <strong>repasses</strong> — partes dos impostos federais e estaduais que voltam
      para o município.
    </p>

    <section aria-labelledby="t-mes">
      <h2 id="t-mes">Mês a mês em ${config.anoPadrao}</h2>
      <p>Até agora, entraram <strong>${dinheiroCurto(total)}</strong> neste ano.</p>
      <div class="moldura-grafico"><canvas id="grafico-meses" role="img" aria-label="Gráfico de barras com a arrecadação de cada mês. Os mesmos valores estão disponíveis na tabela abaixo."></canvas></div>
      ${tabelaAcessivel('Arrecadação por mês', porMes.map((m) => ({ rotulo: m.mes, valor: m.valor })), dinheiroCurto)}
    </section>

    <section aria-labelledby="t-origem">
      <h2 id="t-origem">De onde vem esse dinheiro?</h2>
      <div class="moldura-grafico"><canvas id="grafico-origem" role="img" aria-label="Gráfico mostrando a origem do dinheiro arrecadado. Os mesmos valores estão na lista abaixo."></canvas></div>
      <ul class="lista-explicada">
        ${porOrigem.map((o) => `
          <li>
            <strong>${o.origem}</strong> — ${dinheiroCurto(o.valor)}
            <p>${o.explicacao}</p>
          </li>
        `).join('')}
      </ul>
    </section>

    <p class="link-fonte">
      Quer ver cada lançamento em detalhe?
      <a href="${config.linksOficiais.grp}" target="_blank" rel="noopener">Consulte o portal oficial (abre em nova aba)</a>.
    </p>
  `;

  graficoBarras(
    container.querySelector('#grafico-meses'),
    porMes.map((m) => m.mes),
    porMes.map((m) => m.valor),
    'Arrecadado',
  );
  graficoRosca(
    container.querySelector('#grafico-origem'),
    porOrigem.map((o) => o.origem),
    porOrigem.map((o) => o.valor),
  );
}
