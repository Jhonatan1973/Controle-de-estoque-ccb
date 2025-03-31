document
  .getElementById("abrirModalSelecionarRetirada")
  .addEventListener("click", abrirModalSelecionarRetirada);
document
  .getElementById("fecharModalSelecionarRetirada")
  .addEventListener("click", fecharModalSelecionarRetirada);
function abrirModalSelecionarRetirada() {
  document.getElementById("modal-selecao-retirada").style.display = "flex";
  carregarProdutos();
}
function fecharModalSelecionarRetirada() {
  document.getElementById("modal-selecao-retirada").style.display = "none";
}
function carregarProdutos() {
  fetch("http://localhost:3000/api/produtos")
    .then((response) => response.json())
    .then((produtos) => {
      const tabela = document.getElementById("produtos-lista-selecao");
      tabela.innerHTML = "";
      produtos.forEach((produto) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="nome-produto" data-produto-id="${produto.produto_id}">${produto.nome_produto}</td>
          <td><span id="quantidadeRetirar-${produto.produto_id}">0</span></td>
          <td>
            <button onclick="alterarQuantidade('${produto.produto_id}', 'mais')">+</button>
            <button onclick="alterarQuantidade('${produto.produto_id}', 'menos')">-</button>
          </td>
        `;
        tabela.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar os produtos:", error);
      alert("Erro ao carregar os produtos.");
    });
}
function alterarQuantidade(produtoId, acao) {
  const quantidadeElement = document.getElementById(
    `quantidadeRetirar-${produtoId}`
  );
  let quantidade = parseInt(quantidadeElement.textContent);
  if (acao === "mais") {
    quantidade++;
  } else if (acao === "menos" && quantidade > 0) {
    quantidade--;
  }
  quantidadeElement.textContent = quantidade;
}
document
  .getElementById("confirmar-selecao-retirada")
  .addEventListener("click", function () {
    const produtosParaRetirar = [];
    const linhas = document.querySelectorAll("#produtos-lista-selecao tr");
    linhas.forEach((linha) => {
      const produtoId = linha
        .querySelector(".nome-produto")
        .getAttribute("data-produto-id");
      const quantidadeRetirar =
        parseInt(
          linha.querySelector(`#quantidadeRetirar-${produtoId}`).textContent
        ) || 0;
      if (quantidadeRetirar > 0) {
        produtosParaRetirar.push({
          produto_id: produtoId,
          quantidadeRetirar: quantidadeRetirar,
        });
      }
    });
    console.log("Produtos para retirar:", produtosParaRetirar);
    if (produtosParaRetirar.length > 0) {
      fetch("http://localhost:3000/api/retirarProdutos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtosParaRetirar),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Resposta do servidor:", data);
          if (data.sucesso) {
            alert("Produtos retirados com sucesso!");
            fecharModalSelecionarRetirada();
            carregarProdutos();
          } else {
            console.error("Erro do servidor:", data);
            alert("Erro ao retirar produtos.");
          }
        })
        .catch((error) => {
          console.error("Erro na requisição de retirada de produtos:", error);
          alert("Erro ao comunicar com o servidor.");
        });
    } else {
      alert("Selecione ao menos um produto para retirar.");
    }
  });
