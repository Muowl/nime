const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Verificar se o diretório ./DB/ existe, se não, criar
const dbDir = path.join(__dirname, 'DB');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Ler o arquivo SQL
const sqlFilePath = path.join(__dirname, 'tabelas.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

const db = new sqlite3.Database(path.join(dbDir, 'database.db'), (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
        db.exec(sql, (err) => {
            if (err) {
                console.error('Erro ao criar tabelas:', err.message);
            } else {
                console.log('Tabelas criadas com sucesso!');
            }
            db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar a conexão com o banco de dados:', err.message);
                } else {
                    console.log('Conexão com o banco de dados fechada com sucesso!');
                }
            });
        });
    }
});