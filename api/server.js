const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const ExcelJS = require("exceljs");

require("dotenv").config({ path: __dirname + "/.env" });
const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
db.connect(function (err) {
  if (err) {
    console.error("Erro de conexão: " + err.stack);
    return;
  }
  console.log("Conectado como id " + db.threadId);
});
app.post("/produtos", (req, res) => {
  const produto = req.body;
  if (
    !produto.nome ||
    !produto.uniCompra ||
    !produto.uniMedida ||
    !produto.quantidade ||
    !produto.categoria ||
    !produto.validade ||
    !produto.estoque
  ) {
    return res
      .status(400)
      .json({ error: "Todos os campos devem ser preenchidos!" });
  }
  const sql = `
    INSERT INTO produtos (nome_produto, uni_compra, uni_media, quantidade, categoria, validade, estoque)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    produto.nome,
    produto.uniCompra,
    produto.uniMedida,
    produto.quantidade,
    produto.categoria,
    produto.validade,
    JSON.stringify(produto.estoque),
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao adicionar produto:", err);
      return res.status(500).json({ error: "Erro ao adicionar produto." });
    }
    res.status(201).json({
      message: "Produto adicionado com sucesso!",
      produtoId: result.insertId,
      ...produto,
    });
  });
});
app.get("/produtos", (req, res) => {
  const sql = `
        SELECT 
            produto_id, 
            nome_produto, 
            uni_compra,
            uni_media,
            quantidade, 
            categoria, 
            validade, 
            estoque 
        FROM produtos;
    `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar os dados:", err);
      res.status(500).json({ error: "Erro ao buscar os dados" });
    } else {
      res.json(results);
    }
  });
});
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
app.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (!id || isNaN(id) || !quantidade || isNaN(quantidade)) {
    return res.status(400).json({ error: "ID ou quantidade inválidos" });
  }
  const sql =
    "UPDATE produtos SET quantidade = quantidade + ? WHERE produto_id = ?";
  db.query(sql, [quantidade, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a quantidade:", err);
      res.status(500).json({ error: "Erro ao atualizar a quantidade" });
    } else {
      res.json({ message: "Quantidade atualizada com sucesso!" });
    }
  });
});
app.put("/produtos/:id/retirar", (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (!id || isNaN(id) || !quantidade || isNaN(quantidade)) {
    return res.status(400).json({ error: "ID ou quantidade inválidos" });
  }
  const sql =
    "UPDATE produtos SET quantidade = quantidade - ? WHERE produto_id = ? AND quantidade >= ?";

  db.query(sql, [quantidade, id, quantidade], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a quantidade:", err);
      res.status(500).json({ error: "Erro ao atualizar a quantidade" });
    } else if (result.affectedRows === 0) {
      res.status(400).json({ error: "Quantidade insuficiente no estoque" });
    } else {
      res.json({ message: "Quantidade retirada com sucesso!" });
    }
  });
});
app.post("/historico_entrada", (req, res) => {
  const {
    fornecedor,
    nome_entrada,
    evento_entrada,
    quantidade_entrada,
    valor_nota,
    data_entrada,
  } = req.body;
  if (!quantidade_entrada || !data_entrada) {
    return res
      .status(400)
      .json({ message: "Preencha todos os campos obrigatórios!" });
  }
  const sql = `INSERT INTO historico_entrada (fornecedor, nome_entrada, evento_entrada, quantidade_entrada, valor_nota, data_entrada) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    fornecedor,
    nome_entrada,
    evento_entrada,
    quantidade_entrada,
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
app.post("/historico_saida", async (req, res) => {
  const { produtos } = req.body;
  if (!produtos || produtos.length === 0) {
    return res.status(400).json({ message: "Nenhum produto selecionado!" });
  }
  const sql = `
    INSERT INTO historico_saida (nome_saida, quantidade_retirada, evento, data_saida, quem_retirou)
    VALUES (?, ?, ?, ?, ?);
  `;
  try {
    await Promise.all(
      produtos.map((produto) => {
        const {
          nome_saida,
          quantidade_retirada,
          evento,
          data_saida,
          quem_retirou,
        } = produto;
        if (
          !nome_saida ||
          !quantidade_retirada ||
          !evento ||
          !data_saida ||
          !quem_retirou
        ) {
          throw new Error("Preencha todos os campos obrigatórios!");
        }
        return new Promise((resolve, reject) => {
          db.query(
            sql,
            [nome_saida, quantidade_retirada, evento, data_saida, quem_retirou],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      })
    );
    res.status(200).json();
  } catch (error) {
    res.status(500).json();
  }
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
app.get("/api/produtos", (req, res) => {
  const sql = `
    SELECT 
        produto_id, 
        nome_produto, 
        quantidade
    FROM produtos;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar os dados:", err);
      return res.status(500).json({ error: "Erro ao buscar os dados" });
    } else {
      res.json(results);
    }
  });
});
app.post("/api/retirarProdutos", (req, res) => {
  const produtosParaRetirar = req.body;
  if (!Array.isArray(produtosParaRetirar) || produtosParaRetirar.length === 0) {
    return res
      .status(400)
      .json({ error: "É necessário informar produtos para retirar." });
  }
  produtosParaRetirar.forEach(({ produto_id, quantidadeRetirar }) => {
    if (
      !produto_id ||
      !quantidadeRetirar ||
      isNaN(quantidadeRetirar) ||
      quantidadeRetirar <= 0
    ) {
      return res
        .status(400)
        .json({ error: `Informações inválidas para o produto ${produto_id}.` });
    }

    const sql = `
      UPDATE produtos 
      SET quantidade = quantidade - ? 
      WHERE produto_id = ? AND quantidade >= ?;
    `;
    db.query(
      sql,
      [quantidadeRetirar, produto_id, quantidadeRetirar],
      (err, result) => {
        if (err) {
          console.error(`Erro ao retirar produto ${produto_id}:`, err);
          return res
            .status(500)
            .json({ error: "Erro ao atualizar o produto no estoque." });
        }

        if (result.affectedRows === 0) {
          return res.status(400).json({
            error: `Quantidade insuficiente no estoque para o produto ${produto_id}.`,
          });
        }
      }
    );
  });
  res.json({ sucesso: true, message: "Produtos retirados com sucesso!" });
});
app.get("/api/rendimento", (req, res) => {
  const { tipo, valor, dataInicio, dataFim, ano } = req.query;

  if (!tipo || !valor) {
    return res.status(400).json({ error: "Parâmetros obrigatórios ausentes." });
  }

  let sql = "";
  let params = [];

  // Caso especial para RGE (baseado no ano)
  if (tipo === "evento" && valor === "RGE" && ano) {
    sql = `
      SELECT * FROM historico_entrada
      WHERE evento_entrada = 'RGE'
      AND YEAR(data_entrada) = ?
    `;
    params = [ano];
  } else {
    // Mapeia o campo correto do banco com base no tipo
    let campo;
    if (tipo === "produto") {
      campo = "nome_entrada";
    } else if (tipo === "evento") {
      campo = "evento_entrada";
    } else {
      return res
        .status(400)
        .json({ error: "Tipo inválido. Use 'produto' ou 'evento'." });
    }

    sql = `SELECT * FROM historico_entrada WHERE ${campo} = ?`;
    params = [valor];

    if (dataInicio && dataFim) {
      sql += " AND DATE(data_entrada) BETWEEN ? AND ?";
      params.push(dataInicio, dataFim);
    }
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Erro ao buscar rendimento:", err);
      return res.status(500).json({ error: "Erro no servidor." });
    }
    res.json(results);
  });
});

app.get("/api/comparar-precos", async (req, res) => {
  const { produto, data } = req.query;

  if (!produto || !data) {
    return res.status(400).json({ error: "Produto e data são obrigatórios." });
  }

  let query = `
    SELECT 
      nome_entrada, 
      MONTH(data_entrada) AS mes, 
      YEAR(data_entrada) AS ano, 
      SUM(quantidade_entrada) AS total_quantidade,
      AVG(preco_unit) AS preco_medio
    FROM historico_entrada
    WHERE nome_entrada = ?
  `;

  const params = [produto];

  // Verifica o formato da data
  if (/^\d{4}-\d{2}$/.test(data)) {
    // formato YYYY-MM
    const [ano, mes] = data.split("-");
    query += ` AND YEAR(data_entrada) = ? AND MONTH(data_entrada) = ?`;
    params.push(ano, mes);
  } else {
    return res
      .status(400)
      .json({ error: "Formato de data inválido. Use YYYY-MM." });
  }

  // Agrupando corretamente para um único resultado por mês
  query += ` GROUP BY nome_entrada, ano, mes`;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Erro:", err);
      return res.status(500).json({ error: "Erro ao buscar dados." });
    }
    res.json(results);
  });
});

app.get("/api/validades", async (req, res) => {
  const { dias = 30 } = req.query;

  const query = `
    SELECT nome_produto, quantidade, validade
    FROM produtos
    WHERE validade <= CURDATE() + INTERVAL ? DAY
    ORDER BY validade ASC
  `;
  db.query(query, [parseInt(dias)], (err, results) => {
    if (err) {
      console.error("Erro:", err);
      return res.status(500).json({ error: "Erro ao buscar dados." });
    }
    res.json(results);
  });
});

app.get("/download-excel", async (req, res) => {
  try {
    const connection = db.promise();
    const [rows] = await connection.query("SELECT * FROM historico_entrada");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Histórico de Entrada");

    if (rows.length > 0) {
      const columns = Object.keys(rows[0]).map((key) => ({
        header: key,
        key: key,
        width: 20,
      }));

      worksheet.columns = columns;

      // Converte os valores para número antes de adicionar
      rows.forEach((row) => {
        if (row.valor_nota) {
          row.valor_nota = parseFloat(row.valor_nota);
        }
        if (row.preco_unit) {
          row.preco_unit = parseFloat(row.preco_unit);
        }
        worksheet.addRow(row);
      });

      // Aplica filtros no cabeçalho
      worksheet.autoFilter = {
        from: "A1",
        to: worksheet.getRow(1).getCell(columns.length)._address,
      };

      // Formata as colunas com R$
      const formatCurrency = '"R$"#,##0.00';

      const colIndexValorNota =
        columns.findIndex((col) => col.key === "valor_nota") + 1;
      const colIndexPrecoUnit =
        columns.findIndex((col) => col.key === "preco_unit") + 1;

      const colLetterValorNota = worksheet.getColumn(colIndexValorNota).letter;
      worksheet.getColumn(colIndexValorNota).numFmt = formatCurrency;

      worksheet.getColumn(colIndexPrecoUnit).numFmt = formatCurrency;

      // Linha do total para valor_nota com fórmula SUBTOTAL
      const lastDataRow = worksheet.lastRow.number;
      const totalRow = worksheet.addRow([]);
      totalRow.getCell(columns.length - 1).value = "TOTAL:";
      totalRow.getCell(columns.length).value = {
        formula: `SUBTOTAL(9, ${colLetterValorNota}2:${colLetterValorNota}${lastDataRow})`,
      };
      totalRow.getCell(columns.length).numFmt = formatCurrency;
      totalRow.font = { bold: true };
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=historico_entrada.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    res.status(500).send("Erro ao gerar Excel");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
