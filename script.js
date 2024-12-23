const tableKey = "estoqueDados";

function filtrarTabela() {
    const pesquisa = document.querySelector(".pesquisa").value.toLowerCase();
    const linhas = document.querySelectorAll(".tabela tbody tr");

    linhas.forEach(linha => {
        const nome = linha.querySelector("td:nth-child(2)").textContent.toLowerCase();
        if (nome.includes(pesquisa)) {
            linha.style.display = "";
        } else {
            linha.style.display = "none";
        }
    });
}

// Função para editar a célula e confirmar alteração da quantidade
function editarCelula(event) {
    const td = event.target;
    const valorAtual = td.textContent;
    const tipo = td.getAttribute('data-tipo');
    const nomeProduto = td.closest('tr').querySelector("td:nth-child(2)").textContent; // Pega o nome do produto

    const input = document.createElement('input');
    input.value = valorAtual;
    input.addEventListener('blur', function() {
        const novoValor = input.value;

        // Atualiza o conteúdo da célula com o novo valor
        td.textContent = novoValor;

        // Salva os dados após a alteração
        salvarDados();
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const novoValor = input.value;

            // Atualiza o conteúdo da célula com o novo valor
            td.textContent = novoValor;

            // Salva os dados após a alteração
            salvarDados();
        }
    });

    td.innerHTML = '';  // Substitui o conteúdo da célula por um input
    td.appendChild(input);
    input.focus();
}

