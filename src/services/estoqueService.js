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

function editarCelula(event) {
    const td = event.target;
    const valorAtual = td.textContent;
    const tipo = td.getAttribute('data-tipo');
    const nomeProduto = td.closest('tr').querySelector("td:nth-child(2)").textContent; // Pega o nome do produto

    const input = document.createElement('input');
    input.value = valorAtual;
    input.addEventListener('blur', function() {
        const novoValor = input.value;
        td.textContent = novoValor;
        salvarDados();
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const novoValor = input.value;
            td.textContent = novoValor;
            salvarDados();
        }
    });

    td.innerHTML = ''; 
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

function confirmarAlteracao() {
    const valorAlteracao = parseInt(document.getElementById('quantidade').value);
    if (!isNaN(valorAlteracao)) {
        const novaQuantidade = window.quantidadeAtual + valorAlteracao;
        if (novaQuantidade < 0) {
            alert("Não é possível diminuir o estoque para um valor negativo.");
        } else {
            const nomeProduto = window.quantidadeElement.closest("tr").querySelector("td:nth-child(2)").textContent; // Nome do produto
            window.quantidadeElement.textContent = novaQuantidade;
            adicionarAoHistorico(`${nomeProduto} foi modificado para ${novaQuantidade} em ${getDataAtual()}`);
            salvarDados();
        }
    } else {
        alert("Por favor, insira um valor válido.");
    }
    fecharModal();
}

function getDataAtual() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

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
document.addEventListener("DOMContentLoaded", function() {
    atualizarHistorico(); 
});

function carregarDados() {
    const dados = localStorage.getItem(tableKey);
    if (dados) {
        const estoque = JSON.parse(dados);
        const tbody = document.querySelector(".tabela tbody");
        tbody.innerHTML = ""; 

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
                <td><button onclick="excluirLinha(this)">Excluir</button></td> <!-- Botão de Excluir -->
            `;

            const editaveis = tr.querySelectorAll('.editavel');
            editaveis.forEach(celula => {
                celula.addEventListener('click', editarCelula);
            });

            tbody.appendChild(tr);
        });
    }
}

let linhaSelecionada = null; // Variável para armazenar a linha selecionada

// Função para exibir o botão de excluir
function mostrarBotaoExcluir(button) {
    // Verifica se uma linha já foi selecionada e a limpa
    if (linhaSelecionada) {
        // Remover o botão de excluir da linha anterior
        linhaSelecionada.querySelector('.excluir').style.display = 'none';
    }

    // Atualiza a linha selecionada
    linhaSelecionada = button.closest('tr');

    // Exibe o botão de excluir na nova linha selecionada
    linhaSelecionada.querySelector('.excluir').style.display = 'block';
}

// Função para excluir a linha
function excluirLinha(button) {
    const linha = button.closest('tr');
    linha.remove(); // Remove a linha da tabela
    salvarDados(); // Atualiza os dados no localStorage

    // Limpa a linha selecionada após exclusão
    linhaSelecionada = null;
}

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

    const editaveis = tr.querySelectorAll('.editavel');
    editaveis.forEach(celula => {
        celula.addEventListener('click', editarCelula);
    });

    tbody.appendChild(tr);
    salvarDados();
}

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

window.onload = function () {
    if (!localStorage.getItem(tableKey)) {
        inicializarDados();
    } else {
        carregarDados();
    }
};

let historico = [];

document.getElementById('showCardBtn').addEventListener('click', function() {
    mostrarHistorico();
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    fecharHistorico();
});

document.getElementById('deleteHistory').addEventListener('click', function() {
    excluirHistorico();
});

function mostrarHistorico() {
    const card = document.getElementById('modele');
    card.style.display = 'block';
}

function fecharHistorico() {
    const card = document.getElementById('modele');
    card.style.display = 'none';
}

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

function excluirHistorico() {
    localStorage.removeItem('historico');
    atualizarHistorico(); 
}

function adicionarAoHistorico(acao) {
    const historicoExistente = JSON.parse(localStorage.getItem('historico')) || [];
    historicoExistente.push(acao);
    localStorage.setItem('historico', JSON.stringify(historicoExistente));
    atualizarHistorico(); 
}

// Novas funcionalidades para adicionar vários produtos de uma vez
document.getElementById('adicionarProdutosBtn').addEventListener('click', function() {
    const nomesInput = document.getElementById('nomesProdutos').value;
    const nomesArray = nomesInput.split(',').map(nome => nome.trim()).filter(nome => nome !== '');

    if (nomesArray.length === 0) {
        alert("Por favor, insira pelo menos um nome.");
        return;
    }

    const tbody = document.querySelector(".tabela tbody");

    // Adiciona uma linha para cada nome no array
    nomesArray.forEach(nome => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="editavel" data-tipo="numeroNota">Novo</td>
            <td class="editavel" data-tipo="nome">${nome}</td>
            <td class="quantidade">0</td>
            <td class="editavel" data-tipo="valor">R$ 0,00</td>
            <td class="editavel" data-tipo="validade">01/2026</td>
            <td class="editavel" data-tipo="estoqueMinimo">0</td>
            <td><button onclick="abrirModal(this)">Baixa</button></td>
        `;

        // Adiciona o evento de edição nas células
        const editaveis = tr.querySelectorAll('.editavel');
        editaveis.forEach(celula => {
            celula.addEventListener('click', editarCelula);
        });

        tbody.appendChild(tr);
    });

    // Limpa o campo de input após adicionar os produtos
    document.getElementById('nomesProdutos').value = '';

    // Salva os dados atualizados
    salvarDados();
});
