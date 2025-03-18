app.get("/imobilizados", (req, res) => {
    db.query("SELECT * FROM imobilizados", (err, results) => {
      if (err) {
        console.error("Erro na consulta:", err);
        return res.status(500).send("Erro ao buscar imobilizados");
      }
      console.log(results);
      res.json(results);
    });
  });
  app.put("/imobilizados/:codigo/retirar", (req, res) => {
    const { codigo } = req.params;
    const { quantidade } = req.body;
  
    if (!codigo || !quantidade || isNaN(quantidade) || quantidade <= 0) {
      return res
        .status(400)
        .json({ error: "Código inválido ou quantidade inválida." });
    }
    const sql = `
      UPDATE imobilizados 
      SET quantidade_imobilizados = quantidade_imobilizados - ? 
      WHERE codigo_imobilizados = ? AND quantidade_imobilizados >= ?`;
  
    db.query(sql, [quantidade, codigo, quantidade], (err, result) => {
      if (err) {
        console.error("Erro ao atualizar a quantidade:", err);
        return res.status(500).json({ error: "Erro ao retirar quantidade." });
      } else if (result.affectedRows === 0) {
        return res
          .status(400)
          .json({ error: "Quantidade insuficiente no estoque." });
      } else {
        res.json({ message: "Quantidade retirada com sucesso!" });
      }
    });
  });
  app.post("/imobilizados", (req, res) => {
    console.log(req.body);
    const {
      codigo_imobilizados,
      nome_imobilizados,
      quantidade_imobilizados,
      fornecedor_imobilizados,
      dependencia,
      dt_aquisicao,
      status,
    } = req.body;
    const query =
      "INSERT INTO imobilizados (codigo_imobilizados, nome_imobilizados, quantidade_imobilizados, fornecedor_imobilizados, dependencia, dt_aquisicao, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      codigo_imobilizados,
      nome_imobilizados,
      quantidade_imobilizados,
      fornecedor_imobilizados,
      dependencia,
      dt_aquisicao,
      status,
    ];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Erro ao inserir produto imobilizado:", err);
        return res.status(500).send("Erro ao inserir produto imobilizado");
      }
      res
        .status(200)
        .json({ message: "Produto imobilizado adicionado com sucesso!" });
    });
  });
  module.exports = app;