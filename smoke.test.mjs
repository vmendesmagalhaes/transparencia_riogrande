import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><main id="conteudo"></main></body></html>', { url: 'http://localhost/' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.fetch = () => Promise.reject(new Error('offline'));
global.alert = () => {};

const { dinheiroCurto, dataBr } = await import('./src/utils/formato.js');
console.assert(dinheiroCurto(1185300000).includes('bilhão'), 'dinheiroCurto bilhão');
console.assert(dataBr('2026-06-01') === '01/06/2026', 'dataBr');

const { dados } = await import('./src/connectors/index.js');
const resumo = await dados.resumo();
console.assert(resumo.ilustrativo === true, 'fallback para amostra com API offline');
const lic = await dados.licitacoes();
console.assert(lic.length >= 1, 'licitações da amostra');

const main = document.getElementById('conteudo');
for (const nome of ['inicio', 'licitacoes', 'servidores', 'glossario', 'ajuda']) {
  const pagina = await import(`./src/pages/${nome}.js`);
  await pagina.render(main);
  console.assert(main.innerHTML.length > 500, `página ${nome} renderiza`);
  console.log(`OK página ${nome} (${main.querySelector('h1')?.textContent.trim()})`);
}

// Busca de licitações filtra
const licPg = await import('./src/pages/licitacoes.js');
await licPg.render(main);
const campo = main.querySelector('#busca-licitacao');
campo.value = 'merenda';
campo.dispatchEvent(new dom.window.Event('input'));
const itens = main.querySelectorAll('#lista-licitacoes li');
console.assert(itens.length === 1, `filtro de busca (achou ${itens.length})`);
console.log('OK filtro de busca de licitações');
console.log('SMOKE TEST PASSOU');
