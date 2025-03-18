app.post("/historico_entrada", (req, res) => {
    const {
      fornecedor,
      nome_entrada,
      quantidade_entrada,
      numero_nota,
      valor_nota,
      data_entrada,
    } = req.body;
    if (!nome_entrada || !quantidade_entrada || !data_entrada) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios!" });
    }
    const sql = `INSERT INTO historico_entrada (fornecedor, nome_entrada, quantidade_entrada, numero_nota, valor_nota, data_entrada) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      fornecedor,
      nome_entrada,
      quantidade_entrada,
      numero_nota || null,
      valor_nota || null,
      data_entrada,
    ];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erro ao inserir no banco de dados:", err);
        return res.status(500).json({ message: "Erro ao salvar entrada." });
      }
      res.json({ message: "Entrada salva com sucesso!" });
    });
  });
  app.get("/historico_entrada", (req, res) => {
    const query = "SELECT * FROM historico_entrada";
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).send("Erro ao buscar histórico de entrada");
      } else {
        res.json(results);
      }
    });
  });
  module.exports = app;