const express = require('express');
const app = express();
const path = require('path');
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Main', 'main.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Cadastro', 'cadastro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Login', 'login.html'));
});

app.post('/api/register', (req, res) => {
    const { nome, username, email, senha } = req.body;
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao hashear a senha' });
        }
        const query = `INSERT INTO users (nome, username, email, senha) VALUES (?, ?, ?, ?)`;
        db.run(query, [nome, username, email, hash], function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
            }
            res.json({ success: true });
        });
    });
});

// Rota para a página de administração
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Admin', 'testes.html'));
});

// Rota para obter dados das tabelas
app.get('/api/tables/:table', (req, res) => {
    const table = req.params.table;
    db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao obter dados da tabela' });
        }
        res.json({ success: true, data: rows });
    });
});

// Rota para deletar uma entidade
app.delete('/api/tables/:table/:id', (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao deletar entidade' });
        }
        res.json({ success: true });
    });
});

// Rota para editar uma entidade
app.put('/api/tables/:table/:id', (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    const updates = req.body;
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