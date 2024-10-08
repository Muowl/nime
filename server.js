const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./DB/database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados com sucesso.');
    }
});
const bcrypt = require('bcrypt');

// Configurar o middleware de sessão
app.use(session({
  secret: 'eabef6388de5a632bc8e4d6599f7b13391a72d924337fd4ad624e758ab3d3bc7dc1fedada6e9704080270a561a80e822bea26540f09d86b1c4d868b64dc32be2', // Ver dotenv para versão final
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/Imagens', express.static(path.join(__dirname, 'Imagens')));

const allowedTables = ['users', 'list', 'exemplar', 'list_exemplar'];

app.get('/', (req, res) => {
  const user = req.session.user;
  if (!user) {
      res.redirect('/login');
  } else {
      res.sendFile(path.join(__dirname, 'Public/Main', 'main.html'));
  }
});


app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Cadastro', 'cadastro.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public/Login', 'login.html'));
});

app.post('/api/login', (req, res) => {
  const { emailOrUsername, password } = req.body;
  const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
  db.get(query, [emailOrUsername, emailOrUsername], (err, user) => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
      }
      if (!user || !bcrypt.compareSync(password, user.senha)) {
          return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
      req.session.user = user; // Armazena o usuário na sessão
      res.json({ success: true, user });
  });
});


app.get('/api/user/:id/exemplares', (req, res) => {
  const userId = req.params.id;
  const query = `
      SELECT e.*
      FROM exemplar e
      JOIN list_exemplar le ON e.id = le.exemplar_id
      JOIN list l ON le.list_id = l.id
      WHERE l.usuario_id = ?
      ORDER BY e.data_editado DESC
      LIMIT 3
  `;
  db.all(query, [userId], (err, exemplares) => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Erro ao obter exemplares' });
      }
      res.json(exemplares);
  });
});


app.post('/api/register', (req, res) => {
  const { nome, username, email, senha } = req.body;
  const hashedPassword = bcrypt.hashSync(senha, 10);
  const query = `INSERT INTO users (nome, username, email, senha) VALUES (?, ?, ?, ?)`;
  db.run(query, [nome, username, email, hashedPassword], function(err) {
      if (err) {
          return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
      }
      res.json({ success: true });
  });
});

// Rota para a página de administração
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Admin', 'testes.html'));
});

app.get('/api/tables/:table', (req, res) => {
  const table = req.params.table;
  if (!allowedTables.includes(table)) {
      return res.status(400).json({ success: false, message: 'Tabela não permitida' });
  }
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Erro ao obter dados da tabela' });
      }
      res.json({ success: true, data: rows });
  });
});

app.delete('/api/tables/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  if (!allowedTables.includes(table)) {
      return res.status(400).json({ success: false, message: 'Tabela não permitida' });
  }
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function(err) {
      if (err) {
          return res.status(500).json({ success: false, message: 'Erro ao deletar entidade' });
      }
      res.json({ success: true });
  });
});

app.put('/api/tables/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const updates = req.body;
  if (!allowedTables.includes(table)) {
      return res.status(400).json({ success: false, message: 'Tabela não permitida' });
  }
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  db.run(`UPDATE ${table} SET ${fields} WHERE id = ?`, values, function(err) {
      if (err) {
          return res.status(500).json({ success: false, message: 'Erro ao editar entidade' });
      }
      res.json({ success: true });
  });
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});