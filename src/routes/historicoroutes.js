const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");

// Rota para buscar o histórico de alterações no estoque
router.get("/", estoqueController.getHistoricoEstoque);

module.exports = router;
