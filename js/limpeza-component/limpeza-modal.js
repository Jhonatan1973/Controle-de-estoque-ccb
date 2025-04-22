document
  .getElementById("openModalGerenciarProdutolimpeza")
  .addEventListener("click", function () {
    document.getElementById("modalAdicionarLimpeza").style.display = "flex";
  });
document
  .querySelector("#modalAdicionarLimpeza .close-adicionar-produto")
  .addEventListener("click", function () {
    document.getElementById("modalAdicionarLimpeza").style.display = "none";
  });
document
  .getElementById("modalAdicionarLimpeza")
  .addEventListener("click", function (event) {
    if (event.target === document.getElementById("modalAdicionarLimpeza")) {
      document.getElementById("modalAdicionarLimpeza").style.display = "none";
    }
  });
document
  .getElementById("addLimpezaForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      nomeLimpeza: document.getElementById("nomeLimpeza").value,
      uniCompraLimpeza: document.getElementById("uniCompraLimpeza").value,
      uniMedidaLimpeza: document.getElementById("uniMedidaLimpeza").value,
      quantidadeLimpeza: document.getElementById("quantidadeLimpeza").value,
      validadeLimpeza: document.getElementById("validadeLimpeza").value,
      estoqueMaxLimpeza: document.getElementById("estoqueMaxLimpeza").value,
      estoqueMedLimpeza: document.getElementById("estoqueMedLimpeza").value,
      estoqueMinLimpeza: document.getElementById("estoqueMinLimpeza").value,
    };

    fetch("https://controle-de-estoque-ccb.onrender.com/limpeza", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        alert(response.mensagem || "Produto adicionado!");
        document.getElementById("addLimpezaForm").reset();
        document.getElementById("modalAdicionarLimpeza").style.display = "none";
      })
      .catch((error) => {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao adicionar produto.");
      });
  });
