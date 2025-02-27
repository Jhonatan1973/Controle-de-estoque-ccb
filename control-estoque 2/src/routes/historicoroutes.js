const express = require("express");
const router = express.Router();
const db = require("../config/dbconfig");

// Rota para obter o histórico de alterações no estoque
router.get("/", (req, res) => {
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
