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

As páginas consomem uma camada de **conectores** (`src/connectors/`) que busca os dados nas APIs do portal GRP da Prefeitura, com cache no navegador e *fallback* automático para uma cópia local (`src/data/amostra.js`) quando a API está indisponível — assim a página nunca fica vazia. Enquanto os endpoints oficiais não forem confirmados, o portal exibe um aviso de **números ilustrativos**.

Detalhes da arquitetura, como mapear os endpoints reais e como resolver CORS em produção: [docs/FONTES-DE-DADOS.md](docs/FONTES-DE-DADOS.md).

## Estrutura

```
index.html               página única (SPA com rotas por #hash)
src/main.js              roteador e inicialização
src/config.js            endereços das fontes e configurações
src/connectors/          captura e normalização dos dados (GRP + cache + fallback)
src/data/amostra.js      cópia local de reserva (dados ilustrativos)
src/pages/               início, receitas, despesas, licitações, servidores, dicionário, ajuda
src/components/          barra de acessibilidade, VLibras, gráficos acessíveis
src/styles/main.css      estilos (letras grandes, alto contraste, mobile-first)
docs/FONTES-DE-DADOS.md  documentação das fontes e dos conectores
```
