// Utilitários
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Botão para esconder todas as tabelas e parágrafos
$("#btnToggleTabelas").addEventListener("click", () => {
  $$(
    "#rendimentoBox table, #rendimentoBox p, #compararBox table, #compararBox p, .comparativo-detalhado"
  ).forEach((el) => {
    el.style.display = "none";
  });
});

// Alterna exibição do rendimento
$("#btnRendimento").addEventListener("click", () => {
  $("#rendimentoBox").classList.toggle("hidden");
});
// Fecha rendimentoBox
$("#fecharRendimento").addEventListener("click", () => {
  $("#rendimentoBox").classList.add("hidden");
});

// Alterna entre filtro por produto ou evento
$$("input[name='tipoRendimento']").forEach((radio) => {
  radio.addEventListener("change", () => {
    const isProduto = radio.value === "produto";
    $("#filtroProduto").classList.toggle("hidden", !isProduto);
    $("#filtroEvento").classList.toggle("hidden", isProduto);
    isProduto ? resetarDatasParaMes() : null;
  });
});

// Ajusta campos de data para evento RGE (só ano)
$("#eventoSelect").addEventListener("change", (e) => {
  e.target.value === "RGE" ? alterarDatasParaAno() : resetarDatasParaMes();
});

// Função para ajustar datas para apenas ano
function alterarDatasParaAno() {
  const dataInicio = $("#dataInicio");
  const dataFim = $("#dataFim");
  $("label[for='dataFim']").style.display = "none";

  Object.assign(dataInicio, {
    type: "number",
    placeholder: "Ano de início",
    min: "2000",
    max: "2100",
    value: "",
  });

  dataFim.classList.add("hidden");
}

// Função para resetar campos para formato de data normal
function resetarDatasParaMes() {
  const dataInicio = $("#dataInicio");
  const dataFim = $("#dataFim");
  $("label[for='dataFim']").style.display = "inline";

  Object.assign(dataInicio, {
    type: "date",
    placeholder: "",
    value: "",
  });

  dataFim.type = "date";
  dataFim.value = "";
  dataInicio.classList.remove("hidden");
  dataFim.classList.remove("hidden");
}

// Evento para calcular rendimento
$("#btnCalcularRendimento").addEventListener("click", async () => {
  const tipo = $("input[name='tipoRendimento']:checked")?.value;
  const dataInicio = $("#dataInicio").value;
  const dataFim = !$("#dataFim").classList.contains("hidden")
    ? $("#dataFim").value
    : null;
  let valor =
    tipo === "produto" ? $("#produtoSelect").value : $("#eventoSelect").value;

  if (!tipo || !dataInicio) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    let url = `https://controle-de-estoque-ccb.onrender.com/api/rendimento?tipo=${tipo}&valor=${encodeURIComponent(
      valor
    )}`;

    if (tipo === "evento" && valor === "RGE") {
      url += `&ano=${dataInicio}`;
    } else {
      if (dataInicio) url += `&dataInicio=${dataInicio}`;
      if (dataFim) url += `&dataFim=${dataFim}`;
    }

    const response = await fetch(url);
    const dados = await response.json();

    if (!Array.isArray(dados)) throw new Error("Resposta inesperada");

    const tabela = document.createElement("table");
    tabela.id = "tabelarendimento";
    tabela.innerHTML = `
      <thead>
        <tr>
          <th>Nome</th>
          <th>Evento</th>
          <th>Quantidade</th>
          <th>Nº Nota</th>
          <th>Valor Nota</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        ${dados
          .map(
            (d) => `
          <tr>
            <td>${d.nome_entrada}</td>
            <td>${d.evento_entrada}</td>
            <td>${d.quantidade_entrada}</td>
            <td>${d.numero_nota || ""}</td>
            <td>R$ ${parseFloat(d.valor_nota).toFixed(2)}</td>
            <td>${new Date(d.data_entrada).toLocaleDateString()}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;

    const totalQuantidade = dados.reduce(
      (acc, d) => acc + parseInt(d.quantidade_entrada || 0),
      0
    );
    const totalValor = dados.reduce(
      (acc, d) => acc + parseFloat(d.valor_nota || 0),
      0
    );

    const resumo = document.createElement("p");
    resumo.innerHTML = `
      <strong>Total Quantidade:</strong> ${totalQuantidade}<br>
      <strong>Total Valor:</strong> R$ ${totalValor.toFixed(2)}
    `;

    $("#resultadoRendimento")?.remove();

    const resultado = document.createElement("div");
    resultado.id = "resultadoRendimento";
    resultado.appendChild(tabela);
    resultado.appendChild(resumo);

    $("#rendimentoBox").appendChild(resultado);
  } catch (err) {
    console.error("Erro ao buscar rendimento:", err);
    alert("Erro ao buscar rendimento. Verifique o console.");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Alterna exibição do box de comparação
  $("#btnComparar").addEventListener("click", () => {
    $("#compararBox").classList.toggle("hidden");
    $("#resultadoRendimento")?.remove();
  });

  // Fecha compararBox
  $("#fecharComparar").addEventListener("click", () => {
    $("#compararBox").classList.add("hidden");
  });
});

