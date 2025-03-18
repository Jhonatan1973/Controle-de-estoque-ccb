document.getElementById("formImobilizado").onsubmit = function (event) {
  event.preventDefault(); // Impede o comportamento padrão do formulário (não recarregar a página)

  // Coletar os dados dos campos do formulário
  const codigo_imobilizados = document.getElementById(
    "codigo_imobilizados"
  ).value;
  const nome_imobilizados = document.getElementById("nome_imobilizados").value;
  const quantidade_imobilizados = document.getElementById(
    "quantidade_imobilizados"
  ).value;
  const fornecedor_imobilizados = document.getElementById(
    "fornecedor_imobilizados"
  ).value;
  const dependencia = document.getElementById("dependencia").value;
  const dt_aquisicao = document.getElementById("dt_aquisicao").value;
  const status = document.getElementById("status").value;

  // Mostrar um carregando enquanto a requisição está em andamento (opcional)
  const loadingIndicator = document.getElementById("loadingIndicator"); // Assumindo que você tenha esse elemento
  if (loadingIndicator) loadingIndicator.style.display = "block"; // Mostrar o carregamento

  // Enviar os dados para o backend via Fetch API
  fetch("http://localhost:3000/imobilizados", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codigo_imobilizados,
      nome_imobilizados,
      quantidade_imobilizados,
      fornecedor_imobilizados,
      dependencia,
      dt_aquisicao,
      status,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Espera a resposta JSON do servidor
      } else {
        throw new Error("Erro ao adicionar produto imobilizado");
      }
    })
    .then((data) => {
      console.log("Produto imobilizado adicionado com sucesso:", data);

      // Fechar o modal após o sucesso
      document.getElementById("modalImobilizado").style.display = "none";

      // Feedback de sucesso para o usuário
      alert("Produto imobilizado adicionado com sucesso!");

      // Ocultar o indicador de carregamento
      if (loadingIndicator) loadingIndicator.style.display = "none";
    })
    .catch((error) => {
      console.error("Erro ao adicionar produto imobilizado:", error);
      alert("Erro ao adicionar produto. Tente novamente.");

      // Ocultar o indicador de carregamento
      if (loadingIndicator) loadingIndicator.style.display = "none";
    });
};
