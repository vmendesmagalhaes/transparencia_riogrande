import { dados } from '../connectors/index.js';
import { graficoRosca, tabelaAcessivel } from '../components/graficos.js';
import { numero, dataBr } from '../utils/formato.js';
import { config } from '../config.js';

// Pagina "Quem trabalha na Prefeitura": agora com a relacao REAL de servidores,
// capturada do portal de pessoal da Prefeitura (ver scripts/fetch-rhsys.mjs).

export async function render(container) {
  container.innerHTML = `<p class="carregando" role="status">Buscando a relação de servidores…</p>`;
  const d = await dados.servidores();

  if (!d) {
    // JSON ainda nao gerado: estado honesto, sem numeros inventados.
    container.innerHTML = `
      <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
      <h1>👥 Quem trabalha na Prefeitura?</h1>
      <p class="explicacao">
        Os <strong>servidores públicos</strong> são as pessoas que fazem a cidade funcionar:
        professores, médicos, garis, guardas, engenheiros e muitos outros.
      </p>
      <p class="aviso-amostra" role="note">
        ⚠️ A relação de servidores ainda não foi carregada neste momento. Você pode consultá-la
        diretamente no
        <a href="${config.linksOficiais.grp}" target="_blank" rel="noopener">portal oficial</a>.
      </p>`;
    return;
  }

  const top = (lista, n) => lista.slice(0, n);

  container.innerHTML = `
    <nav aria-label="Você está em"><a href="#/">← Voltar ao início</a></nav>
    <h1>👥 Quem trabalha na Prefeitura?</h1>
    <p class="explicacao">
      Os <strong>servidores públicos</strong> são as pessoas que fazem a cidade funcionar:
      professores, médicos, garis, guardas, engenheiros e muitos outros. Abaixo está a
      relação real, incluindo ativos, aposentados e pensionistas.
    </p>

    <p class="aviso-fonte" role="note">
      ✅ Dados reais da <strong>${d.fonte}</strong>. Atualizado em ${dataBr(d.atualizadoEm)}.
    </p>

    <section class="painel-resumo" aria-label="Resumo de pessoal">
      <div class="cartoes-numeros">
        <div class="numero-grande">
          <span class="valor">${numero(d.total)}</span>
          <span class="legenda">vínculos com a Prefeitura (ativos, aposentados e pensionistas)</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${numero(d.porOrgao.length)}</span>
          <span class="legenda">órgãos e secretarias</span>
        </div>
        <div class="numero-grande">
          <span class="valor">${numero(d.porVinculo.length)}</span>
          <span class="legenda">tipos de vínculo</span>
        </div>
      </div>
    </section>

    <section aria-labelledby="t-vinculo">
      <h2 id="t-vinculo">Por tipo de vínculo</h2>
      <div class="moldura-grafico"><canvas id="g-vinculo" role="img" aria-label="Gráfico com a quantidade de pessoas por tipo de vínculo. Os valores estão na tabela abaixo."></canvas></div>
      ${tabelaAcessivel('Pessoas por tipo de vínculo', d.porVinculo.map((v) => ({ rotulo: v.vinculo, valor: v.quantidade })), numero)}
    </section>

    <section aria-labelledby="t-orgao">
      <h2 id="t-orgao">Por órgão / secretaria</h2>
      <ul class="lista-explicada">
        ${top(d.porOrgao, 12).map((o) => `<li><strong>${o.orgao}</strong> — ${numero(o.quantidade)} pessoas</li>`).join('')}
      </ul>
      ${tabelaAcessivel('Pessoas por órgão', d.porOrgao.map((o) => ({ rotulo: o.orgao, valor: o.quantidade })), numero)}
    </section>

    <section aria-labelledby="t-cargo">
      <h2 id="t-cargo">Cargos mais comuns</h2>
      <ul class="lista-explicada">
        ${top(d.topCargos, 10).map((c) => `<li><strong>${c.cargo}</strong> — ${numero(c.quantidade)} pessoas</li>`).join('')}
      </ul>
    </section>

    <section aria-labelledby="t-busca">
      <h2 id="t-busca">Procurar um servidor</h2>
      <p>Digite um nome, cargo ou secretaria. Mostramos os primeiros 50 resultados.</p>
      <div class="filtro-busca">
        <label for="busca-servidor">Procurar</label>
        <input type="search" id="busca-servidor" placeholder="Ex.: professor, saúde, um nome…" />
      </div>
      <ul class="lista-servidores" id="lista-servidores" aria-live="polite"></ul>
    </section>

    <p class="link-fonte">
      Fonte: portal de transparência de pessoal da Prefeitura.
      <a href="${d.fonteUrl}" target="_blank" rel="noopener">Abrir o portal oficial (nova aba)</a>.
      Observação: os <strong>salários</strong> não estão disponíveis de forma automática neste portal.
    </p>
  `;

  graficoRosca(
    container.querySelector('#g-vinculo'),
    d.porVinculo.map((v) => v.vinculo),
    d.porVinculo.map((v) => v.quantidade),
  );

  const campo = container.querySelector('#busca-servidor');
  const lista = container.querySelector('#lista-servidores');
  const desenhar = (itens) => {
    lista.innerHTML = itens.length
      ? itens.map((s) => `
          <li class="cartao-servidor">
            <strong>${s.nome}</strong>
            <span>${s.cargo} · ${s.orgao}</span>
            <small>${s.vinculo}${s.admissao ? ` · desde ${s.admissao}` : ''}</small>
          </li>`).join('')
      : `<li class="sem-resultado">Nada encontrado. Tente outra palavra.</li>`;
  };
  campo.addEventListener('input', () => {
    const t = campo.value.trim().toLowerCase();
    if (!t) { lista.innerHTML = ''; return; }
    const achados = d.lista
      .filter((s) => `${s.nome} ${s.cargo} ${s.orgao} ${s.vinculo}`.toLowerCase().includes(t))
      .slice(0, 50);
    desenhar(achados);
  });
}
