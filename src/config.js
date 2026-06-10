// Configuracao central das fontes e dos links oficiais.
//
// Os dados de receitas e despesas vem da API aberta do SICONFI (Tesouro
// Nacional) — ver scripts/fetch-siconfi.mjs e docs/FONTES-DE-DADOS.md. Os
// links abaixo apontam para as fontes oficiais usadas nos botoes
// "ver na fonte" e nas paginas de licitacoes/servidores/ajuda.

export const config = {
  linksOficiais: {
    siconfi: 'https://siconfi.tesouro.gov.br/',
    grp: 'https://grp.riogrande.rs.gov.br/transparencia/prefeitura/#/',
    hubTransparencia: 'https://transparencia.riogrande.rs.gov.br/',
    prefeitura: 'https://www.riogrande.rs.gov.br/consulta/index.php/portal-transparencia',
    esic: 'https://www.riogrande.rs.gov.br/consulta/index.php/portal-transparencia',
  },
};
