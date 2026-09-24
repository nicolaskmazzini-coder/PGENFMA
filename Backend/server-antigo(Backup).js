// Importa as bibliotecas
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Importa o banco de dados

// Cria o aplicativo Express
const app = express();
const PORT = 3000; // Porta onde o servidor vai rodar

// Configura o Express para entender JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// FUNÇÕES DE VALIDAÇÃO


// Valida formato de data (YYYY-MM-DD)
function validarData(data) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(data)) return false;
    
    const date = new Date(data);
    return date instanceof Date && !isNaN(date);
}

// Valida formato de horário (HH:MM)
function validarHorario(horario) {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(horario);
}

// Valida se a data não é no passado
function validarDataFutura(data) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar só a data
    
    const dataAgendamento = new Date(data);
    return dataAgendamento >= hoje;
}

// Valida telefone (mínimo 10 dígitos)
function validarTelefone(telefone) {
    if (!telefone) return true; // Telefone é opcional
    
    const numeros = telefone.replace(/\D/g, ''); // Remove tudo que não é número
    return numeros.length >= 10 && numeros.length <= 11;
}


// ROTAS DO CRUD


//  ROTA INICIAL (teste)
app.get('/', (req, res) => {
    res.send(' Servidor funcionando Sistema de Agendamento ativo.');
});

// ========================================
// CREATE - Criar novo agendamento (COM VALIDAÇÕES!)
// ========================================
app.post('/agendamentos', (req, res) => {
    const { nome_cliente, servico, data, horario, telefone } = req.body;

    // VALIDAÇÃO 1: Campos obrigatórios
    if (!nome_cliente || !servico || !data || !horario) {
        return res.status(400).json({ 
            erro: 'Campos obrigatórios: nome_cliente, servico, data, horario' 
        });
    }

    // VALIDAÇÃO 2: Formato da data
    if (!validarData(data)) {
        return res.status(400).json({ 
            erro: 'Formato de data inválido. Use YYYY-MM-DD (ex: 2024-03-20)' 
        });
    }

    // VALIDAÇÃO 3: Formato do horário
    if (!validarHorario(horario)) {
        return res.status(400).json({ 
            erro: 'Formato de horário inválido. Use HH:MM (ex: 14:30)' 
        });
    }

    // VALIDAÇÃO 4: Não permitir agendamento no passado
    if (!validarDataFutura(data)) {
        return res.status(400).json({ 
            erro: 'Não é possível agendar em datas passadas' 
        });
    }

    // VALIDAÇÃO 5: Telefone (se fornecido)
    if (!validarTelefone(telefone)) {
        return res.status(400).json({ 
            erro: 'Telefone inválido. Deve ter entre 10 e 11 dígitos' 
        });
    }

    // VALIDAÇÃO 6: Verificar se já existe agendamento no mesmo horário
    const sqlVerifica = 'SELECT * FROM agendamentos WHERE data = ? AND horario = ?';
    
    db.get(sqlVerifica, [data, horario], (err, row) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        
        if (row) {
            return res.status(400).json({ 
                erro: `Já existe um agendamento para ${data} às ${horario}. Escolha outro horário.` 
            });
        }

        // Se passou em todas as validações, insere no banco
        const sql = `INSERT INTO agendamentos (nome_cliente, servico, data, horario, telefone) 
                     VALUES (?, ?, ?, ?, ?)`;

        db.run(sql, [nome_cliente, servico, data, horario, telefone], function(err) {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            res.status(201).json({ 
                mensagem: ' Agendamento criado com sucesso!',
                id: this.lastID,
                detalhes: {
                    nome_cliente,
                    servico,
                    data,
                    horario
                }
            });
        });
    });
});


// READ - Listar todos os agendamentos

app.get('/agendamentos', (req, res) => {
    const sql = 'SELECT * FROM agendamentos ORDER BY data, horario';

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json({
            mensagem: ' Lista de agendamentos',
            total: rows.length,
            agendamentos: rows
        });
    });
});


// READ - Buscar agendamento por ID

app.get('/agendamentos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM agendamentos WHERE id = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        if (!row) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' });
        }
        res.json(row);
    });
});


// READ - Buscar agendamentos por data

app.get('/agendamentos/data/:data', (req, res) => {
    const { data } = req.params;
    
    // Valida formato da data
    if (!validarData(data)) {
        return res.status(400).json({ 
            erro: 'Formato de data inválido. Use YYYY-MM-DD' 
        });
    }
    
    const sql = 'SELECT * FROM agendamentos WHERE data = ? ORDER BY horario';

    db.all(sql, [data], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json({
            mensagem: ` Agendamentos para ${data}`,
            total: rows.length,
            agendamentos: rows
        });
    });
});


// UPDATE - Atualizar agendamento 

app.put('/agendamentos/:id', (req, res) => {
    const { id } = req.params;
    const { nome_cliente, servico, data, horario, telefone, status } = req.body;

    // VALIDAÇÃO 1: Campos obrigatórios
    if (!nome_cliente || !servico || !data || !horario) {
        return res.status(400).json({ 
            erro: 'Campos obrigatórios: nome_cliente, servico, data, horario' 
        });
    }

    // VALIDAÇÃO 2: Formato da data
    if (!validarData(data)) {
        return res.status(400).json({ 
            erro: 'Formato de data inválido. Use YYYY-MM-DD' 
        });
    }

    // VALIDAÇÃO 3: Formato do horário
    if (!validarHorario(horario)) {
        return res.status(400).json({ 
            erro: 'Formato de horário inválido. Use HH:MM' 
        });
    }

    // VALIDAÇÃO 4: Telefone
    if (!validarTelefone(telefone)) {
        return res.status(400).json({ 
            erro: 'Telefone inválido. Deve ter entre 10 e 11 dígitos' 
        });
    }

    // VALIDAÇÃO 5: Status válido
    const statusValidos = ['agendado', 'confirmado', 'cancelado', 'concluido'];
    if (status && !statusValidos.includes(status.toLowerCase())) {
        return res.status(400).json({ 
            erro: `Status inválido. Use: ${statusValidos.join(', ')}` 
        });
    }

    // Verifica se já existe outro agendamento no mesmo horário (exceto o próprio)
    const sqlVerifica = 'SELECT * FROM agendamentos WHERE data = ? AND horario = ? AND id != ?';
    
    db.get(sqlVerifica, [data, horario, id], (err, row) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        
        if (row) {
            return res.status(400).json({ 
                erro: `Já existe outro agendamento para ${data} às ${horario}` 
            });
        }

        const sql = `UPDATE agendamentos 
                     SET nome_cliente = ?, servico = ?, data = ?, horario = ?, telefone = ?, status = ?
                     WHERE id = ?`;

        db.run(sql, [nome_cliente, servico, data, horario, telefone, status || 'agendado', id], function(err) {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ erro: 'Agendamento não encontrado' });
            }
            res.json({ 
                mensagem: ' Agendamento atualizado com sucesso!',
                detalhes: {
                    id,
                    nome_cliente,
                    data,
                    horario,
                    status: status || 'agendado'
                }
            });
        });
    });
});

// DELETE - Deletar agendamento

app.delete('/agendamentos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM agendamentos WHERE id = ?';

    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado' });
        }
        res.json({ 
            mensagem: ' Agendamento deletado com sucesso!',
            id_deletado: id
        });
    });
});


// Inicia o servidor

app.listen(PORT, () => {
    console.log(` Servidor rodando em http://localhost:${PORT}`);
    console.log(` Acesse http://localhost:${PORT}/agendamentos para ver os dados`);
});