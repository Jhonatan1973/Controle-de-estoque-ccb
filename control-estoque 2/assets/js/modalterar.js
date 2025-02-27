// Fechar o modal ao clicar no X
document.querySelectorAll(".close-modal").forEach((element) => {
  element.addEventListener("click", () => {
    document.getElementById("modalAlterar").style.display = "none";
  });
});

// Fechar o modal ao clicar fora dele
window.addEventListener("click", (event) => {
  const modalAlterar = document.getElementById("modalAlterar");
  if (event.target === modalAlterar) {
    modalAlterar.style.display = "none";
  }
});
