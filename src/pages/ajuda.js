import { config } from '../config.js';

export async function render(container) {
  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>🙋 Quero perguntar algo à Prefeitura</h1>
    <p class="explicacao">
      A <strong>Lei de Acesso à Informação</strong> (Lei nº 12.527/2011) garante que
      <strong>qualquer pessoa</strong> pode pedir informações à Prefeitura —
      <strong>de graça</strong>, <strong>sem precisar dizer o motivo</strong> e com
      <strong>prazo de resposta de até 20 dias</strong> (prorrogável por mais 10).
    </p>

    <section aria-labelledby="t-passos">
      <h2 id="t-passos">Como fazer um pedido, passo a passo</h2>
      <ol class="passo-a-passo">
        <li>
          <strong>Pense na sua pergunta.</strong>
          Pode ser qualquer coisa sobre dinheiro ou serviços públicos.
          Exemplos: "Quanto custou a reforma da praça X?", "Quantos professores tem a escola Y?".
        </li>
        <li>
          <strong>Acesse o canal da Prefeitura.</strong>
          Entre na página oficial de transparência e procure por
          <em>e-SIC</em> ou <em>Acesso à Informação</em>:
          <a href="${config.linksOficiais.esic}" target="_blank" rel="noopener">abrir página da Prefeitura (nova aba)</a>.
        </li>
        <li>
          <strong>Escreva a pergunta com suas palavras.</strong>
          Não precisa de linguagem formal nem de advogado.
        </li>
        <li>
          <strong>Guarde o número do pedido.</strong>
          Com ele você acompanha a resposta dentro do prazo.
        </li>
        <li>
          <strong>Não respondeu ou respondeu mal?</strong>
          Você tem direito de recorrer — e pode reclamar na Ouvidoria e no
          Ministério Público se necessário.
        </li>
      </ol>
    </section>

    <section aria-labelledby="t-presencial">
      <h2 id="t-presencial">Prefere atendimento presencial ou por telefone?</h2>
      <p>
        Você também pode fazer pedidos de informação pessoalmente, no protocolo da
        Prefeitura Municipal do Rio Grande. Leve um documento com foto. O atendimento
        presencial tem o mesmo valor legal que o pedido pela internet.
      </p>
    </section>

    <section aria-labelledby="t-direitos">
      <h2 id="t-direitos">Seus direitos, em resumo</h2>
      <ul class="lista-explicada">
        <li><strong>É de graça.</strong> Só podem ser cobrados custos de cópia, se você pedir documentos impressos.</li>
        <li><strong>Não precisa justificar.</strong> Ninguém pode perguntar "para que você quer saber".</li>
        <li><strong>Tem prazo.</strong> Até 20 dias para responder, prorrogáveis por mais 10 com justificativa.</li>
        <li><strong>Negativa tem que ser explicada.</strong> Se negarem, devem dizer o motivo legal e como recorrer.</li>
      </ul>
    </section>
  `;
}
