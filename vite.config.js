import { defineConfig } from 'vite';

// O proxy abaixo permite, em desenvolvimento, consultar as APIs do portal GRP
// da Prefeitura sem esbarrar em CORS: o navegador chama /api-grp/... e o Vite
// repassa para grp.riogrande.rs.gov.br. Em produção, configure o mesmo
// repasse no servidor (Nginx/Apache) ou use uma function serverless.
export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/api-grp': {
        target: 'https://grp.riogrande.rs.gov.br',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-grp/, '/transparencia'),
      },
    },
  },
});
