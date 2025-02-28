document
  .getElementById("formAdicionar")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const novoItem = {
      numero_nota: document.getElementById("numero_nota").value,
      nome: document.getElementById("nome").value,
      quantidade: document.getElementById("quantidade").value,
      Categoria: document.getElementById("categoria").value,
      validade: document.getElementById("validade").value,
      estoqueMinimo: document.getElementById("estoqueMinimo").value,
    };
    fetch("http://localhost:3000/api/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoItem),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Novo item adicionado com sucesso!");
        carregarEstoque();
        document.getElementById("formAdicionar").reset();
      })
      .catch((error) => {
        console.error("Erro ao adicionar item:", error);
      });
  });
