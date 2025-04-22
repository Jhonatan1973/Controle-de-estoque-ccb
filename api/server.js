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

  let quantidadeBruta = produto.quantidade.toString().trim();

  if (quantidadeBruta.includes(",")) {
    quantidadeBruta = quantidadeBruta.replace(",", ".");
  }

  produto.quantidade = quantidadeBruta.includes(".")
    ? parseFloat(quantidadeBruta)
    : parseInt(quantidadeBruta, 10);

  if (
    !produto.nome ||
    !produto.uniCompra ||
    !produto.uniMedida ||
    isNaN(produto.quantidade) ||
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
      return res.status(500).json({ error: "Erro ao buscar os dados" });
    }

    const produtosFormatados = results.map((produto) => {
      // Aqui só formata visualmente se precisar (ex: exibir como string com vírgula)
      if (produto.uni_media !== "L" && produto.uni_media !== "kg") {
        produto.quantidade = parseInt(produto.quantidade, 10);
      }

      // Se necessário, parse do JSON do estoque
      if (produto.estoque) {
        try {
          produto.estoque = JSON.parse(produto.estoque);
        } catch (e) {
          console.warn("Erro ao parsear estoque:", e);
        }
      }

      return produto;
    });

    res.json(produtosFormatados);
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
app.get("/api/validades-limpeza", async (req, res) => {
  const { dias = 30 } = req.query;

  const query = `
    SELECT limp_produto AS nome_produto, quantidade_limp AS quantidade, validade
    FROM limpeza
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
      rows.forEach((row) => {
        if (row.valor_nota) {
          row.valor_nota = parseFloat(row.valor_nota);
        }
        if (row.preco_unit) {
          row.preco_unit = parseFloat(row.preco_unit);
        }
        worksheet.addRow(row);
      });
      worksheet.autoFilter = {
        from: "A1",
        to: worksheet.getRow(1).getCell(columns.length)._address,
      };
      const formatCurrency = '"R$"#,##0.00';

      const colIndexValorNota =
        columns.findIndex((col) => col.key === "valor_nota") + 1;
      const colIndexPrecoUnit =
        columns.findIndex((col) => col.key === "preco_unit") + 1;

      const colLetterValorNota = worksheet.getColumn(colIndexValorNota).letter;
      worksheet.getColumn(colIndexValorNota).numFmt = formatCurrency;

      worksheet.getColumn(colIndexPrecoUnit).numFmt = formatCurrency;
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
app.get("/download-produtos", async (req, res) => {
  try {
    const connection = db.promise();
    const [rows] = await connection.query("SELECT * FROM produtos");

    if (!rows.length) {
      return res.status(404).send("Nenhum produto encontrado.");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Produtos");

    const columns = Object.keys(rows[0]).map((key) => ({
      header: key,
      key: key,
      width: 20,
    }));

    worksheet.columns = columns;

    worksheet.autoFilter = {
      from: "A1",
      to: worksheet.getRow(1).getCell(columns.length)._address,
    };

    // ✅ Adicionar os dados aqui:
    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=produtos.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    res.status(500).send("Erro ao gerar Excel");
  }
});

app.get("/limpeza", (req, res) => {
  db.query("SELECT * FROM limpeza", (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos de limpeza:", err);
      return res.status(500).json({ erro: "Erro ao buscar dados." });
    }
    res.json(results);
  });
});
app.post("/limpeza", (req, res) => {
  const {
    nomeLimpeza,
    uniCompraLimpeza,
    uniMedidaLimpeza,
    quantidadeLimpeza,
    validadeLimpeza,
    estoqueMaxLimpeza,
    estoqueMedLimpeza,
    estoqueMinLimpeza,
  } = req.body;

  const estoqueJSON = JSON.stringify({
    max: estoqueMaxLimpeza,
    med: estoqueMedLimpeza,
    min: estoqueMinLimpeza,
  });

  const sql = `
    INSERT INTO limpeza (
      limp_produto,
      uni_compra,
      uni_media,
      quantidade_limp,
      validade,
      estoque
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nomeLimpeza,
      uniCompraLimpeza,
      uniMedidaLimpeza,
      quantidadeLimpeza,
      validadeLimpeza,
      estoqueJSON,
    ],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir produto de limpeza:", err);
        return res.status(500).json({ erro: "Erro ao salvar produto." });
      }

      res
        .status(201)
        .json({ mensagem: "Produto de limpeza adicionado com sucesso!" });
    }
  );
});
app.post("/limpeza/retirar", (req, res) => {
  const produtosParaRetirar = req.body;

  if (!Array.isArray(produtosParaRetirar) || produtosParaRetirar.length === 0) {
    return res
      .status(400)
      .json({ error: "É necessário informar produtos para retirar." });
  }

  let erros = [];

  produtosParaRetirar.forEach(({ produto_id, quantidadeRetirar }) => {
    if (
      !produto_id ||
      !quantidadeRetirar ||
      isNaN(quantidadeRetirar) ||
      quantidadeRetirar <= 0
    ) {
      erros.push(`Informações inválidas para o produto ${produto_id}.`);
      return;
    }

    const sql = `
      UPDATE limpeza 
      SET quantidade_limp = quantidade_limp - ? 
      WHERE produto_id_limpeza = ? AND quantidade_limp >= ?;
    `;

    db.query(
      sql,
      [quantidadeRetirar, produto_id, quantidadeRetirar],
      (err, result) => {
        if (err) {
          console.error(`Erro ao retirar produto ${produto_id}:`, err);
          erros.push(`Erro ao atualizar o produto ${produto_id}.`);
          return;
        }

        if (result.affectedRows === 0) {
          erros.push(
            `Quantidade insuficiente no estoque para o produto ${produto_id}.`
          );
        }
      }
    );
  });

  if (erros.length > 0) {
    return res.status(400).json({ sucesso: false, erros });
  }

  res.json({
    sucesso: true,
    message: "Produtos de limpeza retirados com sucesso!",
  });
});
app.post("/api/agendar", (req, res) => {
  // Extraindo os dados do corpo da requisição
  const { data_agenda, evento, refeicao, produtos } = req.body;

  // Verificando se os dados necessários foram fornecidos
  if (!data_agenda || !evento || !refeicao || !Array.isArray(produtos)) {
    return res.status(400).json({ message: "Dados incompletos." });
  }

  // Criando o array de valores para inserir no banco
  const values = produtos.map((p) => [
    data_agenda,
    evento,
    refeicao,
    p.nome,
    p.qtd,
  ]);

  // A consulta SQL para inserir os dados na tabela agenda_reservas
  const sql = `INSERT INTO agenda_reservas (data_agenda, evento, refeicao, produto_agendado, quantidade_agendada) VALUES ?`;

  db.query(sql, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao salvar", error: err });
    }
    res.status(201).json({ message: "Reservas salvas com sucesso!", result });
  });
});

