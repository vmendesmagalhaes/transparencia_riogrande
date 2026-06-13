import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><main id="conteudo"></main></body></html>', { url: 'http://localhost/' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
// Sem servidor: o fetch do JSON real falha e o conector cai para a amostra.
global.fetch = () => Promise.reject(new Error('offline'));
global.alert = () => {};

const { dinheiroCurto, dataBr } = await import('./src/utils/formato.js');
console.assert(dinheiroCurto(1185300000).includes('bilhão'), 'dinheiroCurto bilhão');
console.assert(dataBr('2026-06-01') === '01/06/2026', 'dataBr');

const { dados } = await import('./src/connectors/index.js');
const resumo = await dados.resumo();
console.assert(resumo.ilustrativo === true, 'fallback para amostra quando o JSON real nao existe');
console.assert(typeof resumo.receitaRealizada === 'number', 'resumo tem receitaRealizada');
const areas = await dados.despesasPorArea();
console.assert(Array.isArray(areas) && areas.length >= 1, 'despesas por area');
const origem = await dados.receitasPorOrigem();
console.assert(Array.isArray(origem) && origem.length >= 1, 'receitas por origem');
const srv = await dados.servidores();
console.assert(srv === null, 'servidores() devolve null com segurança quando o JSON não existe');

const main = document.getElementById('conteudo');
for (const nome of ['inicio', 'receitas', 'despesas', 'licitacoes', 'servidores', 'glossario', 'ajuda']) {
  const pagina = await import(`./src/pages/${nome}.js`);
  await pagina.render(main);
  console.assert(main.innerHTML.length > 500, `página ${nome} renderiza`);
  console.log(`OK página ${nome} (${main.querySelector('h1')?.textContent.trim()})`);
}

// Valida o transformador do SICONFI: deve ignorar subfuncoes/totais e ordenar.
const { montarDespesasPorAreaTest } = await import('./scripts/fetch-siconfi.mjs');
const exemplo = [
  { conta: 'Saúde', coluna: 'DESPESAS LIQUIDADAS ATÉ O BIMESTRE (d)', valor: 1000 },
  { conta: 'Educação', coluna: 'DESPESAS LIQUIDADAS ATÉ O BIMESTRE (d)', valor: 800 },
  { conta: 'Atenção Básica', coluna: 'DESPESAS LIQUIDADAS ATÉ O BIMESTRE (d)', valor: 500 },
  { conta: 'DESPESAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)', coluna: 'DESPESAS LIQUIDADAS ATÉ O BIMESTRE (d)', valor: 1800 },
];
const r = montarDespesasPorAreaTest(exemplo);
console.assert(r.length === 2 && r[0].area === 'Saúde', `transformador ignora subfuncao e ordena (${JSON.stringify(r.map(x => x.area))})`);
console.log('OK transformador SICONFI');

console.log('SMOKE TEST PASSOU');
