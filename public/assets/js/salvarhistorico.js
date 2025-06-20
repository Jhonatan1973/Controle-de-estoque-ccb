document.addEventListener("DOMContentLoaded", () => {
  carregarHistoricoEntrada();
  carregarHistoricoSaida();
  document
    .getElementById("eventoHistoricoSaida")
    .addEventListener("change", filtrarHistoricoSaida);
  document
    .getElementById("confirmar-selecao-retirada")
    .addEventListener("click", function () {
      const produtosParaRetirar = [];
      const linhas = document.querySelectorAll("#produtos-lista-selecao tr");
      linhas.forEach((linha) => {
        const nomeProduto = linha.querySelector(".nome-produto").textContent;
        const quantidadeRetirar =
          parseInt(linha.querySelector("td:nth-child(2)").textContent) || 0;
        if (quantidadeRetirar > 0) {
          const eventoSelect = document.getElementById("evento");
          const eventosSelecionados = Array.from(
            eventoSelect.selectedOptions
          ).map((option) => option.value);
          const quemRetirou = document.getElementById("quem-retirou").value;
          const dataSaida = document.getElementById("data-saida").value;

          if (evento && quemRetirou && dataSaida) {
            produtosParaRetirar.push({
              nome_saida: nomeProduto,
              quantidade_retirada: quantidadeRetirar,
              evento: eventosSelecionados,
              data_saida: dataSaida,
              quem_retirou: quemRetirou,
            });
          }
        }
      });
      if (produtosParaRetirar.length > 0) {
        fetch("https://controle-de-estoque-ccb.onrender.com/historico_saida", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ produtos: produtosParaRetirar }),
        })
          .then((response) => response.json())
          .then((data) => {
            alert(data.message);
            fecharModalSelecionarRetirada();
          })
          .catch((error) => {
            console.error("Erro ao salvar histórico de saída:", error);
          });
      } else {
      }
    });
});
document
  .getElementById("confirmar-selecao-retirada")
  .addEventListener("click", function () {
    const eventoSelect = document.getElementById("evento");
    if (eventoSelect) {
      const eventosSelecionados = Array.from(eventoSelect.selectedOptions).map(
        (option) => option.value
      );
      console.log("Eventos selecionados:", eventosSelecionados);
    }
  });

function filtrarHistoricoSaida() {
  const eventoSelecionado = document.getElementById(
    "eventoHistoricoSaida"
  ).value;
  fetch("https://controle-de-estoque-ccb.onrender.com/historico_saida")
    .then((response) => response.json())
    .then((dados) => {
      // Filtrando os dados pelo evento selecionado
      const dadosFiltrados = eventoSelecionado
        ? dados.filter((item) => item.evento === eventoSelecionado)
        : dados;
      atualizarTabelaHistoricoSaida(dadosFiltrados);
    })
    .catch((error) =>
      console.error("Erro ao filtrar histórico de saída:", error)
    );
}
function atualizarTabelaHistoricoSaida(dados) {
  const tabelaBody = document.getElementById("saidaData");
  tabelaBody.innerHTML = "";
  if (dados.length === 0) {
    tabelaBody.innerHTML = `<tr><td colspan="5" class="text-center">Nenhum resultado encontrado</td></tr>`;
    return;
  }
  dados.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nome_saida}</td>
      <td>${item.quantidade_retirada}</td>
      <td>${item.evento}</td>
      <td>${formatarData(item.data_saida)}</td>
      <td>${item.quem_retirou}</td>
    `;
    tabelaBody.appendChild(tr);
  });
}
function formatarData(dataISO) {
  if (!dataISO) return "";
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
function salvarHistoricoEntrada() {
  const fornecedor = document.getElementById("fornecedor").value;
  const nome_entrada = document.getElementById("produto_entrada").value;
  const preco_unit = document.getElementById("preco-unitario").value;
  const quantidade_entrada = document.getElementById("inputquantidade").value;
  const valor_nota = document.getElementById("valornota").value;
  const data_entrada = document.getElementById("data_entrada").value;

  if (!nome_entrada || !quantidade_entrada || !data_entrada) {
    mostrarAnimacaoErro();
    return;
  }
  fetch("https://controle-de-estoque-ccb.onrender.com/historico_entrada", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fornecedor,
      nome_entrada,
      quantidade_entrada,
      preco_unit,
      valor_nota,
      data_entrada,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      carregarHistoricoEntrada();
    })
    .catch((error) => console.error("Erro ao salvar entrada:", error));
}
function selecionarProduto(linha) {
  linha.classList.add("selected");
  const produtoId = linha
    .querySelector(".nome-produto")
    .getAttribute("data-produto-id");
  const quantidadeRetirar =
    parseInt(
      linha.querySelector(`#quantidadeRetirar-${produtoId}`).textContent
    ) || 0;
  console.log(`Produto ID: ${produtoId} - Quantidade: ${quantidadeRetirar}`);
  if (quantidadeRetirar <= 0) {
    alert("Este produto não está disponível para retirada.");
    linha.classList.remove("selected");
  }
}
document.getElementById("downloadExcel").addEventListener("click", () => {
  window.location.href =
    "https://controle-de-estoque-ccb.onrender.com/download-excel"; // ajuste se o servidor for outro
});
