const db = require("../config/dbconfig");

// Listar produtos
exports.getProdutos = (req, res) => {
  db.query("SELECT * FROM produtos", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar produtos", error: err });
    }
    res.status(200).json(results);
  });
};

// Função para buscar o histórico de alterações no estoque
exports.getHistoricoEstoque = (req, res) => {
  const query = "SELECT * FROM historico_estoque ORDER BY data_alteracao DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar histórico:", err);
      return res.status(500).json({ error: "Erro ao buscar histórico" });
    }
    res.json(results);
  });
};

// Adicionar produto
exports.addProduto = (req, res) => {
  const { nome, quantidade, preco } = req.body;

  const query =
    "INSERT INTO produtos (nome, quantidade, preco) VALUES (?, ?, ?)";
  db.query(query, [nome, quantidade, preco], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao adicionar produto", error: err });
    }
    res.status(201).json({
      message: "Produto adicionado com sucesso",
      produto: { nome, quantidade, preco },
    });
  });
};

// Atualizar quantidade do estoque e registrar no histórico
exports.atualizarEstoque = async (req, res) => {
  const { id } = req.params;
  const { quantidade, evento, numeroNota, valorNota, data } = req.body;

  try {
    let query = "";
    let params = [];
    let eventoHistorico = "";
    let quantidadeAlterada = quantidade;

    // Verificar se a quantidade é positiva ou negativa (entrada ou saída)
    if (quantidade > 0) {
      eventoHistorico = "Entrada"; // Evento de entrada
      query = "UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?";
      params = [quantidade, id];
    } else {
      eventoHistorico = "Saída"; // Evento de saída
      query = "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?";
      params = [Math.abs(quantidade), id];
    }

    // Atualizando a quantidade no estoque
    await new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    // Caso seja uma entrada, registra no histórico
    if (eventoHistorico === "Entrada") {
      // Buscando o nome do produto
      const nomeProdutoQuery = "SELECT nome FROM produtos WHERE id = ?";
      const nomeProduto = await new Promise((resolve, reject) => {
        db.query(nomeProdutoQuery, [id], (err, result) => {
          if (err) reject(err);
          resolve(result[0].nome);
        });
      });

      // Inserindo no histórico
      const historicoQuery =
        "INSERT INTO historico_estoque (produto_id, nome_produto, quantidade_alterada, evento, numero_nota, valor_nota, data_alteracao) VALUES (?, ?, ?, ?, ?, ?, ?)";

      await new Promise((resolve, reject) => {
        db.query(
          historicoQuery,
          [
            id,
            nomeProduto,
            quantidadeAlterada,
            eventoHistorico,
            numeroNota || null,
            valorNota || null,
            data || new Date(),
          ],
          (err, results) => {
            if (err) reject(err);
            resolve(results);
          }
        );
      });

      return res.status(200).json({
        message: "Produto atualizado e histórico registrado com sucesso!",
      });
    } else {
      // Se for uma saída, apenas atualiza o estoque sem registrar no histórico
      return res
        .status(200)
        .json({ message: "Produto atualizado com sucesso!" });
    }
  } catch (error) {
    console.error("Erro ao atualizar o estoque:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
