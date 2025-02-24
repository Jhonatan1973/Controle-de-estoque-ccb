function carregarEstoque() {
  fetch("http://localhost:3000/api/estoque")
    .then((response) => response.json()) // Converte a resposta para JSON
    .then((data) => {
      const tabelaEstoque = document
        .getElementById("tabelaEstoque")
        .getElementsByTagName("tbody")[0];
      tabelaEstoque.innerHTML = ""; // Limpa a tabela antes de adicionar novos dados

      // Itera sobre cada item de estoque e adiciona uma linha na tabela
      data.forEach((produto) => {
        const novaLinha = tabelaEstoque.insertRow();
        novaLinha.insertCell(0).textContent = produto.numero_nota;
        novaLinha.insertCell(1).textContent = produto.nome;
        novaLinha.insertCell(2).textContent = produto.quantidade;
        novaLinha.insertCell(3).textContent = produto.categoria;
        novaLinha.insertCell(4).textContent = produto.validade;
        novaLinha.insertCell(5).textContent = produto.estoque_min;
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar o estoque:", error); // Verifica erros no console
    });
}
