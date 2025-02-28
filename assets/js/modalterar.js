document.addEventListener("DOMContentLoaded", function () {
  const btnAdicionar = document.getElementById("btnAdicionar");
  const btnRemover = document.getElementById("btnRemover");
  const camposAdicionais = document.getElementById("camposAdicionais");

  // Alterna entre adicionar ou remover
  btnAdicionar.addEventListener("click", function () {
    camposAdicionais.style.display = "block";
    btnAdicionar.classList.add("selected");
    btnRemover.classList.remove("selected");
  });

  btnRemover.addEventListener("click", function () {
    camposAdicionais.style.display = "none";
    btnRemover.classList.add("selected");
    btnAdicionar.classList.remove("selected");
  });

  // Ação do botão "Salvar"
  document
    .getElementById("btnSalvarAlteracao")
    .addEventListener("click", function () {
      const isAdicao = document
        .getElementById("btnAdicionar")
        .classList.contains("selected");
      const btnSalvar = document.getElementById("btnSalvarAlteracao");
      btnSalvar.disabled = true;

      if (isAdicao) {
        adicionarProduto(btnSalvar);
      } else {
        retirarProduto(btnSalvar);
      }
    });

  // Ação do botão "Fechar"
  document
    .querySelector(".close-modal-alterar")
    .addEventListener("click", function () {
      fecharModal();
    });
});

// Função para adicionar produto
function adicionarProduto(btnSalvar) {
  const produtoId = document.getElementById("produtoId").value;
  const quantidade = parseFloat(document.getElementById("quantidade").value);

  if (!produtoId || isNaN(quantidade) || quantidade <= 0) {
    alert("Por favor, preencha o produto e uma quantidade válida.");
    btnSalvar.disabled = false;
    return;
  }

  fetch(`http://localhost:3000/api/estoque/${produtoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantidade: quantidade,
      evento: "Entrada",
      numeroNota: document.getElementById("numeroNota").value || null,
      valorNota: document.getElementById("valorNota").value || null,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert("Produto adicionado com sucesso!");
        carregarEstoque();
        fecharModal();
      } else {
        alert("Erro ao adicionar produto.");
      }
      btnSalvar.disabled = false;
    })
    .catch((error) => {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto.");
      btnSalvar.disabled = false;
    });
}

// Função para retirar produto
function retirarProduto(btnSalvar) {
  const produtoId = document.getElementById("produtoId").value;
  const quantidade = parseFloat(document.getElementById("quantidade").value);

  if (!produtoId || isNaN(quantidade) || quantidade <= 0) {
    alert("Por favor, preencha o produto e uma quantidade válida.");
    btnSalvar.disabled = false;
    return;
  }

  fetch(`http://localhost:3000/api/estoque/${produtoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantidade: quantidade,
      evento: "Saída",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert("Produto retirado com sucesso!");
        carregarEstoque();
        fecharModal();
      } else {
        alert("Erro ao retirar produto.");
      }
      btnSalvar.disabled = false;
    })
    .catch((error) => {
      console.error("Erro ao retirar produto:", error);
      alert("Erro ao retirar produto.");
      btnSalvar.disabled = false;
    });
}

// Função para fechar o modal
function fecharModal() {
  document.getElementById("modalAlterar").style.display = "none";
  document.getElementById("produtoId").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("numeroNota").value = "";
  document.getElementById("valorNota").value = "";
}

// Função para carregar estoque (apenas um exemplo)
function carregarEstoque() {
  console.log("Estoque atualizado.");
}
