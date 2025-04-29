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
  fetch("https://controle-de-estoque-ccb.onrender.com/api/produtos")
    .then((response) => response.json())
    .then((produtos) => {
      const tabela = document.getElementById("produtos-lista-selecao");
      tabela.innerHTML = "";

      produtos.forEach((produto) => {
        const { quantidade } = produto;
        let corQuantidade = "black";

        // Verifica se o estoque existe
        if (produto.estoque && !isNaN(quantidade)) {
          const { max, med, min } = produto.estoque;
          const diffMax = Math.abs(quantidade - max);
          const diffMed = Math.abs(quantidade - med);
          const diffMin = Math.abs(quantidade - min);

          if (diffMax <= diffMed && diffMax <= diffMin) {
            corQuantidade = "green";
          } else if (diffMed <= diffMax && diffMed <= diffMin) {
            corQuantidade = "orange";
          } else {
            corQuantidade = "red";
          }
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="nome-produto" data-produto-id="${produto.produto_id}">${produto.nome_produto}</td>
          <td id="quantidadeAtual-${produto.produto_id}" style="color: ${corQuantidade}; font-weight: bold;">
            ${produto.quantidade}
          </td>
          <td><span id="quantidadeRetirar-${produto.produto_id}">0</span></td>
          <td>
            <button onclick="alterarQuantidade('${produto.produto_id}', 'mais', ${produto.quantidade})">+</button>
            <button onclick="alterarQuantidade('${produto.produto_id}', 'menos', ${produto.quantidade})">-</button>
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

function alterarQuantidade(produtoId, acao, quantidadeInicial) {
  const quantidadeRetirarElement = document.getElementById(
    `quantidadeRetirar-${produtoId}`
  );
  const quantidadeAtualElement = document.getElementById(
    `quantidadeAtual-${produtoId}`
  );

  let quantidadeRetirar = parseInt(quantidadeRetirarElement.textContent);
  let novaQuantidadeEstoque;

  if (acao === "mais" && quantidadeRetirar < quantidadeInicial) {
    quantidadeRetirar++;
  } else if (acao === "menos" && quantidadeRetirar > 0) {
    quantidadeRetirar--;
  }

  novaQuantidadeEstoque = quantidadeInicial - quantidadeRetirar;

  quantidadeRetirarElement.textContent = quantidadeRetirar;
  quantidadeAtualElement.textContent = novaQuantidadeEstoque;
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
      fetch(
        "https://controle-de-estoque-ccb.onrender.com/api/retirarProdutos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(produtosParaRetirar),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Resposta do servidor:", data);
          if (data.sucesso) {
            mostrarAnimacaoSucesso();
            fecharModalSelecionarRetirada();
            carregarProdutos();
          } else {
            console.error("Erro do servidor:", data);
            alert("Erro ao retirar produtos.");
          }
        })
        .catch((error) => {
          console.error("Erro na requisição de retirada de produtos:", error);
          mostrarAnimacaoErro();
        });
    } else {
      mostrarAnimacaoErro();
    }
  });
function mostrarAnimacaoSucesso() {
  const animacao = document.createElement("div");
  animacao.classList.add("checkbox-wrapper-31");
  animacao.innerHTML = `
      <svg viewBox="0 0 35.6 35.6">
        <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
        <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
        <polyline class="check" points="11.78 18.12 15.55 22.23 25.17 12.87"></polyline>
      </svg>
    `;

  document.body.appendChild(animacao);

  // Remove a animação após um tempo
  setTimeout(() => {
    animacao.remove();
  }, 2000);
}

function mostrarAnimacaoErro() {
  const erro = document.createElement("div");
  erro.classList.add("checkbox-wrapper-31");
  erro.innerHTML = `
      <svg viewBox="0 0 35.6 35.6">
        <circle class="background erro" cx="17.8" cy="17.8" r="17.8"></circle>
        <line class="erro-linha1" x1="10" y1="10" x2="26" y2="26"></line>
        <line class="erro-linha2" x1="26" y1="10" x2="10" y2="26"></line>
      </svg>
    `;

  document.body.appendChild(erro);

  setTimeout(() => {
    erro.remove();
  }, 2000);
}
window.filtrarProdutosSelecaoRetirada = function () {
  const pesquisa = document
    .getElementById("input-pesquisa-selecao-retirada")
    .value.toLowerCase();
  const linhas = document.querySelectorAll("#produtos-lista-selecao tr");

  linhas.forEach((linha) => {
    const nomeProduto = linha
      .querySelector(".nome-produto")
      ?.textContent.toLowerCase();

    if (nomeProduto && nomeProduto.includes(pesquisa)) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  });
};

// Sempre que digitar, já chama a função:
document
  .getElementById("input-pesquisa-selecao-retirada")
  .addEventListener("input", filtrarProdutosSelecaoRetirada);
