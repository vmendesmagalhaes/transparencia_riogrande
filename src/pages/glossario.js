// Glossário em linguagem simples: cada termo técnico do mundo da gestão
// pública traduzido para o dia a dia, com exemplo concreto.

const TERMOS = [
  {
    termo: 'Receita',
    simples: 'Todo o dinheiro que ENTRA nos cofres da Prefeitura.',
    exemplo: 'O IPTU que você paga vira receita do município.',
  },
  {
    termo: 'Despesa',
    simples: 'Todo o dinheiro que SAI dos cofres da Prefeitura.',
    exemplo: 'O salário dos professores e a compra de remédios são despesas.',
  },
  {
    termo: 'Orçamento',
    simples: 'O planejamento de quanto vai entrar e quanto vai sair de dinheiro durante o ano. É como o planejamento de gastos de uma família, só que da cidade inteira.',
    exemplo: 'O orçamento define quanto a Saúde e a Educação vão receber no ano.',
  },
  {
    termo: 'Licitação',
    simples: 'Um "concurso" entre empresas para vender algo para a Prefeitura. Vence quem oferece a melhor proposta, normalmente o menor preço.',
    exemplo: 'Para comprar merenda escolar, a Prefeitura faz uma licitação entre fornecedores.',
  },
  {
    termo: 'Pregão',
    simples: 'O tipo mais comum de licitação, geralmente feito pela internet (pregão eletrônico). É mais rápido e qualquer pessoa pode acompanhar.',
    exemplo: 'A compra de material de escritório costuma ser feita por pregão.',
  },
  {
    termo: 'Empenho',
    simples: 'A "reserva" do dinheiro para um gasto já aprovado. É o primeiro passo antes de pagar alguém.',
    exemplo: 'Antes de pagar a empresa do asfalto, a Prefeitura empenha (reserva) o valor.',
  },
  {
    termo: 'Repasse',
    simples: 'Dinheiro que o Governo Federal ou o Estado envia para o município. É a parte dos impostos federais e estaduais que volta para a cidade.',
    exemplo: 'Parte do ICMS pago no estado volta para Rio Grande como repasse.',
  },
  {
    termo: 'Convênio',
    simples: 'Um acordo entre a Prefeitura e outro órgão (ou entidade) para fazer algo juntos, geralmente com envio de dinheiro para um fim específico.',
    exemplo: 'Um convênio com o Ministério da Saúde pode financiar a reforma de um posto.',
  },
  {
    termo: 'Servidor público',
    simples: 'Pessoa que trabalha para a Prefeitura, concursada ou contratada.',
    exemplo: 'Professores da rede municipal e médicos dos postos são servidores.',
  },
  {
    termo: 'Folha de pagamento',
    simples: 'A soma de todos os salários pagos pela Prefeitura em um mês.',
    exemplo: 'A folha inclui salários, gratificações e encargos dos servidores.',
  },
  {
    termo: 'LAI (Lei de Acesso à Informação)',
    simples: 'Lei que garante a qualquer pessoa o direito de pedir informações aos órgãos públicos, de graça e sem precisar explicar o motivo.',
    exemplo: 'Você pode perguntar quanto custou uma obra da sua rua — e a Prefeitura é obrigada a responder.',
  },
  {
    termo: 'e-SIC',
    simples: 'O canal na internet para fazer pedidos de informação usando a LAI.',
    exemplo: 'Pelo e-SIC você registra a pergunta e acompanha a resposta com prazo.',
  },
];

export async function render(container) {
  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>📖 Dicionário de palavras difíceis</h1>
    <p class="explicacao">
      O mundo da gestão pública está cheio de termos complicados. Aqui está cada
      um deles explicado em <strong>palavras simples</strong>, com um exemplo do dia a dia.
    </p>

    <div class="filtro-busca">
      <label for="busca-termo">Procurar uma palavra</label>
      <input type="search" id="busca-termo" placeholder="Ex.: licitação" />
    </div>

    <dl class="glossario" id="lista-glossario" aria-live="polite">
      ${TERMOS.map(itemGlossario).join('')}
    </dl>
  `;

  const campo = container.querySelector('#busca-termo');
  const lista = container.querySelector('#lista-glossario');
  campo.addEventListener('input', () => {
    const termo = campo.value.trim().toLowerCase();
    const filtrados = TERMOS.filter((t) => `${t.termo} ${t.simples}`.toLowerCase().includes(termo));
    lista.innerHTML = filtrados.length
      ? filtrados.map(itemGlossario).join('')
      : `<p class="sem-resultado">Nenhuma palavra encontrada. Tente escrever de outro jeito.</p>`;
  });
}

function itemGlossario(t) {
  return `
    <div class="termo-glossario">
      <dt>${t.termo}</dt>
      <dd>
        <p>${t.simples}</p>
        <p class="exemplo"><strong>Exemplo:</strong> ${t.exemplo}</p>
      </dd>
    </div>
  `;
}
