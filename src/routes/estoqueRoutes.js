const express = require("express");
const router = express.Router();
const estoqueController = require("../controllers/estoqueController");

router.put("/:id/quantidade", estoqueController.atualizarEstoque);
router.get("/", estoqueController.getProdutos);
router.post("/", estoqueController.addProduto);
router.get("/historico", estoqueController.getHistoricoEstoque);

module.exports = router;
