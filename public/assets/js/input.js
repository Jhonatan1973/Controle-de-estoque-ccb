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
      } else if (filtro === "Categoria") {
        colunaIndex = 4;
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
