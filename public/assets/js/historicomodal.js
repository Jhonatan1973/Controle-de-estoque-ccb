document.getElementById("entradaButton").addEventListener("click", function () {
  var modalHistoricoEntrada = new bootstrap.Modal(
    document.getElementById("modalHistoricoEntrada")
  );
  modalHistoricoEntrada.show();
  carregarHistoricoEntrada();
});
document.getElementById("saidaButton").addEventListener("click", function () {
  var modalHistoricoSaida = new bootstrap.Modal(
    document.getElementById("modalHistoricoSaida")
  );
  modalHistoricoSaida.show();
  carregarHistoricoSaida();
});
function carregarHistoricoEntrada() {
  fetch("http://localhost:3000/historico_entrada")
    .then((response) => response.json())
    .then((data) => {
      const tabelaHistoricoEntrada = document
        .getElementById("tabelaHistoricoEntrada")
        .getElementsByTagName("tbody")[0];
      tabelaHistoricoEntrada.innerHTML = "";
      data.forEach((item) => {
        item.data_entrada = new Date(item.data_entrada).toLocaleDateString(
          "pt-BR"
        );
        const row = tabelaHistoricoEntrada.insertRow();
        row.innerHTML = `
              <td>${item.fornecedor}</td>
              <td>${item.nome_entrada}</td>
              <td>${item.evento_entrada}</td>
              <td>${item.quantidade_entrada}</td>
              <td>${item.numero_nota}</td>
              <td>${item.valor_nota}</td>
              <td>${item.data_entrada}</td>
            `;
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar o histórico de entrada:", error);
    });
}
function carregarHistoricoSaida() {
  fetch("http://localhost:3000/historico_saida")
    .then((response) => response.json())
    .then((data) => {
      const tabelaHistoricoSaida = document
        .getElementById("tabelaHistoricoSaida")
        .getElementsByTagName("tbody")[0];
      tabelaHistoricoSaida.innerHTML = "";
      data.forEach((item) => {
        item.data_saida = new Date(item.data_saida).toLocaleDateString("pt-BR");
        const row = tabelaHistoricoSaida.insertRow();
        row.innerHTML = `
              <td>${item.nome_saida}</td>
              <td>${item.quantidade_retirada}</td>
              <td>${item.evento}</td>
              <td>${item.data_saida}</td>
              <td>${item.quem_retirou}</td>
            `;
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar o histórico de saída:", error);
    });
}
