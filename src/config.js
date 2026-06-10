// Configuração central das fontes de dados.
//
// Os dados oficiais ficam espalhados em três endereços da Prefeitura:
//   1. https://grp.riogrande.rs.gov.br/transparencia/prefeitura/#/  (sistema GRP — receitas, despesas, licitações, pessoal)
//   2. https://transparencia.riogrande.rs.gov.br/                    (página-índice de transparência)
//   3. https://www.riogrande.rs.gov.br/consulta/...                  (site institucional / LAI / e-SIC)
//
// Este portal "traduz" esses dados para a população. Os conectores em
// src/connectors/ buscam os dados nas APIs e, quando elas estão fora do ar
// (ou os endpoints mudam), usam a última cópia salva localmente
// (src/data/) para que a página nunca fique vazia.

export const config = {
  // Base usada pelo conector GRP. Em desenvolvimento o Vite repassa
  // /api-grp -> https://grp.riogrande.rs.gov.br/transparencia (ver vite.config.js).
  grpApiBase: '/api-grp',

  // Tempo (ms) que uma resposta da API vale no cache do navegador.
  cacheTtlMs: 1000 * 60 * 30, // 30 minutos

  // Ano padrão exibido nas consultas.
  anoPadrao: new Date().getFullYear(),

  // Links oficiais usados em botões "ver na fonte" e na página de ajuda.
  linksOficiais: {
    grp: 'https://grp.riogrande.rs.gov.br/transparencia/prefeitura/#/',
    hubTransparencia: 'https://transparencia.riogrande.rs.gov.br/',
    prefeitura: 'https://www.riogrande.rs.gov.br/consulta/index.php/portal-transparencia',
    esic: 'https://www.riogrande.rs.gov.br/consulta/index.php/portal-transparencia',
  },
};
