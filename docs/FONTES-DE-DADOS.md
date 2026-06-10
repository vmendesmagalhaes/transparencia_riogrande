# Fontes de dados e conectores

## De onde vêm os números (receitas e despesas)

Os valores de **receita** e **despesa** exibidos no site são **oficiais** e vêm da
**API aberta do SICONFI** (Sistema de Informações Contábeis e Fiscais do Setor
Público Brasileiro), mantida pelo **Tesouro Nacional**:

- Documentação: https://apidatalake.tesouro.gov.br/docs/siconfi/
- É uma API REST pública, em JSON, **sem necessidade de autenticação**, que cobre
  todos os municípios brasileiros.
- Usamos o **RREO** (Relatório Resumido da Execução Orçamentária), publicado a cada
  bimestre — o mesmo relatório que a Prefeitura é obrigada a entregar por lei.
- Município: **Rio Grande/RS**, código IBGE **4315602**.

### Por que SICONFI e não o portal GRP da Prefeitura?

O portal GRP (`grp.riogrande.rs.gov.br`) está atrás de um **firewall de aplicação
(WAF SafeLine)** que **bloqueia qualquer acesso automatizado** — responde `403` com
a mensagem "ACESSO NÃO AUTORIZADO" para qualquer requisição que não venha de um
navegador real interagindo com a página. Isso impede a captura programática dos
dados, tanto de um servidor quanto de um robô.

O SICONFI publica **os mesmos números oficiais** (a Prefeitura envia seus relatórios
para lá) de forma **aberta, estável e sem bloqueio** — por isso é a fonte ideal para
alimentar este portal automaticamente.

## Como os dados são capturados e atualizados

```
API SICONFI (Tesouro)
        │  (GitHub Actions, internet livre)
scripts/fetch-siconfi.mjs        ← baixa o RREO e converte para o formato simples
        │
public/dados/transparencia.json  ← dados oficiais versionados no repositório
        │  (Vite copia para o build)
src/connectors/index.js          ← o site lê este JSON estático
        │
   páginas (receitas, despesas, início)
```

1. **`scripts/fetch-siconfi.mjs`** consulta o SICONFI (RREO Anexo 01 — receitas e
   balanço; Anexo 02 — despesa por função), descobre o bimestre mais recente com
   dados publicados, e grava `public/dados/transparencia.json` no formato simples
   que as telas entendem. Se os dados vierem incompletos, ele **aborta** em vez de
   publicar números vazios.
2. **`.github/workflows/dados.yml`** roda esse script (nos servidores do GitHub, que
   têm internet livre — o sandbox de desenvolvimento não alcança o SICONFI), e faz
   commit do JSON quando ele muda. Roda manualmente, quando o script muda, e
   mensalmente (o RREO é bimestral). O commit dispara o deploy.
3. **`src/connectors/index.js`** apenas carrega esse JSON. Se ele ainda não existir
   (antes do primeiro run do workflow), cai para uma amostra local com aviso de
   "ilustrativo", para a página nunca quebrar.

### Atualizar os dados manualmente

Na aba **Actions** do repositório, rode o workflow **"Atualizar dados oficiais
(SICONFI)"** (botão *Run workflow*). Ele regenera o JSON e, havendo mudança, publica.

## O que ainda não é automático

A base aberta do SICONFI cobre **receitas e despesas**. Ela **não inclui**:

- **Licitações** (editais, fornecedores, resultados);
- **Folha de pessoal nominal** (nome, cargo e salário de cada servidor).

Para esses temas não há, hoje, uma fonte de dados aberta e sem bloqueio equivalente.
Em vez de exibir números inventados, as páginas correspondentes explicam o tema e
levam a pessoa, em poucos passos, até a consulta oficial no portal da Prefeitura.
Quando houver uma fonte aberta para esses dados, basta criar um novo conector seguindo
o mesmo padrão de `fetch-siconfi.mjs`.

## Campos usados do RREO (referência técnica)

Cada item da resposta do SICONFI tem, entre outros: `conta`, `coluna`, `valor`,
`cod_conta`, `instituicao`, `cod_ibge`, `populacao`, `exercicio`, `periodo`.

- **Receita total realizada**: conta `RECEITAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)`,
  coluna contendo `REALIZADAS ATÉ O BIMESTRE` (Anexo 01).
- **Despesa total liquidada**: conta `DESPESAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)`,
  coluna contendo `LIQUIDADAS ATÉ O BIMESTRE` (Anexo 02).
- **Despesa por área**: contas que são **funções de governo** (lista canônica em
  `FUNCOES`, dentro do script), evitando contar subfunções em dobro.
- **Receita por origem**: categorias econômicas (impostos, transferências, etc.),
  agrupadas em rótulos amigáveis.
