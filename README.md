# Transparência Rio Grande — fácil de entender

Portal cidadão que reúne, organiza e **traduz para linguagem simples** os dados públicos da Prefeitura Municipal do Rio Grande/RS, hoje espalhados em três endereços diferentes:

- [Portal GRP](https://grp.riogrande.rs.gov.br/transparencia/prefeitura/#/) — receitas, despesas, licitações, pessoal
- [transparencia.riogrande.rs.gov.br](https://transparencia.riogrande.rs.gov.br/) — página-índice
- [Site da Prefeitura](https://www.riogrande.rs.gov.br/consulta/index.php/portal-transparencia) — LAI, e-SIC, institucional

O objetivo é que **qualquer pessoa, de qualquer nível de escolaridade**, consiga responder perguntas como *"quanto dinheiro entrou?"*, *"com o que foi gasto?"* e *"o que a Prefeitura está comprando?"* — sem precisar conhecer termos como "empenho" ou "execução orçamentária".

## Como o portal facilita o acesso

- **Navegação por perguntas**, não por jargão: "Quanto dinheiro entrou?" em vez de "Execução da Receita".
- **Linguagem simples em tudo**: cada número vem com explicação; valores em formato legível ("R$ 1,2 bilhão" em vez de "1.185.300.000,00").
- **Dicionário de palavras difíceis** com exemplos do dia a dia.
- **Acessibilidade de verdade**:
  - Widget **VLibras** (governo federal) — tradução automática para Língua Brasileira de Sinais;
  - Botão **"Ouvir a página"** — leitura em voz alta (Web Speech API), importante para pessoas com baixa alfabetização ou baixa visão;
  - Controles de **tamanho de letra** e **alto contraste**, com preferência salva no aparelho;
  - Navegação completa por teclado, *skip link*, foco visível, `aria-*` e tabelas equivalentes para todos os gráficos;
  - Layout leve, de uma coluna, que funciona bem em celulares simples.
- **Gráficos dinâmicos** (Chart.js) com paleta amigável para daltônicos.
- **Busca simples** em licitações e no dicionário.
- Página **"Quero perguntar algo à Prefeitura"** com o passo a passo do e-SIC/LAI.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # gera a versão final em dist/
npm run preview  # testa a versão final
```

## De onde vêm os dados

Os números de **receitas e despesas são oficiais**, vindos da **API aberta do SICONFI** (Tesouro Nacional) — o RREO de Rio Grande/RS (código IBGE 4315602). O script `scripts/fetch-siconfi.mjs` baixa esses dados e gera `public/dados/transparencia.json`, atualizado automaticamente pelo workflow `.github/workflows/dados.yml` (mensal e sob demanda). O site lê esse JSON estático — sem backend, sem CORS, sem depender de portais bloqueados.

> Por que SICONFI e não o portal GRP da Prefeitura? O portal GRP está atrás de um firewall (WAF) que bloqueia acesso automatizado. O SICONFI publica os **mesmos números oficiais** de forma aberta e estável.

A **relação de servidores** (nome, cargo, órgão, vínculo, admissão) é capturada diretamente do portal de pessoal da Prefeitura (`rhsysportaltransp`), via `scripts/fetch-rhsys.mjs` → `public/dados/servidores.json`. Os **salários** não estão disponíveis nesse portal (endpoint desativado), e **licitações** não têm fonte aberta — nesses casos o site orienta a consulta oficial em vez de inventar números.

Detalhes da arquitetura e referência técnica dos campos: [docs/FONTES-DE-DADOS.md](docs/FONTES-DE-DADOS.md).

## Estrutura

```
index.html                    página única (SPA com rotas por #hash)
src/main.js                   roteador e inicialização
src/config.js                 links das fontes oficiais
src/connectors/index.js       lê o JSON oficial (fallback para amostra)
src/data/amostra.js           cópia local de reserva (só se o JSON real faltar)
src/pages/                    início, receitas, despesas, licitações, servidores, dicionário, ajuda
src/components/               barra de acessibilidade, VLibras, gráficos acessíveis
src/styles/main.css           estilos (letras grandes, alto contraste, mobile-first)
scripts/fetch-siconfi.mjs     captura os dados oficiais do SICONFI
public/dados/transparencia.json  dados oficiais (gerado pelo script/workflow)
.github/workflows/dados.yml   atualização automática dos dados
docs/FONTES-DE-DADOS.md       documentação das fontes
```
