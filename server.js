const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
// Configuração DB SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./DB/database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'Public')));

// Pasta raiz do projeto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Main', 'main.html'));
});

// Caminho para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Cadastro', 'cadastro.html'));
});

// Caminho para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Login', 'login.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});