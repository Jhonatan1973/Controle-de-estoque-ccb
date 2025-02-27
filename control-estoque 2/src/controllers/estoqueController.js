const db = require("../config/dbconfig");

// Função para listar todos os produtos
exports.getProdutos = (req, res) => {
  db.query("SELECT * FROM produtos", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao buscar produtos", error: err });
    }
    res.status(200).json(results); // Retorna a lista de produtos
  });
};

// Função para adicionar um novo produto
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
exports.atualizarQuantidade = (req, res) => {
  const { id } = req.params; // Extrai o id do produto dos parâmetros da URL
  const { quantidade } = req.body; // Extrai a quantidade do corpo da requisição

  if (quantidade === undefined || isNaN(quantidade)) {
    return res
      .status(400)
      .send({ success: false, message: "Quantidade inválida" });
  }
  const query = "UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?";
  db.query(query, [quantidade, id], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ success: false, message: "Erro ao atualizar a quantidade" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Produto não encontrado" });
    }

    return res
      .status(200)
      .send({ success: true, message: "Quantidade atualizada com sucesso!" });
  });
};
