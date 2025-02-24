const tableKey = "estoqueDados";

function filtrarTabela() {
  const pesquisa = document.querySelector(".pesquisa").value.toLowerCase();
  const linhas = document.querySelectorAll(".tabela tbody tr");

  linhas.forEach((linha) => {
    const nome = linha
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    if (nome.includes(pesquisa)) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  });
}

function abrirModal(button) {
  const linha = button.closest("tr");
  const quantidadeElement = linha.querySelector(".quantidade");
  const quantidadeAtual = parseInt(quantidadeElement.textContent);

  document.getElementById("quantidade").value = 0;
  document.getElementById("modal").style.display = "block";

  window.quantidadeElement = quantidadeElement;
  window.quantidadeAtual = quantidadeAtual;
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function confirmarAlteracao() {
  const valorAlteracao = parseInt(document.getElementById("quantidade").value);
  if (!isNaN(valorAlteracao)) {
    const novaQuantidade = window.quantidadeAtual + valorAlteracao;
    if (novaQuantidade < 0) {
      alert("Não é possível diminuir o estoque para um valor negativo.");
    } else {
      const nomeProduto = window.quantidadeElement
        .closest("tr")
        .querySelector("td:nth-child(2)").textContent; // Nome do produto
      window.quantidadeElement.textContent = novaQuantidade;
      adicionarAoHistorico(
        `${nomeProduto} foi modificado para ${novaQuantidade} em ${getDataAtual()}`
      );
      salvarDados();
    }
  } else {
    alert("Por favor, insira um valor válido.");
  }
  fecharModal();
}

function getDataAtual() {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function salvarDados() {
  const linhas = document.querySelectorAll(".tabela tbody tr");
  const estoque = Array.from(linhas).map((tr) => {
    const numero_nota = tr.querySelector("td:nth-child(1)").textContent;
    const nome = tr.querySelector("td:nth-child(2)").textContent;
    const quantidade = parseInt(
      tr.querySelector(".quantidade").textContent,
      10
    );
    const categoria = tr.querySelector("td:nth-child(4)").textContent;
    const validade = tr.querySelector("td:nth-child(5)").textContent;
    const estoqueMinimo = parseInt(
      tr.querySelector("td:nth-child(6)").textContent,
      10
    );
    return {
      numero_nota,
      nome,
      quantidade,
      categoria,
      validade,
      estoqueMinimo,
    };
  });

  localStorage.setItem(tableKey, JSON.stringify(estoque));
}
document.addEventListener("DOMContentLoaded", function () {
  atualizarHistorico();
});

function carregarDados() {
  const dados = localStorage.getItem(tableKey);
  if (dados) {
    const estoque = JSON.parse(dados);
    const tbody = document.querySelector(".tabela tbody");
    tbody.innerHTML = "";

    estoque.forEach((produto) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td class="editavel" data-tipo="numero_nota">${produto.numero_nota}</td>
                <td class="editavel" data-tipo="nome">${produto.nome}</td>
                <td class="quantidade">${produto.quantidade}</td>
                <td class="editavel" data-tipo="categoria">${produto.categoria}</td>
                <td class="editavel" data-tipo="validade">${produto.validade}</td>
                <td class="editavel" data-tipo="estoqueMinimo">${produto.estoqueMinimo}</td>
                <td><button onclick="abrirModal(this)">Baixa</button></td>
            `;

      const editaveis = tr.querySelectorAll(".editavel");
      editaveis.forEach((celula) => {
        celula.addEventListener("click", editarCelula);
      });

      tbody.appendChild(tr);
    });
  }
}

let linhaSelecionada = null; // Variável para armazenar a linha selecionada
function mostrarBotaoExcluir(button) {
  if (linhaSelecionada) {
    linhaSelecionada.querySelector(".excluir").style.display = "none";
  }
  linhaSelecionada = button.closest("tr");
  linhaSelecionada.querySelector(".excluir").style.display = "block";
}

function excluirLinha(button) {
  const linha = button.closest("tr");
  linha.remove();
  salvarDados();
  linhaSelecionada = null;
}
