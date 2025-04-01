document.getElementById("logo").addEventListener("click", function () {
  window.location.href = "/";
});
function testarSelecao() {
  const selectElement = document.getElementById("evento");
  const selecionados = Array.from(selectElement.selectedOptions).map(
    (opt) => opt.value
  );
  alert("Selecionados: " + selecionados.join(", "));
}
// Função para abrir/fechar a barra lateral
function toggleSideBar() {
  const sideBar = document.getElementById("sideBar");
  sideBar.classList.toggle("active");
}

// Função para fechar a barra lateral
function closeSideBar() {
  const sideBar = document.getElementById("sideBar");
  sideBar.classList.remove("active");
}

// Fechar a barra lateral se o usuário clicar fora dela
document.addEventListener("click", function (event) {
  const sideBar = document.getElementById("sideBar");
  const img = document.getElementById("img-ccb");

  // Verifica se o clique foi fora da barra lateral e da imagem
  if (!sideBar.contains(event.target) && event.target !== img) {
    closeSideBar();
  }
});
