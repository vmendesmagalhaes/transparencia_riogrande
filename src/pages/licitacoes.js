import { dados } from '../connectors/index.js';
import { dinheiroCurto, dataBr } from '../utils/formato.js';
import { config } from '../config.js';

const COR_SITUACAO = {
  aberta: 'situacao-aberta',
  'em andamento': 'situacao-andamento',
  concluída: 'situacao-concluida',
  concluida: 'situacao-concluida',
};

export async function render(container) {
  container.innerHTML = `<p class="carregando" role="status">Buscando as compras públicas…</p>`;
  const licitacoes = await dados.licitacoes();

  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>🛒 O que a Prefeitura está comprando?</h1>
    <p class="explicacao">
      Quando a Prefeitura precisa comprar algo ou contratar um serviço, ela faz uma
      <strong>licitação</strong>: uma espécie de concurso público entre empresas, em que
      vence quem oferece a melhor proposta. Isso evita favorecimentos e ajuda a
      economizar dinheiro público.
    </p>

    <div class="filtro-busca">
      <label for="busca-licitacao">Procurar por palavra (ex.: merenda, asfalto, remédio)</label>
      <input type="search" id="busca-licitacao" placeholder="Digite o que procura…" />
    </div>

    <ul class="lista-licitacoes" id="lista-licitacoes" aria-live="polite">
      ${licitacoes.map(cartaoLicitacao).join('')}
    </ul>

    <p class="link-fonte">
      Os documentos completos de cada licitação estão no
      <a href="${config.linksOficiais.grp}" target="_blank" rel="noopener">portal oficial (abre em nova aba)</a>.
    </p>
  `;

  const campo = container.querySelector('#busca-licitacao');
  const lista = container.querySelector('#lista-licitacoes');
  campo.addEventListener('input', () => {
    const termo = campo.value.trim().toLowerCase();
    const filtradas = licitacoes.filter((l) =>
      [l.objeto, l.objetoSimples, l.modalidade, l.situacao, l.numero].join(' ').toLowerCase().includes(termo),
    );
    lista.innerHTML = filtradas.length
      ? filtradas.map(cartaoLicitacao).join('')
      : `<li class="sem-resultado">Nada encontrado com "${campo.value}". Tente outra palavra.</li>`;
  });
}

function cartaoLicitacao(l) {
  const classeSituacao = COR_SITUACAO[l.situacao.toLowerCase()] ?? 'situacao-andamento';
  return `
    <li class="cartao-licitacao">
      <div class="licitacao-topo">
        <strong class="licitacao-objeto">${l.objetoSimples || l.objeto}</strong>
        <span class="selo ${classeSituacao}">${l.situacao}</span>
      </div>
      ${l.objetoSimples && l.objetoSimples !== l.objeto ? `<p class="licitacao-detalhe">Nome oficial: ${l.objeto}</p>` : ''}
      <dl class="licitacao-dados">
        <div><dt>Valor estimado</dt><dd>${dinheiroCurto(l.valorEstimado)}</dd></div>
        <div><dt>Tipo</dt><dd>${l.modalidade}</dd></div>
        <div><dt>Data de abertura</dt><dd>${dataBr(l.dataAbertura)}</dd></div>
        <div><dt>Número</dt><dd>${l.numero}</dd></div>
      </dl>
    </li>
  `;
}
