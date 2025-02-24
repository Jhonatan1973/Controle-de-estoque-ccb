const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");

// Rota para listar todos os produtos
router.get("/", estoqueController.getProdutos);

// Rota para adicionar um novo produto
router.post("/", estoqueController.addProduto);

module.exports = router;
