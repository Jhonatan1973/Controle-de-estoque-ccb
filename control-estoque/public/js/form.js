document
  .getElementById("formAdicionar")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const novoItem = {
      numeroNota: document.getElementById("numeroNota").value,
      nome: document.getElementById("nome").value,
      quantidade: document.getElementById("quantidade").value,
      categoria: document.getElementById("categoria").value,
      validade: document.getElementById("validade").value,
      estoqueMinimo: document.getElementById("estoqueMinimo").value,
    };

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (
      !novoItem.numeroNota ||
      !novoItem.nome ||
      !novoItem.quantidade ||
      !novoItem.validade ||
      !novoItem.estoqueMinimo
    ) {
      alert("Por favor, preencha todos os campos!");
      return; // Impede o envio do formulário se algum campo estiver vazio
    }

    // Garantir que a data esteja no formato YYYY-MM-DD
    const validadeFormatada = new Date(novoItem.validade)
      .toISOString()
      .split("T")[0];
    novoItem.validade = validadeFormatada;

    // Enviar os dados para o backend
    fetch("http://localhost:3000/api/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoItem),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Novo item adicionado com sucesso!");
        carregarEstoque(); // Recarrega a tabela após adicionar o item
        document.getElementById("formAdicionar").reset(); // Reseta o formulário
      })
      .catch((error) => {
        console.error("Erro ao adicionar item:", error);
        alert("Houve um erro ao adicionar o item. Tente novamente.");
      });
  });
