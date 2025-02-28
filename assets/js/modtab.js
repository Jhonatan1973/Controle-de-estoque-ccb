  // Modal
  const modal = document.getElementById("modalForm");
  const openModalBtn = document.getElementById("openModal");
  const closeModalBtn = document.querySelector(".close-modal");

  openModalBtn.addEventListener("click", function () {
      modal.style.display = "flex";
  });

  closeModalBtn.addEventListener("click", function () {
      modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  });

  // Carregar os dados do estoque ao carregar a página
  document.addEventListener("DOMContentLoaded", function () {
      carregarEstoque();
  });