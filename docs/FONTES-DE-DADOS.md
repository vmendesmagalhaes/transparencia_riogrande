# Fontes de dados e conectores

Hoje as informações da Prefeitura do Rio Grande estão espalhadas em (pelo menos) três endereços, cada um com formato e navegação diferentes:

| Endereço | O que tem | Tecnologia |
|---|---|---|
| https://grp.riogrande.rs.gov.br/transparencia/prefeitura/#/ | Receitas, despesas, empenhos, licitações, contratos, folha de pessoal, diárias | Sistema GRP (aplicação web que consome APIs REST próprias) |
| https://transparencia.riogrande.rs.gov.br/ | Página-índice que aponta para os vários sistemas | Página estática / institucional |
| https://www.riogrande.rs.gov.br/consulta/index.php/portal-transparencia | Informações institucionais, LAI, e-SIC, documentos | CMS institucional (Joomla/PHP) |

Este projeto centraliza tudo em uma única página em linguagem simples. A captura é feita por **conectores** (`src/connectors/`), que isolam cada fonte:

## Arquitetura dos conectores

```
páginas (src/pages/*)            ← só conhecem o formato "simples"
        │
src/connectors/index.js          ← fachada: normaliza e escolhe a fonte
        │
   ┌────┴─────────┐
src/connectors/grp.js        src/data/amostra.js
(API oficial + cache)        (cópia local de reserva)
```

1. **`grp.js`** chama as APIs do portal GRP, com cache em `localStorage` (30 min). Se a API falhar, devolve a última resposta boa ou `null`.
2. **`index.js`** normaliza a resposta bruta para o formato simples das telas. Se receber `null` ou uma estrutura inesperada, usa a amostra local — a página nunca quebra.
3. **`amostra.js`** guarda dados de exemplo com a mesma estrutura. Enquanto os endpoints reais não forem confirmados, o portal exibe um aviso de "números ilustrativos" (campo `ilustrativo: true`).

## Como confirmar os endpoints reais do GRP

O ambiente onde este projeto foi gerado não tem acesso de rede aos domínios da Prefeitura, então os caminhos em `grp.js` são *placeholders*. Para mapear os reais:

1. Abra https://grp.riogrande.rs.gov.br/transparencia/prefeitura/#/ no navegador.
2. Pressione `F12` → aba **Rede (Network)** → filtre por **XHR/Fetch**.
3. Navegue por "Receitas", "Despesas", "Licitações" e anote as URLs chamadas e o JSON devolvido.
4. Atualize o objeto `ENDPOINTS` em `src/connectors/grp.js` e os normalizadores em `src/connectors/index.js`.
5. Salve uma resposta real de cada endpoint e atualize `src/data/amostra.js` (e remova `ilustrativo: true` quando os dados forem oficiais).

## CORS

As APIs da Prefeitura provavelmente não enviam cabeçalhos CORS para outros domínios. Soluções:

- **Em desenvolvimento:** já resolvido — o Vite repassa `/api-grp/*` para `grp.riogrande.rs.gov.br` (ver `vite.config.js`).
- **Em produção:** configure o mesmo repasse no servidor que hospeda o site (exemplo Nginx):

  ```nginx
  location /api-grp/ {
    proxy_pass https://grp.riogrande.rs.gov.br/transparencia/;
    proxy_set_header Host grp.riogrande.rs.gov.br;
  }
  ```

  Alternativas: uma função serverless (Cloudflare Workers / Vercel) fazendo o repasse, ou um job agendado que baixa os dados periodicamente e publica JSONs estáticos junto com o site (mais barato e mais rápido para o cidadão).
