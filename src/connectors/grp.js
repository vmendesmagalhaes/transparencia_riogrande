import { config } from '../config.js';
import { lerCache, gravarCache } from './cache.js';

// Conector do sistema GRP (grp.riogrande.rs.gov.br/transparencia).
//
// O portal GRP é uma aplicação que consome APIs REST próprias. Os caminhos
// abaixo ficam em um único lugar para que, ao confirmar/ajustar os endpoints
// reais (basta abrir o portal com a aba "Rede" do navegador e copiar as
// URLs), só este arquivo precise mudar. Enquanto um endpoint não responde,
// quem chama recebe `null` e usa a cópia local (ver connectors/index.js).

const ENDPOINTS = {
  receitas: (ano) => `${config.grpApiBase}/api/receita?exercicio=${ano}`,
  despesas: (ano) => `${config.grpApiBase}/api/despesa?exercicio=${ano}`,
  licitacoes: (ano) => `${config.grpApiBase}/api/licitacao?exercicio=${ano}`,
  pessoal: (ano) => `${config.grpApiBase}/api/pessoal?exercicio=${ano}`,
};

async function buscar(chave, url) {
  const emCache = lerCache(chave);
  if (emCache) return emCache;

  try {
    const resposta = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    gravarCache(chave, dados);
    return dados;
  } catch {
    // API fora do ar ou endpoint diferente: tenta a última resposta boa,
    // mesmo vencida; senão devolve null para acionar a cópia local.
    return lerCache(chave, { ignorarValidade: true });
  }
}

export const grp = {
  receitas: (ano) => buscar(`grp:receitas:${ano}`, ENDPOINTS.receitas(ano)),
  despesas: (ano) => buscar(`grp:despesas:${ano}`, ENDPOINTS.despesas(ano)),
  licitacoes: (ano) => buscar(`grp:licitacoes:${ano}`, ENDPOINTS.licitacoes(ano)),
  pessoal: (ano) => buscar(`grp:pessoal:${ano}`, ENDPOINTS.pessoal(ano)),
};