// Executa comparação de preços
$("#btnExecutarComparacao").addEventListener("click", async () => {
  const produto = $("#produtoComparar").value;
  const mesBase = $("#mesBase").value;
  const mesComparar = $("#mesComparar").value;

  if (!produto || !mesBase || !mesComparar) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const url = "https://controle-de-estoque-ccb.onrender.com/api/comparar-precos";

    const [resBase, resComparar] = await Promise.all([
      fetch(`${url}?produto=${encodeURIComponent(produto)}&data=${mesBase}`),
      fetch(
        `${url}?produto=${encodeURIComponent(produto)}&data=${mesComparar}`
      ),
    ]);

    const [dadosBase, dadosComparar] = await Promise.all([
      resBase.json(),
      resComparar.json(),
    ]);

    const base = dadosBase[0];
    const comparar = dadosComparar[0];

    if (!base || !comparar) {
      alert("Dados insuficientes para comparação.");
      return;
    }

    const precoBase = parseFloat(base.preco_medio) || 0;
    const precoComparar = parseFloat(comparar.preco_medio) || 0;
    const totalBase = precoBase * base.total_quantidade;
    const totalComparar = precoComparar * comparar.total_quantidade;
    const diferenca = totalBase - totalComparar;
    const variacao =
      totalComparar > 0
        ? ((diferenca / totalComparar) * 100).toFixed(2)
        : "0.00";
    const corVariacao = parseFloat(variacao) >= 0 ? "green" : "red";

    const seta = (a, b) => (a > b ? "▲" : a < b ? "▼" : "➖");
    const cor = (a, b) => (a > b ? "red" : a < b ? "green" : "gray");

    const precoBaseHtml = `R$ ${precoBase.toFixed(2)} <span style="color: ${cor(
      precoBase,
      precoComparar
    )};">${seta(precoBase, precoComparar)}</span>`;
    const precoCompararHtml = `R$ ${precoComparar.toFixed(
      2
    )} <span style="color: ${cor(precoComparar, precoBase)};">${seta(
      precoComparar,
      precoBase
    )}</span>`;

    const resultadoHtml = `
      <div class="comparativo-detalhado">
        <h4>Produto: ${produto.charAt(0).toUpperCase() + produto.slice(1)}</h4>
        <table>
          <thead>
            <tr>
              <th>Período</th>
              <th>Preço Unitário</th>
              <th>Quantidade</th>
              <th>Total Gasto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${mesBase}</td>
              <td>${precoBaseHtml}</td>
              <td>${base.total_quantidade}</td>
              <td>R$ ${totalBase.toFixed(2)}</td>
            </tr>
            <tr>
              <td>${mesComparar}</td>
              <td>${precoCompararHtml}</td>
              <td>${comparar.total_quantidade}</td>
              <td>R$ ${totalComparar.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <p><strong>Diferença de gasto:</strong> R$ ${diferenca.toFixed(2)}</p>
        <p><strong>Variação:</strong> <span style="color: ${corVariacao};">${variacao}%</span></p>
      </div>
    `;

    const divResultado = $("#resultadoComparacao");
    divResultado.innerHTML = resultadoHtml;
    divResultado.classList.remove("hidden");
  } catch (err) {
    console.error("Erro ao buscar comparação:", err);
    alert("Erro ao buscar dados para comparação.");
  }
});
