// Função para carregar os dados do estoque na tabela
function carregarEstoque() {
  fetch("http://localhost:3000/api/estoque")
    .then((response) => response.json())
    .then((data) => {
      const tabelaEstoque = document
        .getElementById("tabelaEstoque")
        .getElementsByTagName("tbody")[0];
      tabelaEstoque.innerHTML = "";

      data.forEach((produto) => {
        const novaLinha = tabelaEstoque.insertRow();
        novaLinha.insertCell(0).textContent = produto.numero_nota;
        novaLinha.insertCell(1).textContent = produto.nome;
        novaLinha.insertCell(2).textContent = produto.quantidade;
        novaLinha.insertCell(3).textContent = produto.categoria;
        const dataValidade = new Date(produto.validade);
        const dataFormatada = dataValidade.toLocaleDateString("pt-BR");
        novaLinha.insertCell(4).textContent = dataFormatada;
        novaLinha.insertCell(5).textContent = produto.estoque_min;
        const celulaAcao = novaLinha.insertCell(6);
        const botaoAlterar = document.createElement("button");

        botaoAlterar.classList.add("btnAlterar");

        botaoAlterar.textContent = "Alterar";

        botaoAlterar.addEventListener("click", () => {
          document.getElementById("data").value = produto.validade;
          document.getElementById("evento").value = produto.evento || "RGE";
          document.getElementById("quantidade").value = produto.quantidade;

          document.getElementById("produtoId").value = produto.id;

          const modalAlterar = document.getElementById("modalAlterar");
          modalAlterar.style.display = "block";
        });

        celulaAcao.appendChild(botaoAlterar);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar o estoque:", error);
    });
}

function salvarAlteracao() {
  const produtoId = document.getElementById("produtoId").value;
  const novaQuantidade = document.getElementById("quantidade").value;
  const novaData = document.getElementById("data").value;
  const evento = document.getElementById("evento").value;

  const dados = {
    id: produtoId,
    quantidade: novaQuantidade,
    validade: novaData,
    evento: evento,
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
      carregarEstoque(); // Recarregar a tabela após a alteração
      document.getElementById("modalAlterar").style.display = "none"; // Fechar o modal
    })
    .catch((error) => {
      console.error("Erro ao salvar a alteração:", error);
      alert("Erro ao salvar a alteração");
    });
}

// Função para fechar o modal
document
  .getElementById("modalAlterar")
  .querySelector(".close-modal")
  .addEventListener("click", () => {
    document.getElementById("modalAlterar").style.display = "none";
  });

// Evento para salvar as alterações no botão "Salvar"
document
  .getElementById("btnSalvarAlteracao")
  .addEventListener("click", salvarAlteracao);

// Chamar a função para carregar os dados ao carregar a página
document.addEventListener("DOMContentLoaded", carregarEstoque);
