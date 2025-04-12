document.getElementById("formImobilizado").onsubmit = function (event) {
  event.preventDefault();
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


  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) loadingIndicator.style.display = "block";

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
        return response.json(); 
      } else {
        throw new Error("Erro ao adicionar produto imobilizado");
      }
    })
    .then((data) => {
      console.log("Produto imobilizado adicionado com sucesso:", data);
      document.getElementById("modalImobilizado").style.display = "none";
      alert("Produto imobilizado adicionado com sucesso!");
      if (loadingIndicator) loadingIndicator.style.display = "none";
    })
    .catch((error) => {
      console.error("Erro ao adicionar produto imobilizado:", error);
      alert("Erro ao adicionar produto. Tente novamente.");
      if (loadingIndicator) loadingIndicator.style.display = "none";
    });
};