app.delete("/api/agendar-deletar", (req, res) => {
  const { data_agenda, evento, refeicao } = req.body;

  const sql = `
    DELETE FROM agenda_reservas 
    WHERE data_agenda = ? AND evento = ? AND refeicao = ?
  `;

  db.query(sql, [data_agenda, evento, refeicao], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Erro ao deletar", error: err });
    res.status(200).json({ message: "Reservas baixadas com sucesso", result });
  });
});
app.get("/api/agendados", async (req, res) => {
  const { data_agenda, evento, refeicao } = req.query;

  try {
    const [rows] = await db.promise().query(
      `SELECT produto_agendado AS produto, quantidade_agendada 
         FROM agenda_reservas 
         WHERE data_agenda = ? AND evento = ? AND refeicao = ?`,
      [data_agenda, evento, refeicao]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erro MySQL:", err);
    res.status(500).json({ error: "Erro ao buscar agendamentos" });
  }
});
app.get("/api/agendados-todos", async (req, res) => {
  const { data_agenda } = req.query;

  try {
    const [rows] = await db.promise().query(
      `SELECT evento, refeicao, produto_agendado AS produto, quantidade_agendada 
         FROM agenda_reservas 
         WHERE data_agenda = ?`,
      [data_agenda]
    );

    res.json(rows);
  } catch (err) {
    console.error("Erro MySQL:", err);
    res.status(500).json({ error: "Erro ao buscar agendamentos do dia" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
