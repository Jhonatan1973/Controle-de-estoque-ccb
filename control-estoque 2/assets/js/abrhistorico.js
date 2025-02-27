function abrirModalHistorico() {
  fetch("http://localhost:3000/api/historico")
    .then((response) => response.json())
    .then((data) => {
      const historicoBody = document.getElementById("historicoBody");
      historicoBody.innerHTML = ""; // Limpar tabela antes de adicionar novos dados

      // Preencher a tabela com os dados do histórico
      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${new Date(item.data_alteracao).toLocaleDateString()}</td>
          <td>${item.nome_produto}</td>
          <td>${item.quantidade_alterada}</td>
          <td>${item.evento}</td>
          <td>${item.numero_nota || "-"}</td>
          <td>${item.valor_nota ? `R$ ${item.valor_nota.toFixed(2)}` : "-"}</td>
        `;
        historicoBody.appendChild(row);
      });

      // Exibir o modal
      document.getElementById("modalHistorico").style.display = "block";
    })
    .catch((error) => console.error("Erro ao carregar histórico:", error));
}
function fecharModalHistorico() {
  document.getElementById("modalHistorico").style.display = "none";
}
