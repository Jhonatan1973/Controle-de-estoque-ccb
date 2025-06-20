function retirarImobilizado() {
  const codigo = document.getElementById("codigo-imobilizado")?.value;
  const quantidade = parseInt(
    document.getElementById("quantidade-imobilizado")?.value
  );

  if (!codigo || isNaN(quantidade) || quantidade <= 0) {
    alert("Informe um código válido e uma quantidade maior que zero.");
    return;
  }

  // Encode the code to ensure it's valid in the URL
  const codigoCodificado = encodeURIComponent(codigo);

  fetch(`https://controle-de-estoque-ccb.onrender.com/imobilizados/${codigoCodificado}/retirar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantidade }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        alert("Quantidade retirada com sucesso!");
        fecharModAlterarImob(); // Fecha o modal após a operação
      }
    })
    .catch((error) => {
      console.error("Erro ao retirar quantidade:", error);
      alert("Erro ao retirar quantidade.");
    });
}
