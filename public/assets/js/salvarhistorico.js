document.addEventListener("DOMContentLoaded", () => {
  carregarHistoricoEntrada();
  carregarHistoricoSaida();
  document
    .getElementById("eventoHistoricoSaida")
    .addEventListener("change", filtrarHistoricoSaida);
});

function salvarHistoricoEntrada() {
  const fornecedor = document.getElementById("fornecedor").value;
  const nome_entrada = document.getElementById("produto_entrada").value;
  const quantidade_entrada = document.getElementById("inputquantidade").value;
  const numero_nota = document.getElementById("numeronota").value;
  const valor_nota = document.getElementById("valornota").value;
  const data_entrada = document.getElementById("data_entrada").value;

  if (!nome_entrada || !quantidade_entrada || !data_entrada) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  fetch("http://localhost:3000/historico_entrada", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fornecedor,
      nome_entrada,
      quantidade_entrada,
      numero_nota,
      valor_nota,
      data_entrada,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      carregarHistoricoEntrada();
    })
    .catch((error) => console.error("Erro ao salvar entrada:", error));
}

function salvarHistoricoSaida() {
  const nome_saida = document.getElementById("nome_saida").value;
  const quantidade_retirada =
    document.getElementById("quantidadeRetirar").value;
  const evento = document.getElementById("evento").value;
  const data_saida = document.getElementById("data_saida").value;
  const quem_retirou = document.getElementById("quem_retirou").value;

  if (
    !nome_saida ||
    !quantidade_retirada ||
    !evento ||
    !data_saida ||
    !quem_retirou
  ) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  fetch("http://localhost:3000/historico_saida", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome_saida,
      quantidade_retirada,
      evento,
      data_saida,
      quem_retirou,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      carregarHistoricoSaida();
    })
    .catch((error) => console.error("Erro ao salvar saída:", error));
}

function carregarHistoricoEntrada() {
  fetch("http://localhost:3000/historico_entrada")
    .then((response) => response.json())
    .then((dados) => {
      atualizarTabelaHistoricoEntrada(dados);
    })
    .catch((error) =>
      console.error("Erro ao carregar histórico de entrada:", error)
    );
}
function carregarHistoricoSaida() {
  fetch("http://localhost:3000/historico_saida")
    .then((response) => response.json())
    .then((dados) => {
      atualizarTabelaHistoricoSaida(dados);
    })
    .catch((error) =>
      console.error("Erro ao carregar histórico de saída:", error)
    );
}

function atualizarTabelaHistoricoEntrada(dados) {
  const tabela = document.getElementById("tabelaHistoricoEntrada");
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Número da Nota</th>
        <th>Valor da Nota</th>
        <th>Data</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabela.querySelector("tbody");

  dados.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome_entrada}</td>
      <td>${item.quantidade_entrada}</td>
      <td>${item.numero_nota}</td>
      <td>${item.valor_nota}</td>
      <td>${formatarData(item.data_entrada)}</td>
    `;
    tbody.appendChild(tr);
  });
}
function atualizarTabelaHistoricoSaida(dados) {
  const tabela = document.getElementById("tabelaHistoricoSaida");
  tabela.innerHTML = `
    <thead>
      <tr>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Evento</th>
        <th>Data</th>
        <th>Quem Retirou</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = tabela.querySelector("tbody");

  dados.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome_saida}</td>
      <td>${item.quantidade_retirada}</td>
      <td>${item.evento}</td>
      <td>${formatarData(item.data_saida)}</td>
      <td>${item.quem_retirou}</td>
    `;
    tbody.appendChild(tr);
  });
}
function filtrarHistoricoSaida() {
  const eventoSelecionado = document.getElementById(
    "eventoHistoricoSaida"
  ).value;

  fetch("http://localhost:3000/historico_saida")
    .then((response) => response.json())
    .then((dados) => {
      let dadosFiltrados = eventoSelecionado
        ? dados.filter((item) => item.evento === eventoSelecionado)
        : dados;

      atualizarTabelaHistoricoSaida(dadosFiltrados);
    })
    .catch((error) => {
      console.error("Erro ao filtrar dados:", error);
    });
}
function formatarData(dataISO) {
  if (!dataISO) return "";
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
