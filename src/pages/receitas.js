import { dados } from '../connectors/index.js';
import { graficoBarras, graficoRosca, tabelaAcessivel } from '../components/graficos.js';
import { dinheiroCurto } from '../utils/formato.js';

export async function render(container) {
  container.innerHTML = `<p class="carregando" role="status">Buscando os dados de arrecadação…</p>`;
  const [resumo, porBimestre, porOrigem] = await Promise.all([
    dados.resumo(),
    dados.receitasPorBimestre(),
    dados.receitasPorOrigem(),
  ]);

  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>💰 Quanto dinheiro entrou?</h1>
    <p class="explicacao">
      <strong>Receita</strong> é todo o dinheiro que entra nos cofres da Prefeitura.
      Ele vem principalmente de <strong>impostos pagos na cidade</strong> (como IPTU e ISS)
      e de <strong>repasses</strong> — partes dos impostos federais e estaduais que voltam
      para o município.
    </p>

    <section aria-labelledby="t-bim">
      <h2 id="t-bim">Arrecadação ao longo de ${resumo.exercicio}</h2>
      <p>Até o período mais recente, entraram <strong>${dinheiroCurto(resumo.receitaRealizada)}</strong> neste ano.</p>
      <div class="moldura-grafico"><canvas id="grafico-bim" role="img" aria-label="Gráfico de barras com a arrecadação acumulada a cada bimestre. Os mesmos valores estão na tabela abaixo."></canvas></div>
      ${tabelaAcessivel('Arrecadação acumulada por bimestre', porBimestre.map((m) => ({ rotulo: m.rotulo, valor: m.valor })), dinheiroCurto)}
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
      Fonte: <strong>${resumo.fonte}</strong>.
      <a href="https://siconfi.tesouro.gov.br/" target="_blank" rel="noopener">Ver no portal do Tesouro Nacional (abre em nova aba)</a>.
    </p>
  `;

  graficoBarras(
    container.querySelector('#grafico-bim'),
    porBimestre.map((m) => m.rotulo),
    porBimestre.map((m) => m.valor),
    'Arrecadado',
  );
  graficoRosca(
    container.querySelector('#grafico-origem'),
    porOrigem.map((o) => o.origem),
    porOrigem.map((o) => o.valor),
  );
}
