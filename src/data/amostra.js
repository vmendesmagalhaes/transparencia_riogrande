// Dados de amostra (estrutura idêntica à devolvida pelos conectores).
// Servem para desenvolvimento e como reserva quando as APIs oficiais
// estiverem indisponíveis. Os valores abaixo são ILUSTRATIVOS e devem ser
// substituídos por uma carga real assim que os endpoints forem confirmados
// (ver docs/FONTES-DE-DADOS.md).

export const amostra = {
  resumo: {
    ano: 2026,
    receitaArrecadada: 1185300000,
    despesaPaga: 1112750000,
    licitacoesAbertas: 14,
    servidoresAtivos: 7842,
    atualizadoEm: '2026-06-01',
    ilustrativo: true,
  },

  receitasPorMes: [
    { mes: 'Jan', valor: 98500000 },
    { mes: 'Fev', valor: 91200000 },
    { mes: 'Mar', valor: 104800000 },
    { mes: 'Abr', valor: 99300000 },
    { mes: 'Mai', valor: 102700000 },
    { mes: 'Jun', valor: 0 },
    { mes: 'Jul', valor: 0 },
    { mes: 'Ago', valor: 0 },
    { mes: 'Set', valor: 0 },
    { mes: 'Out', valor: 0 },
    { mes: 'Nov', valor: 0 },
    { mes: 'Dez', valor: 0 },
  ],

  receitasPorOrigem: [
    { origem: 'Impostos da cidade (IPTU, ISS, ITBI)', valor: 312000000, explicacao: 'Dinheiro pago pelos moradores e empresas da cidade.' },
    { origem: 'Repasses do Governo Federal', valor: 401000000, explicacao: 'Parte dos impostos federais que volta para o município.' },
    { origem: 'Repasses do Governo do Estado', valor: 287000000, explicacao: 'Parte dos impostos estaduais (como ICMS) que volta para o município.' },
    { origem: 'Convênios e outras receitas', valor: 185300000, explicacao: 'Acordos para obras e serviços, taxas, aluguéis e multas.' },
  ],

  despesasPorArea: [
    { area: 'Saúde', valor: 318000000, icone: '🏥', explicacao: 'Postos de saúde, hospitais, remédios e salários de médicos e enfermeiros.' },
    { area: 'Educação', valor: 296000000, icone: '🏫', explicacao: 'Escolas, merenda, transporte escolar e salários de professores.' },
    { area: 'Administração', valor: 152000000, icone: '🏛️', explicacao: 'Funcionamento da Prefeitura: prédios, sistemas e pessoal administrativo.' },
    { area: 'Obras e Urbanismo', valor: 121000000, icone: '🚧', explicacao: 'Asfalto, calçadas, praças, iluminação e drenagem.' },
    { area: 'Assistência Social', valor: 87500000, icone: '🤝', explicacao: 'Apoio a famílias em situação de vulnerabilidade, CRAS e abrigos.' },
    { area: 'Saneamento e Meio Ambiente', valor: 74250000, icone: '💧', explicacao: 'Água, esgoto, coleta de lixo e proteção ambiental.' },
    { area: 'Outras áreas', valor: 64000000, icone: '📋', explicacao: 'Cultura, esporte, segurança, agricultura e demais serviços.' },
  ],

  licitacoes: [
    {
      numero: '042/2026',
      objeto: 'Compra de merenda escolar para as escolas municipais',
      objetoSimples: 'Comida para as escolas',
      modalidade: 'Pregão Eletrônico',
      situacao: 'Aberta',
      valorEstimado: 4800000,
      dataAbertura: '2026-06-18',
    },
    {
      numero: '038/2026',
      objeto: 'Contratação de empresa para pavimentação asfáltica de vias urbanas',
      objetoSimples: 'Asfalto para ruas da cidade',
      modalidade: 'Concorrência',
      situacao: 'Aberta',
      valorEstimado: 12500000,
      dataAbertura: '2026-06-25',
    },
    {
      numero: '035/2026',
      objeto: 'Aquisição de medicamentos para a rede municipal de saúde',
      objetoSimples: 'Remédios para os postos de saúde',
      modalidade: 'Pregão Eletrônico',
      situacao: 'Em andamento',
      valorEstimado: 3200000,
      dataAbertura: '2026-05-30',
    },
    {
      numero: '029/2026',
      objeto: 'Serviços de manutenção de iluminação pública',
      objetoSimples: 'Conserto de postes de luz',
      modalidade: 'Pregão Eletrônico',
      situacao: 'Concluída',
      valorEstimado: 1900000,
      dataAbertura: '2026-04-12',
    },
    {
      numero: '021/2026',
      objeto: 'Aquisição de uniformes e material escolar',
      objetoSimples: 'Uniformes e material para alunos',
      modalidade: 'Pregão Eletrônico',
      situacao: 'Concluída',
      valorEstimado: 2100000,
      dataAbertura: '2026-03-05',
    },
  ],

  pessoal: {
    totalAtivos: 7842,
    folhaMensal: 58200000,
    porVinculo: [
      { vinculo: 'Servidores efetivos (concursados)', quantidade: 5510 },
      { vinculo: 'Contratos temporários', quantidade: 1230 },
      { vinculo: 'Cargos de confiança (comissionados)', quantidade: 402 },
      { vinculo: 'Estagiários', quantidade: 700 },
    ],
  },
};
