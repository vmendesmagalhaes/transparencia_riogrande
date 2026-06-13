// Captura a RELACAO DE SERVIDORES real de Rio Grande/RS diretamente do portal
// de transparencia de pessoal da Prefeitura (sistema "rhsysportaltransp").
//
// Diferente do portal financeiro GRP (que esta atras de um WAF que bloqueia
// acesso automatizado), este portal serve os dados a qualquer visitante apos
// um "handshake" simples de sessao, SEM captcha (a propria configuracao do
// portal informa exigeCaptcha:"N"). Reproduzir esse handshake e acessar dados
// publicos por LAI e legitimo.
//
// Fluxo:
//   1. GET /rhsysportaltransp/            -> cookie inicial (INGRESSCOOKIE)
//   2. GET /api/tracking/check-config     -> cookie de sessao (JSESSIONID)
//   3. GET /api/relacaoservidores?page=N  -> 25 servidores por pagina
//
// Os salarios (api/remuneracaoportal) NAO sao usados: nesta instalacao o
// endpoint responde HTTP 500 (recurso desativado). Por isso so publicamos a
// relacao de servidores, sem remuneracao.
//
// Saida: public/dados/servidores.json

import { writeFile, mkdir } from 'node:fs/promises';

const BASE = 'https://transparencia.riogrande.rs.gov.br/rhsysportaltransp';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const cookies = {};
const cookieHeader = () => Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');

function guardarCookies(resp) {
  const lista = typeof resp.headers.getSetCookie === 'function' ? resp.headers.getSetCookie() : [];
  for (const linha of lista) {
    const par = linha.split(';')[0];
    const i = par.indexOf('=');
    if (i > 0) cookies[par.slice(0, i).trim()] = par.slice(i + 1).trim();
  }
}

async function get(path, accept = 'application/json, text/plain, */*') {
  const resp = await fetch(BASE + path, {
    headers: {
      'User-Agent': UA,
      Accept: accept,
      'Accept-Language': 'pt-BR,pt;q=0.9',
      Referer: BASE + '/',
      ...(cookieHeader() ? { Cookie: cookieHeader() } : {}),
    },
  });
  guardarCookies(resp);
  return resp;
}

async function handshake() {
  await get('/', 'text/html,application/xhtml+xml');
  const cfg = await get('/api/tracking/check-config');
  if (!cfg.ok) throw new Error(`check-config falhou: HTTP ${cfg.status}`);
  if (!cookies.JSESSIONID) throw new Error('Sessao nao estabelecida (sem JSESSIONID).');
}

async function buscarTodosServidores() {
  const todos = [];
  let pagina = 1;
  let total = Infinity;
  while (todos.length < total) {
    const resp = await get(`/api/relacaoservidores?page=${pagina}&rows=25`);
    if (!resp.ok) throw new Error(`relacaoservidores pagina ${pagina}: HTTP ${resp.status}`);
    const json = await resp.json();
    total = Number(json.count) || todos.length;
    const lote = Array.isArray(json.dados) ? json.dados : [];
    if (lote.length === 0) break;
    todos.push(...lote);
    pagina += 1;
    if (pagina > 600) break; // trava de seguranca
  }
  return { todos, total };
}

function contar(lista, chave) {
  const mapa = new Map();
  for (const item of lista) {
    const k = item[chave] || '(não informado)';
    mapa.set(k, (mapa.get(k) || 0) + 1);
  }
  return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
}

async function main() {
  console.log('Estabelecendo sessao no portal de pessoal...');
  await handshake();
  console.log('Sessao OK. Baixando a relacao de servidores (25 por pagina)...');
  const { todos, total } = await buscarTodosServidores();
  console.log(`Recebidos ${todos.length} de ${total} servidores.`);

  if (todos.length === 0) throw new Error('Nenhum servidor retornado — abortando.');

  const porVinculo = contar(todos, 'nmvinculo').map(([vinculo, quantidade]) => ({ vinculo, quantidade }));
  const porOrgao = contar(todos, 'nmorgao').map(([orgao, quantidade]) => ({ orgao, quantidade }));
  const topCargos = contar(todos, 'nmcargo').slice(0, 20).map(([cargo, quantidade]) => ({ cargo, quantidade }));

  // Lista compacta para a busca no site (sem matricula, para nao expor chave).
  const lista = todos.map((s) => ({
    nome: s.nmfuncionario,
    cargo: s.nmcargo,
    orgao: s.nmorgao,
    vinculo: s.nmvinculo,
    admissao: s.admissao,
  }));

  const dados = {
    fonte: 'Portal da Transparência de Pessoal — Prefeitura de Rio Grande/RS',
    fonteUrl: `${BASE}/`,
    atualizadoEm: new Date().toISOString().slice(0, 10),
    total: todos.length,
    totalInformado: total,
    porVinculo,
    porOrgao,
    topCargos,
    lista,
  };

  await mkdir('public/dados', { recursive: true });
  await writeFile('public/dados/servidores.json', JSON.stringify(dados) + '\n');
  console.log('OK: public/dados/servidores.json gerado.');
  console.log(`  Total de servidores: ${todos.length}`);
  console.log(`  Vínculos: ${porVinculo.length} | Órgãos: ${porOrgao.length} | Cargos distintos no top: ${topCargos.length}`);
}

main().catch((e) => {
  console.error('FALHA:', e.message);
  process.exit(1);
});
