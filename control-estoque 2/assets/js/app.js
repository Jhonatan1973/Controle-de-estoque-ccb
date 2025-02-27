function salvarAlteracao() {
  const produtoId = document.getElementById("produtoId").value;
  const novaQuantidade = document.getElementById("quantidade").value;

  const dados = {
    id: produtoId,
    quantidade: novaQuantidade,
  };

  fetch(`http://localhost:3000/api/estoque/${produtoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Quantidade alterada com sucesso!");
      carregarEstoque();
      document.getElementById("modalAlterar").style.display = "none";
    })
    .catch((error) => {
      console.error("Erro ao salvar a alteração:", error);
      alert("Erro ao salvar a alteração");
    });
}
function abrirModalAlteracao(produtoId) {
  document.getElementById("produtoId").value = produtoId;
  document.getElementById("modalAlterar").style.display = "block";
}
