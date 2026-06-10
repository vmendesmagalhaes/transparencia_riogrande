import { defineConfig } from 'vite';

// O site e estatico. Os dados oficiais ficam em public/dados/transparencia.json
// (gerado por scripts/fetch-siconfi.mjs e atualizado pelo workflow de dados),
// entao nao ha necessidade de proxy nem de backend.
export default defineConfig({
  base: './',
});
