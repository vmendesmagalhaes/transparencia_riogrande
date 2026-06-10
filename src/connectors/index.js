import { config } from '../config.js';
import { grp } from './grp.js';
import { amostra } from '../data/amostra.js';

// Fachada única de dados usada pelas páginas.
//
// Regra: tenta o conector da fonte oficial (GRP); se não houver resposta,
// usa a cópia local em src/data/amostra.js. Assim a página nunca quebra e
// fica claro para o usuário quando os números são ilustrativos
// (campo `ilustrativo: true`).
//
// Os normalizadores (normalizarReceitas etc.) convertem o formato bruto da
// API para o formato simples que as telas entendem. Como os contratos das
// APIs ainda serão confirmados, eles validam o mínimo e desistem com
// segurança em caso de estrutura inesperada.

function normalizarReceitas(bruto) {
  if (!Array.isArray(bruto?.meses)) return null;
  return bruto.meses.map((m) => ({ mes: m.descricao ?? m.mes, valor: Number(m.arrecadado ?? m.valor) || 0 }));
}

function normalizarDespesas(bruto) {
  if (!Array.isArray(bruto?.funcoes)) return null;
  return bruto.funcoes.map((f) => ({
    area: f.descricao ?? f.funcao,
    valor: Number(f.pago ?? f.valor) || 0,
    icone: '📋',
    explicacao: '',
  }));
}

function normalizarLicitacoes(bruto) {
  const lista = Array.isArray(bruto) ? bruto : bruto?.itens;
  if (!Array.isArray(lista)) return null;
  return lista.map((l) => ({
    numero: l.numero ?? l.numeroProcesso ?? '',
    objeto: l.objeto ?? '',
    objetoSimples: l.objeto ?? '',
    modalidade: l.modalidade ?? '',
    situacao: l.situacao ?? l.status ?? '',
    valorEstimado: Number(l.valorEstimado ?? l.valor) || 0,
    dataAbertura: l.dataAbertura ?? l.data ?? '',
  }));
}

export const dados = {
  async resumo(ano = config.anoPadrao) {
    // O resumo da página inicial combina várias fontes; por ora deriva da
    // amostra e, quando houver dados reais de receitas, soma a partir deles.
    const receitas = await this.receitasPorMes(ano);
    const arrecadado = receitas.reduce((soma, m) => soma + m.valor, 0);
    const usandoAmostra = receitas === amostra.receitasPorMes;
    return {
      ...amostra.resumo,
      ano,
      receitaArrecadada: usandoAmostra ? amostra.resumo.receitaArrecadada : arrecadado,
      ilustrativo: usandoAmostra,
    };
  },

  async receitasPorMes(ano = config.anoPadrao) {
    const bruto = await grp.receitas(ano);
    return normalizarReceitas(bruto) ?? amostra.receitasPorMes;
  },

  async receitasPorOrigem() {
    // Endpoint específico ainda não mapeado; usa a cópia local.
    return amostra.receitasPorOrigem;
  },

  async despesasPorArea(ano = config.anoPadrao) {
    const bruto = await grp.despesas(ano);
    return normalizarDespesas(bruto) ?? amostra.despesasPorArea;
  },

  async licitacoes(ano = config.anoPadrao) {
    const bruto = await grp.licitacoes(ano);
    return normalizarLicitacoes(bruto) ?? amostra.licitacoes;
  },

  async pessoal(ano = config.anoPadrao) {
    const bruto = await grp.pessoal(ano);
    if (bruto?.totalAtivos) return bruto;
    return amostra.pessoal;
  },
};
