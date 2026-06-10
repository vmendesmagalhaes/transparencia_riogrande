// Formatação de números pensada para leitura fácil.

const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const inteiro = new Intl.NumberFormat('pt-BR');

export function dinheiro(valor) {
  return real.format(valor);
}

// "R$ 1,2 bilhão" em vez de "R$ 1.185.300.000" — muito mais fácil de ler.
export function dinheiroCurto(valor) {
  if (valor >= 1_000_000_000) return `R$ ${(valor / 1_000_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bilhão`;
  if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} milhões`;
  if (valor >= 1_000) return `R$ ${(valor / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`;
  return real.format(valor);
}

export function numero(valor) {
  return inteiro.format(valor);
}

export function dataBr(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}
