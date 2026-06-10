// Barra de acessibilidade: tamanho da letra, alto contraste e leitura em
// voz alta (Web Speech API, disponível na maioria dos celulares e
// navegadores, sem instalar nada). As preferências ficam salvas no aparelho.

const CHAVE = 'tr-rg:a11y';

function preferencias() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) ?? { fonte: 0, contraste: false };
  } catch {
    return { fonte: 0, contraste: false };
  }
}

function salvar(prefs) {
  try { localStorage.setItem(CHAVE, JSON.stringify(prefs)); } catch { /* sem armazenamento */ }
}

function aplicar(prefs) {
  document.documentElement.style.fontSize = `${100 + prefs.fonte * 12.5}%`;
  document.documentElement.classList.toggle('alto-contraste', prefs.contraste);
}

function lerEmVozAlta() {
  if (!('speechSynthesis' in window)) {
    alert('Seu navegador não tem leitura em voz alta. Tente usar o Chrome ou o celular.');
    return;
  }
  const sintese = window.speechSynthesis;
  if (sintese.speaking) {
    sintese.cancel();
    return;
  }
  const texto = document.getElementById('conteudo')?.innerText ?? '';
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  fala.rate = 0.95;
  sintese.speak(fala);
}

export function montarBarraAcessibilidade(container) {
  const prefs = preferencias();
  aplicar(prefs);

  container.innerHTML = `
    <button type="button" data-acao="menor" aria-label="Diminuir tamanho da letra" title="Diminuir letra">A−</button>
    <button type="button" data-acao="maior" aria-label="Aumentar tamanho da letra" title="Aumentar letra">A+</button>
    <button type="button" data-acao="contraste" aria-pressed="${prefs.contraste}" aria-label="Ativar ou desativar alto contraste" title="Alto contraste">◐</button>
    <button type="button" data-acao="ouvir" aria-label="Ouvir o conteúdo da página em voz alta" title="Ouvir a página">🔊 Ouvir</button>
  `;

  container.addEventListener('click', (evento) => {
    const botao = evento.target.closest('button');
    if (!botao) return;
    const acao = botao.dataset.acao;
    if (acao === 'maior') prefs.fonte = Math.min(prefs.fonte + 1, 4);
    if (acao === 'menor') prefs.fonte = Math.max(prefs.fonte - 1, -1);
    if (acao === 'contraste') {
      prefs.contraste = !prefs.contraste;
      botao.setAttribute('aria-pressed', String(prefs.contraste));
    }
    if (acao === 'ouvir') {
      lerEmVozAlta();
      return;
    }
    aplicar(prefs);
    salvar(prefs);
  });
}

// Carrega o widget oficial VLibras (governo federal), que traduz o conteúdo
// para a Língua Brasileira de Sinais — essencial para pessoas surdas.
export function carregarVLibras() {
  const script = document.createElement('script');
  script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
  script.onload = () => {
    // eslint-disable-next-line no-undef
    new window.VLibras.Widget('https://vlibras.gov.br/app');
  };
  document.body.appendChild(script);
}
