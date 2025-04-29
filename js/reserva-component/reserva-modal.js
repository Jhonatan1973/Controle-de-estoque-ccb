// Função para abrir o modal de agendamento
function abrirModalAgendamento() {
  const modalAgendamento = document.getElementById("modalAgendamento");
  modalAgendamento.style.display = "block";
}

// Função para fechar o modal de agendamento
function fecharModalAgendamento() {
  const modalAgendamento = document.getElementById("modalAgendamento");
  modalAgendamento.style.display = "none";
}

document
  .getElementById("formAgendamento")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nomeProduto = document.getElementById("nomeProduto").value;
    const qtdProduto = parseInt(document.getElementById("qtdProduto").value);
    const dataAgendamento = document.getElementById("dataAgendamento").value;
    const eventoAgendamento =
      document.getElementById("eventoAgendamento").value;
    const refeicaoAgendamento = document.getElementById(
      "refeicaoAgendamento"
    ).value;

    const payload = {
      data_agenda: dataAgendamento,
      evento: eventoAgendamento,
      refeicao: refeicaoAgendamento,
      produtos: [
        {
          nome: nomeProduto,
          qtd: qtdProduto,
        },
      ],
    };

    fetch("https://controle-de-estoque-ccb.onrender.com/api/agendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw err;
          });
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message || "Produto agendado com sucesso!");
        fecharModalAgendamento();
      })
      .catch((error) => {
        console.error("Erro ao agendar:", error);
        alert("Erro ao agendar: " + (error.message || "Verifique os campos"));
      });
  });
// Função para adicionar novo campo de produto
function adicionarProduto() {
  const container = document.getElementById("produtosContainer");

  const novoItem = document.createElement("div");
  novoItem.classList.add("produtoItem");

  novoItem.innerHTML = `
      <label>Produto:</label>
      <input type="text" name="nomeProduto" required>
      <label>Quantidade:</label>
      <input type="number" name="qtdProduto" required>
      <button type="button" class="removerItem" onclick="removerItem(this)">Remover</button>
      <hr>
    `;

  container.appendChild(novoItem);
}

// Função para remover item
function removerItem(button) {
  const item = button.parentElement;
  item.remove();
}

// Submissão do formulário
document
  .getElementById("formAgendamento")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const dataAgendamento = document.getElementById("dataAgendamento").value;
    const eventoAgendamento =
      document.getElementById("eventoAgendamento").value;
    const refeicaoAgendamento = document.getElementById(
      "refeicaoAgendamento"
    ).value;

    const produtos = [];

    document.querySelectorAll(".produtoItem").forEach((item) => {
      const nome = item.querySelector('input[name="nomeProduto"]').value;
      const qtd = parseInt(
        item.querySelector('input[name="qtdProduto"]').value
      );
      if (nome && qtd) {
        produtos.push({ nome, qtd });
      }
    });

    const payload = {
      data_agenda: dataAgendamento,
      evento: eventoAgendamento,
      refeicao: refeicaoAgendamento,
      produtos: produtos,
    };

    fetch("https://controle-de-estoque-ccb.onrender.com/api/agendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw err;
          });
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message || "Produtos agendados com sucesso!");
        fecharModalAgendamento();
      })
      .catch((error) => {
        console.error("Erro ao agendar:", error);
        alert("Erro ao agendar: " + (error.message || "Verifique os campos"));
      });
  });

// Função para adicionar uma nova linha de produto no agendamento
function adicionarLinhaProduto() {
  const tbody = document.getElementById("tbodyProdutos");
  const novaLinha = document.createElement("tr");
  novaLinha.innerHTML = `
      <td><input type="text" class="produtoNome"></td>
      <td><input type="text" class="produtoQtd"></td>
    `;
  tbody.appendChild(novaLinha);
}

