import './styles/main.css';
import { montarBarraAcessibilidade, carregarVLibras } from './components/acessibilidade.js';
import * as inicio from './pages/inicio.js';
import * as receitas from './pages/receitas.js';
import * as despesas from './pages/despesas.js';
import * as licitacoes from './pages/licitacoes.js';
import * as servidores from './pages/servidores.js';
import * as glossario from './pages/glossario.js';
import * as ajuda from './pages/ajuda.js';

const ROTAS = {
  '/': { pagina: inicio, titulo: 'Início', menu: '🏠 Início' },
  '/receitas': { pagina: receitas, titulo: 'Quanto entrou', menu: '💰 Quanto entrou' },
  '/despesas': { pagina: despesas, titulo: 'Com o que foi gasto', menu: '🧾 Gastos' },
  '/licitacoes': { pagina: licitacoes, titulo: 'Compras públicas', menu: '🛒 Compras' },
  '/servidores': { pagina: servidores, titulo: 'Servidores', menu: '👥 Servidores' },
  '/glossario': { pagina: glossario, titulo: 'Dicionário', menu: '📖 Dicionário' },
  '/ajuda': { pagina: ajuda, titulo: 'Pedir informação', menu: '🙋 Pedir informação' },
};

function rotaAtual() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROTAS[hash] ? hash : '/';
}

function montarMenu() {
  const menu = document.getElementById('menu-principal');
  const atual = rotaAtual();
  menu.innerHTML = Object.entries(ROTAS)
    .map(([rota, { menu: rotulo }]) => `
      <li><a href="#${rota}" ${rota === atual ? 'aria-current="page"' : ''}>${rotulo}</a></li>
    `)
    .join('');
}

async function navegar() {
  const rota = rotaAtual();
  const { pagina, titulo } = ROTAS[rota];
  document.title = `${titulo} — Transparência Rio Grande`;
  montarMenu();

  const conteudo = document.getElementById('conteudo');
  // Cancela a leitura em voz alta da página anterior, se houver.
  window.speechSynthesis?.cancel();
  await pagina.render(conteudo);
  // Move o foco para o conteúdo: leitores de tela anunciam a nova página.
  conteudo.focus({ preventScroll: false });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', navegar);

montarBarraAcessibilidade(document.getElementById('barra-acessibilidade'));
carregarVLibras();
navegar();
