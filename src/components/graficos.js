import {
  Chart,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { dinheiroCurto } from '../utils/formato.js';

Chart.register(BarController, BarElement, DoughnutController, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Paleta com bom contraste e distinguível para daltônicos.
export const CORES = ['#1d6fb8', '#e8742c', '#2c9070', '#8a5cb8', '#c2483e', '#5b6770', '#caa53d'];

const fonteGrande = { font: { size: 15 } };

export function graficoBarras(canvas, rotulos, valores, rotuloSerie) {
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: rotulos,
      datasets: [{ label: rotuloSerie, data: valores, backgroundColor: CORES[0], borderRadius: 6 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => dinheiroCurto(ctx.parsed.y) } },
      },
      scales: {
        y: { ticks: { ...fonteGrande, callback: (v) => dinheiroCurto(v) } },
        x: { ticks: fonteGrande },
      },
    },
  });
}

export function graficoRosca(canvas, rotulos, valores) {
  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: rotulos,
      datasets: [{ data: valores, backgroundColor: CORES, borderWidth: 2, borderColor: '#fff' }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { ...fonteGrande, boxWidth: 18, padding: 14 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${dinheiroCurto(ctx.parsed)}` } },
      },
    },
  });
}

// Todo gráfico ganha uma tabela equivalente (visível sob demanda), para
// leitores de tela e para quem prefere números a desenhos.
export function tabelaAcessivel(titulo, linhas, formatarValor) {
  const corpo = linhas
    .map((l) => `<tr><th scope="row">${l.rotulo}</th><td>${formatarValor(l.valor)}</td></tr>`)
    .join('');
  return `
    <details class="tabela-dados">
      <summary>Ver estes dados em formato de tabela</summary>
      <table>
        <caption class="sr-only">${titulo}</caption>
        <thead><tr><th scope="col">Item</th><th scope="col">Valor</th></tr></thead>
        <tbody>${corpo}</tbody>
      </table>
    </details>
  `;
}
