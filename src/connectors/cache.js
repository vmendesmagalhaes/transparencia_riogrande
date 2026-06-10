import { config } from '../config.js';

// Cache simples em localStorage: evita repetir chamadas às APIs da
// Prefeitura a cada navegação e mantém a última resposta boa disponível
// caso a API saia do ar.

const PREFIX = 'tr-rg:';

export function lerCache(chave, { ignorarValidade = false } = {}) {
  try {
    const bruto = localStorage.getItem(PREFIX + chave);
    if (!bruto) return null;
    const { quando, dados } = JSON.parse(bruto);
    if (!ignorarValidade && Date.now() - quando > config.cacheTtlMs) return null;
    return dados;
  } catch {
    return null;
  }
}

export function gravarCache(chave, dados) {
  try {
    localStorage.setItem(PREFIX + chave, JSON.stringify({ quando: Date.now(), dados }));
  } catch {
    // localStorage cheio ou indisponível: segue sem cache.
  }
}
