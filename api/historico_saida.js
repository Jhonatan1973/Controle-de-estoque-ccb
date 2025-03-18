app.get("/historico_saida", (req, res) => {
    const query = "SELECT * FROM historico_saida";
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send("Erro ao buscar histórico de saída");
      } else {
        res.json(results);
      }
    });
  });
  app.post("/historico_saida", (req, res) => {
    const { nome_saida, quantidade_retirada, evento, data_saida, quem_retirou } =
      req.body;
    if (
      !nome_saida ||
      !quantidade_retirada ||
      !evento ||
      !data_saida ||
      !quem_retirou
    ) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios!" });
    }
    const sql = `INSERT INTO historico_saida (nome_saida, quantidade_retirada, evento, data_saida, quem_retirou) 
                 VALUES (?, ?, ?, ?, ?)`;
    const values = [
      nome_saida,
      quantidade_retirada,
      evento,
      data_saida,
      quem_retirou,
    ];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erro ao inserir no banco de dados:", err);
        return res.status(500).json({ message: "Erro ao salvar saída." });
      }
      res.json({ message: "Saída salva com sucesso!" });
    });
  });
  module.exports = app;