document.addEventListener("DOMContentLoaded", function () {
  const btnValidades = document.getElementById("validades-venci");

  btnValidades.addEventListener("click", function () {
    setTimeout(() => {
      openValidadesModal();
    }, 100);
  });
});

function openValidadesModal() {
  document.getElementById("modal-validades").style.display = "flex";
  carregarValidades();
}

function carregarValidades() {
  const tabela = document.getElementById("tabela-select").value;
  let url = "";

  if (tabela === "produtos") {
    url = "https://controle-de-estoque-ccb.onrender.com/api/validades?dias=30";
  } else if (tabela === "limpeza") {
    url =
      "https://controle-de-estoque-ccb.onrender.com/api/validades-limpeza?dias=30";
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.getElementById("tabela_validades_body");
      tbody.innerHTML = "";

      data.forEach((produto) => {
        const diasRestantes = calcularDiasRestantes(produto.validade);

        let corDias = "";
        if (diasRestantes >= 20 && diasRestantes <= 30) {
          corDias = "color: orange;";
        } else if (diasRestantes < 20) {
          corDias = "color: red;";
        }

        const validadeFormatada = formatarDataBrasileira(produto.validade);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${produto.nome_produto}</td>
          <td>${produto.quantidade}</td>
          <td style="color: red;">${validadeFormatada}</td>
          <td style="${corDias}">${diasRestantes} dias</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar validades:", error);
    });
}

function calcularDiasRestantes(validadeStr) {
  const validade = new Date(validadeStr);
  validade.setHours(0, 0, 0, 0);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diffTime = validade.getTime() - hoje.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatarDataBrasileira(dataISO) {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function closeValidadesModal() {
  document.getElementById("modal-validades").style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
  // Verifica se há produtos com validade próxima
  fetch("https://controle-de-estoque-ccb.onrender.com/api/validades?dias=30")
    .then((res) => res.json())
    .then((produtos) => {
      if (produtos.length > 0) {
        mostrarNotificacaoValidades();
      }
    })
    .catch((error) => console.error("Erro ao buscar validades:", error));
});

function mostrarNotificacaoValidades() {
  const container = document.querySelector(".notifications-container");

  const notificacao = document.createElement("div");
  notificacao.classList.add("alert");
  notificacao.setAttribute("id", "notificacao-validade");

  notificacao.innerHTML = `
      <span class="btnfecharnot" onclick="document.getElementById('notificacao-validade').remove()">✕</span>
      <div class="flex">
        <div class="flex-shrink-0">
          <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 alert-svg">
            <path clip-rule="evenodd" fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 
                  9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 
                  0-2.493-1.646-1.743-2.98l5.58-9.92zM11 
                  13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 
                  0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z">
            </path>
          </svg>
        </div>
        <div class="alert-prompt-wrap">
          <p class="text-sm text-yellow-700">
            Temos algumas validades que estão para vencer! Vá em menu para verificar.
          </p>
        </div>
      </div>
    `;

  container.appendChild(notificacao);
}
