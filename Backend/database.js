// Importa a biblioteca do SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usa caminho absoluto para não criar 2 bancos (raiz vs Backend/)
const dbPath = path.join(__dirname, 'agendamento.db');

// Cria/conecta no banco de dados (arquivo agendamento.db)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(' Erro ao conectar no banco:', err.message);
    } else {
        console.log(' Conectado ao banco de dados SQLite');
    }
});

// Cria as tabelas (se não existirem)
const tabelas = `
    CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cliente TEXT NOT NULL,
        servico TEXT NOT NULL,
        data TEXT NOT NULL,
        horario TEXT NOT NULL,
        telefone TEXT,
        status TEXT DEFAULT 'agendado'
    )
`;

const tabelaTarefas = `
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        data TEXT NOT NULL,
        hora TEXT,
        categoria TEXT DEFAULT 'pessoal',
        concluido INTEGER DEFAULT 0
    )
`;

db.serialize(() => {
    db.run(tabelas, (err) => {
        if (err) console.error(' Erro ao criar tabela:', err.message);
        else console.log(' Tabela "agendamentos" pronta!');
    });
    db.run(tabelaTarefas, (err) => {
        if (err) console.error(' Erro ao criar tabela:', err.message);
        else console.log(' Tabela "tarefas" pronta!');
    });
});

// Exporta o banco para usar em outros arquivos
module.exports = db;