// Função para enviar o agendamento com múltiplos produtos
function enviarAgendamento() {
  const data_agenda = document.getElementById("dataAgenda").value;
  const evento = document.getElementById("eventoAgenda").value;
  const refeicao = document.getElementById("refeicaoAgenda").value;

  const produtos = [];
  document.querySelectorAll("#tbodyProdutos tr").forEach((row) => {
    const nome = row.querySelector(".produtoNome").value;
    const qtd = row.querySelector(".produtoQtd").value;
    if (nome && qtd) produtos.push({ nome, qtd });
  });

  if (!data_agenda || !evento || produtos.length === 0) {
    alert("Preencha todos os campos e adicione pelo menos um produto.");
    return;
  }

  // Envia para a API
  fetch("https://controle-de-estoque-ccb.onrender.com/api/agendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_agenda, evento, refeicao, produtos }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Reservado:", data);
      mostrarNotificacaoAgendamento(data_agenda, evento, refeicao, produtos);
      document.getElementById("divAgendamento").style.display = "none";
    })
    .catch((err) => {
      console.error("Erro ao agendar:", err);
      alert("Erro ao agendar.");
    });
}

// Função para mostrar a notificação de agendamento
function mostrarNotificacaoAgendamento(data, evento, refeicao) {
  const container = document.querySelector(".notifications-container");
  const notif = document.createElement("div");
  const id = "agendamento-" + Date.now();
  notif.classList.add("alert");
  notif.setAttribute("id", id);

  fetch(
    `https://controle-de-estoque-ccb.onrender.com/api/agendados?data_agenda=${data}&evento=${evento}&refeicao=${refeicao}`
  )
    .then((res) => res.json())
    .then((produtos) => {
      const lista = produtos
        .map((p) => `<li>${p.produto} - ${p.quantidade_agendada}</li>`)
        .join("");

      notif.innerHTML = `
          <span class="btnfecharnot" onclick="document.getElementById('${id}').remove()">✕</span>
          <div class="flex">
            <div class="alert-prompt-wrap">
              <strong>📝 Agendado para ${data} (${evento} - ${refeicao}):</strong>
              <ul>${lista}</ul>
              <button onclick="baixarAgendamento('${data}', '${evento}', '${refeicao}', '${id}')">📦 Baixar</button>
            </div>
          </div>
        `;
      container.appendChild(notif);
    })
    .catch((err) => {
      console.error("Erro ao buscar agendamentos:", err);
      alert("Erro ao buscar produtos agendados.");
    });
}

// Função para baixar (remover) o agendamento
function baixarAgendamento(data, evento, refeicao, notifId) {
  fetch("https://controle-de-estoque-ccb.onrender.com/api/agendar-deletar", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data_agenda: data, evento, refeicao }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("🗑️ Baixado:", data);
      document.getElementById(notifId).remove();
    })
    .catch((err) => {
      console.error("Erro ao baixar:", err);
      alert("Erro ao baixar reserva.");
    });
}

// Abrir o Modal ao clicar no botão "Mostrar Pedidos"
document.getElementById("btnMostrarPedidos").addEventListener("click", () => {
  document.getElementById("modalMostrarPedidos").style.display = "block";
});

// Fechar o Modal
function fecharModal() {
  document.getElementById("modalMostrarPedidos").style.display = "none";
}

// Confirmar data e mostrar pedidos
document
  .getElementById("btnConfirmarData")
  .addEventListener("click", async () => {
    const dataSelecionada = document.getElementById("dataFiltroModal").value; // Usando o ID correto para o campo de data dentro do modal
    if (!dataSelecionada) {
      alert("Selecione uma data válida.");
      return;
    }

    try {
      const response = await fetch(
        `https://controle-de-estoque-ccb.onrender.com/api/agendados-todos?data_agenda=${dataSelecionada}`
      );
      const pedidos = await response.json();

      const resultadoDiv = document.getElementById("resultadoPedidos");
      resultadoDiv.innerHTML = ""; // Limpa antes de renderizar

      if (pedidos.length === 0) {
        resultadoDiv.innerHTML =
          "<p>Nenhum pedido encontrado para essa data.</p>";
        return;
      }

      let html = "<h3>Pedidos encontrados:</h3><ul>";
      pedidos.forEach((p) => {
        html += `<li><strong>${p.evento}</strong> - ${p.refeicao} - ${p.produto} (${p.quantidade_agendada})</li>`;
      });
      html += "</ul>";

      resultadoDiv.innerHTML = html;
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      alert("Erro ao buscar pedidos.");
    }
  });
