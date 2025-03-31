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
