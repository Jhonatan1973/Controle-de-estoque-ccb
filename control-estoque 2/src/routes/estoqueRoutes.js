// src/routes/estoqueRoutes.js
const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");

// Rota para listar produtos
router.get("/", estoqueController.getProdutos);

// Rota para adicionar um novo produto
router.post("/", estoqueController.addProduto);

// Rota para atualizar quantidade do produto
router.put("/:id/quantidade", estoqueController.atualizarQuantidade);

// Rota para buscar o histórico de alterações
router.get("/historico", (req, res) => {
  const query = "SELECT * FROM historico_estoque ORDER BY data_alteracao DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar histórico:", err);
      return res.status(500).json({ error: "Erro ao buscar histórico" });
    }
    res.json(results);
  });
});

module.exports = router;
