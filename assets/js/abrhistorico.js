function abrirModalHistorico() {
  fetch("http://localhost:3000/api/historico")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }
      return response.json();
    })
    .then((data) => {
      const historicoBody = document.getElementById("historicoBody");
      if (data && data.length > 0) {
        data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${new Date(item.data_alteracao).toLocaleDateString()}</td>
            <td>${item.nome_produto}</td>
            <td>${item.quantidade_alterada}</td>
            <td>${item.evento}</td>
            <td>${item.numero_nota || "-"}</td>
            <td>${
              item.valor_nota ? `R$ ${item.valor_nota.toFixed(2)}` : "-"
            }</td>
          `;
          historicoBody.appendChild(row);
        });
        document.getElementById("modalHistorico").style.display = "block";
      } else {
        alert("Não há dados no histórico.");
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar histórico:", error);
      alert("Erro ao carregar o histórico, tente novamente mais tarde.");
    });
}
