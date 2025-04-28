document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("custom-select");
  const selectedText = document.getElementById("selected-text");
  const options = document.querySelectorAll(".option");
  select.addEventListener("click", function (event) {
    this.classList.toggle("active");
    event.stopPropagation();
  });
  document.addEventListener("click", function (event) {
    if (!select.contains(event.target)) {
      select.classList.remove("active");
    }
  });
  options.forEach((option) => {
    option.addEventListener("click", function () {
      selectedText.textContent = this.textContent;
      select.classList.remove("active");
      filtrarTabela();
    });
  });
  window.filtrarTabela = function () {
    const pesquisa = document.querySelector(".input").value.toLowerCase();
    const filtro = selectedText.textContent;
    const linhas = document.querySelectorAll("#tabelaEstoque tbody tr");
    linhas.forEach((linha) => {
      let colunaIndex;
      if (filtro === "Nome") {
        colunaIndex = 1;
      }
      const conteudo = linha
        .querySelector(`td:nth-child(${colunaIndex})`)
        ?.textContent.toLowerCase();

      if (conteudo && conteudo.includes(pesquisa)) {
        linha.style.display = "";
      } else {
        linha.style.display = "none";
      }
    });
  };
});
function capitalizeFirstLetter(input) {
  // Pega o valor do input
  let value = input.value;

  // Se o primeiro caractere for minúsculo, transforma ele em maiúsculo
  if (value.length > 0) {
    value = value.charAt(0).toUpperCase() + value.slice(1);
    input.value = value; // Atualiza o valor do campo de input
  }
}
function filtrarTabelaPorCor() {
  const corSelecionada = document.getElementById("filtroCor").value;
  const linhas = document.querySelectorAll("#tabelcompleta tr");

  linhas.forEach((linha) => {
    const celulas = linha.querySelectorAll("td");
    if (celulas.length > 0) {
      const celulaQuantidade = celulas[3]; // 4ª coluna é a de quantidade
      const corTexto = window.getComputedStyle(celulaQuantidade).color;

      // Transforma cor RGB em nome de cor básico
      const mapaCor = {
        "rgb(255, 0, 0)": "red",
        "rgb(255, 165, 0)": "orange",
        "rgb(0, 128, 0)": "green",
      };

      const cor = mapaCor[corTexto] || "outra";

      if (corSelecionada === "todas" || cor === corSelecionada) {
        linha.style.display = "";
      } else {
        linha.style.display = "none";
      }
    }
  });
}
