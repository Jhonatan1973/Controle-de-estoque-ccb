// Quando o botão de Entrada for clicado
document.getElementById("entradaButton").addEventListener("click", function () {
  // Exibe o modal de Histórico de Entrada
  var modalHistoricoEntrada = new bootstrap.Modal(
    document.getElementById("modalHistoricoEntrada")
  );
  modalHistoricoEntrada.show();

  // Carrega o histórico de entrada
  carregarHistoricoEntrada();
});

// Quando o botão de Saída for clicado
document.getElementById("saidaButton").addEventListener("click", function () {
  // Exibe o modal de Histórico de Saída
  var modalHistoricoSaida = new bootstrap.Modal(
    document.getElementById("modalHistoricoSaida")
  );
  modalHistoricoSaida.show();

  // Carrega o histórico de saída
  carregarHistoricoSaida();
});

function carregarHistoricoEntrada() {
  // Requisição para obter o histórico de entrada
  fetch("http://localhost:3000/historico_entrada") // Certifique-se de usar a URL correta
    .then((response) => response.json())
    .then((data) => {
      // Obtém o corpo da tabela onde os dados serão inseridos
      const tabelaHistoricoEntrada = document
        .getElementById("tabelaHistoricoEntrada")
        .getElementsByTagName("tbody")[0];

      // Limpa a tabela antes de adicionar os novos dados
      tabelaHistoricoEntrada.innerHTML = "";

      // Preenche a tabela com os dados do histórico de entrada
      data.forEach((item) => {
        // Formata a data de entrada para o formato brasileiro
        item.data_entrada = new Date(item.data_entrada).toLocaleDateString(
          "pt-BR"
        );

        // Cria a linha da tabela
        const row = tabelaHistoricoEntrada.insertRow();
        row.innerHTML = `
              <td>${item.fornecedor}</td>
              <td>${item.nome_entrada}</td>
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
  // Requisição para obter o histórico de saída
  fetch("http://localhost:3000/historico_saida") // Requisição correta para histórico de saída
    .then((response) => response.json())
    .then((data) => {
      // Obtém o corpo da tabela onde os dados serão inseridos
      const tabelaHistoricoSaida = document
        .getElementById("tabelaHistoricoSaida")
        .getElementsByTagName("tbody")[0];

      // Limpa a tabela antes de adicionar os novos dados
      tabelaHistoricoSaida.innerHTML = "";

      // Preenche a tabela com os dados do histórico de saída
      data.forEach((item) => {
        // Formata a data de saída para o formato brasileiro
        item.data_saida = new Date(item.data_saida).toLocaleDateString("pt-BR");

        // Cria a linha da tabela
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
