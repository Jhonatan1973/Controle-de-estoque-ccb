function filtrarTabela() {
  const pesquisa = document.querySelector(".input").value.toLowerCase();
  const filtro = document.getElementById("selected-text").textContent;
  const linhas = document.querySelectorAll("#tabelaEstoque tbody tr");

  linhas.forEach((linha) => {
    let colunaIndex;

    if (filtro === "Nome") {
      colunaIndex = 2;
    } else if (filtro === "Categoria") {
      colunaIndex = 4;
    } else if (filtro === "Número da Nota") {
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
}