function abrirModal(button) {
    const linha = button.closest('tr');
    const quantidadeElement = linha.querySelector('.quantidade');
    const quantidadeAtual = parseInt(quantidadeElement.textContent);

    document.getElementById('quantidade').value = 0;
    document.getElementById('modal').style.display = 'block';

    window.quantidadeElement = quantidadeElement;
    window.quantidadeAtual = quantidadeAtual;
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

// Função que altera a quantidade e registra no histórico
function confirmarAlteracao() {
    const valorAlteracao = parseInt(document.getElementById('quantidade').value);
    if (!isNaN(valorAlteracao)) {
        const novaQuantidade = window.quantidadeAtual + valorAlteracao;
        if (novaQuantidade < 0) {
            alert("Não é possível diminuir o estoque para um valor negativo.");
        } else {
            const nomeProduto = window.quantidadeElement.closest("tr").querySelector("td:nth-child(2)").textContent; // Nome do produto

            // Atualiza a quantidade na tabela
            window.quantidadeElement.textContent = novaQuantidade;

            // Registra a alteração no histórico, apenas quando a quantidade for alterada
            adicionarAoHistorico(`${nomeProduto} foi modificado para ${novaQuantidade} em ${getDataAtual()}`);

            // Salva os dados após a alteração
            salvarDados();
        }
    } else {
        alert("Por favor, insira um valor válido.");
    }
    fecharModal();
}

// Função para pegar a data atual no formato dd/mm/yyyy
function getDataAtual() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Função para salvar os dados no localStorage
function salvarDados() {
    const linhas = document.querySelectorAll(".tabela tbody tr");
    const estoque = Array.from(linhas).map(tr => {
        const numeroNota = tr.querySelector("td:nth-child(1)").textContent;
        const nome = tr.querySelector("td:nth-child(2)").textContent;
        const quantidade = parseInt(tr.querySelector(".quantidade").textContent, 10);
        const valor = tr.querySelector("td:nth-child(4)").textContent;
        const validade = tr.querySelector("td:nth-child(5)").textContent;
        const estoqueMinimo = parseInt(tr.querySelector("td:nth-child(6)").textContent, 10);
        return { numeroNota, nome, quantidade, valor, validade, estoqueMinimo };
    });

    localStorage.setItem(tableKey, JSON.stringify(estoque));
}

// Carrega os dados ao iniciar a página
document.addEventListener("DOMContentLoaded", function() {
    atualizarHistorico(); // Atualiza o histórico quando a página for carregada
});

// Função para carregar os dados da tabela
function carregarDados() {
    const dados = localStorage.getItem(tableKey);
    if (dados) {
        const estoque = JSON.parse(dados);
        const tbody = document.querySelector(".tabela tbody");
        tbody.innerHTML = ""; // Limpa o conteúdo da tabela

        estoque.forEach(produto => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td class="editavel" data-tipo="numeroNota">${produto.numeroNota}</td>
                <td class="editavel" data-tipo="nome">${produto.nome}</td>
                <td class="quantidade">${produto.quantidade}</td>
                <td class="editavel" data-tipo="valor">${produto.valor}</td>
                <td class="editavel" data-tipo="validade">${produto.validade}</td>
                <td class="editavel" data-tipo="estoqueMinimo">${produto.estoqueMinimo}</td>
                <td><button onclick="abrirModal(this)">Baixa</button></td>
            `;

            // Adiciona a funcionalidade de editar nas células
            const editaveis = tr.querySelectorAll('.editavel');
            editaveis.forEach(celula => {
                celula.addEventListener('click', editarCelula);
            });

            tbody.appendChild(tr);
        });
    }
}

// Função para adicionar uma nova linha na tabela
function adicionarLinha() {
    const tbody = document.querySelector(".tabela tbody");
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="editavel" data-tipo="numeroNota">Novo</td>
        <td class="editavel" data-tipo="nome">Novo Produto</td>
        <td class="quantidade">0</td>
        <td class="editavel" data-tipo="valor">R$ 0,00</td>
        <td class="editavel" data-tipo="validade">01/2026</td>
        <td class="editavel" data-tipo="estoqueMinimo">0</td>
        <td><button onclick="abrirModal(this)">Baixa</button></td>
    `;

    // Adiciona a funcionalidade de editar nas células
    const editaveis = tr.querySelectorAll('.editavel');
    editaveis.forEach(celula => {
        celula.addEventListener('click', editarCelula);
    });

    tbody.appendChild(tr);

    salvarDados(); // Salva os dados após adicionar a linha
}

// Função para inicializar os dados no localStorage
function inicializarDados() {
    const estoqueInicial = [
        { numeroNota: "001", nome: "Açúcar", quantidade: 50, valor: "R$ 4,00", validade: "12/2025", estoqueMinimo: 20 },
        { numeroNota: "002", nome: "Arroz", quantidade: 150, valor: "R$ 5,00", validade: "10/2024", estoqueMinimo: 50 },
        { numeroNota: "003", nome: "Feijão", quantidade: 80, valor: "R$ 6,00", validade: "11/2025", estoqueMinimo: 30 }
    ];

    const dadosExistentes = localStorage.getItem(tableKey);
    if (!dadosExistentes) {
        localStorage.setItem(tableKey, JSON.stringify(estoqueInicial));
        carregarDados();
    }
}

// Carrega os dados da tabela ao carregar a página
window.onload = function () {
    if (!localStorage.getItem(tableKey)) {
        inicializarDados();
    } else {
        carregarDados();
    }
};

// Funções do histórico
let historico = [];

// Mostrar o card de histórico
document.getElementById('showCardBtn').addEventListener('click', function() {
    mostrarHistorico();
});

// Fechar o card de histórico
document.getElementById('closeModalBtn').addEventListener('click', function() {
    fecharHistorico();
});

// Excluir histórico (com confirmação)
document.getElementById('deleteHistory').addEventListener('click', function() {
    excluirHistorico();
});

// Função para mostrar o card do histórico
function mostrarHistorico() {
    const card = document.getElementById('modele');
    card.style.display = 'block';
}

// Função para fechar o card do histórico
function fecharHistorico() {
    const card = document.getElementById('modele');
    card.style.display = 'none';
}

// Função para atualizar o histórico exibido
function atualizarHistorico() {
    const historicoDiv = document.getElementById('historico');
    historicoDiv.innerHTML = '';

    const historicoSalvo = JSON.parse(localStorage.getItem('historico')) || [];

    historicoSalvo.forEach(acao => {
        const div = document.createElement('div');
        div.textContent = acao;
        historicoDiv.appendChild(div);
    });
}

// Função para excluir o histórico
function excluirHistorico() {
    localStorage.removeItem('historico');
    atualizarHistorico(); // Atualiza a exibição após exclusão
}

// Função para adicionar uma ação no histórico
function adicionarAoHistorico(acao) {
    const historicoExistente = JSON.parse(localStorage.getItem('historico')) || [];
    historicoExistente.push(acao);
    localStorage.setItem('historico', JSON.stringify(historicoExistente));
    atualizarHistorico(); // Atualiza o histórico em tempo real
}
