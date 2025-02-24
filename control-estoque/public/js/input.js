function filtrarTabela() {
    const pesquisa = document.querySelector(".pesquisa").value.toLowerCase();
    const linhas = document.querySelectorAll(".tabela tbody tr");

    linhas.forEach(linha => {
        const nome = linha.querySelector("td:nth-child(2)").textContent.toLowerCase();
        if (nome.includes(pesquisa)) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}