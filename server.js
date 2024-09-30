const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'Public')));

// Pasta raiz do projeto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public/Main', 'main.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});