#  GUIA DE INTEGRAÇÃO - FRONTEND COM API

Este documento é para ajudar o Gustavo na integração da interface web com a API REST do backend.

---

##  INFORMAÇÕES DA API

**URL Base:** `http://localhost:3000`

**Porta:** `3000`

**Ambiente:** Node.js + Express.js

---

##  COMO INICIAR O SERVIDOR

No CMD, na pasta do projeto:

```bash
node server.js
```

Deve aparecer:
```
 Conectado ao banco de dados SQLite
 Tabela "agendamentos" pronta!
Servidor rodando em http://localhost:3000
 Sistema com validações ativadas!
```

---

##  ENDPOINTS DISPONÍVEIS

### 1️ CRIAR AGENDAMENTO

**Método:** `POST`

**URL:** `http://localhost:3000/agendamentos`

**Content-Type:** `application/json`

**Body (JSON):**
```json
{
  "nome_cliente": "João Silva",
  "servico": "Corte de Cabelo",
  "data": "2024-04-20",
  "horario": "14:00",
  "telefone": "(11) 98765-4321"
}
```

**Resposta Sucesso (Status 201):**
```json
{
  "mensagem": " Agendamento criado com sucesso!",
  "id": 1,
  "detalhes": {
    "nome_cliente": "João Silva",
    "servico": "Corte de Cabelo",
    "data": "2024-04-20",
    "horario": "14:00"
  }
}
```

**Resposta Erro (Status 400):**
```json
{
  "erro": "Não é possível agendar em datas passadas"
}
```

---

### 2️ LISTAR TODOS OS AGENDAMENTOS

**Método:** `GET`

**URL:** `http://localhost:3000/agendamentos`

**Resposta (Status 200):**
```json
{
  "mensagem": " Lista de agendamentos",
  "total": 2,
  "agendamentos": [
    {
      "id": 1,
      "nome_cliente": "João Silva",
      "servico": "Corte de Cabelo",
      "data": "2024-04-20",
      "horario": "14:00",
      "telefone": "(11) 98765-4321",
      "status": "agendado"
    },
    {
      "id": 2,
      "nome_cliente": "Maria Santos",
      "servico": "Manicure",
      "data": "2024-04-21",
      "horario": "10:30",
      "telefone": "(21) 91234-5678",
      "status": "confirmado"
    }
  ]
}
```

---

### 3 BUSCAR AGENDAMENTO POR ID

**Método:** `GET`

**URL:** `http://localhost:3000/agendamentos/1`

**Resposta (Status 200):**
```json
{
  "id": 1,
  "nome_cliente": "João Silva",
  "servico": "Corte de Cabelo",
  "data": "2024-04-20",
  "horario": "14:00",
  "telefone": "(11) 98765-4321",
  "status": "agendado"
}
```

**Resposta Erro (Status 404):**
```json
{
  "erro": "Agendamento não encontrado"
}
```

---

### 4 BUSCAR AGENDAMENTOS POR DATA

**Método:** `GET`

**URL:** `http://localhost:3000/agendamentos/data/2024-04-20`

**Resposta (Status 200):**
```json
{
  "mensagem": "Agendamentos para 2024-04-20",
  "total": 1,
  "agendamentos": [
    {
      "id": 1,
      "nome_cliente": "João Silva",
      "servico": "Corte de Cabelo",
      "data": "2024-04-20",
      "horario": "14:00",
      "telefone": "(11) 98765-4321",
      "status": "agendado"
    }
  ]
}
```

---

### 5 ATUALIZAR AGENDAMENTO

**Método:** `PUT`

**URL:** `http://localhost:3000/agendamentos/1`

**Content-Type:** `application/json`

**Body (JSON):**
```json
{
  "nome_cliente": "João Silva",
  "servico": "Corte de Cabelo",
  "data": "2024-04-22",
  "horario": "15:00",
  "telefone": "(11) 98765-4321",
  "status": "confirmado"
}
```

**Resposta (Status 200):**
```json
{
  "mensagem": " Agendamento atualizado com sucesso!",
  "detalhes": {
    "id": 1,
    "nome_cliente": "João Silva",
    "data": "2024-04-22",
    "horario": "15:00",
    "status": "confirmado"
  }
}
```

---

### 6 DELETAR AGENDAMENTO

**Método:** `DELETE`

**URL:** `http://localhost:3000/agendamentos/1`

**Resposta (Status 200):**
```json
{
  "mensagem": " Agendamento deletado com sucesso!",
  "id_deletado": 1
}
```

**Resposta Erro (Status 404):**
```json
{
  "erro": "Agendamento não encontrado"
}
```

---

##  VALIDAÇÕES QUE A API FAZ

### 1. Data Não Pode ser no Passado

```
POST /agendamentos

Body:
{
  "nome_cliente": "Teste",
  "servico": "Teste",
  "data": "2020-01-01",
  "horario": "10:00"
}

Resposta:
{
  "erro": "Não é possível agendar em datas passadas"
}
```

---

### 2. Não Pode Ter Horários Duplicados

```
POST /agendamentos

1º Body:
{
  "nome_cliente": "João",
  "servico": "Corte",
  "data": "2024-04-20",
  "horario": "14:00"
}

Resposta: Sucesso! ID: 1

2º Body (MESMO HORÁRIO):
{
  "nome_cliente": "Maria",
  "servico": "Manicure",
  "data": "2024-04-20",
  "horario": "14:00"
}

Resposta:
{
  "erro": "Já existe um agendamento para 2024-04-20 às 14:00. Escolha outro horário."
}
```

---

### 3. Campos Obrigatórios

Se faltar algum campo obrigatório:

```json
{
  "erro": "Campos obrigatórios: nome_cliente, servico, data, horario"
}
```

---

### 4. Formato de Data Inválido

```
Data deve estar em formato: YYYY-MM-DD
Exemplo correto: 2024-04-20

Resposta de erro:
{
  "erro": "Formato de data inválido. Use YYYY-MM-DD (ex: 2024-03-20)"
}
```

---

### 5. Formato de Horário Inválido

```
Hora deve estar em formato: HH:MM
Exemplo correto: 14:30

Resposta de erro:
{
  "erro": "Formato de horário inválido. Use HH:MM (ex: 14:30)"
}
```

---

### 6. Telefone Inválido

```
Telefone deve ter entre 10 e 11 dígitos

Resposta de erro:
{
  "erro": "Telefone inválido. Deve ter entre 10 e 11 dígitos"
}
```

---

### 7. Status Válidos

Os status permitidos são:

- `agendado` (padrão)
- `confirmado`
- `cancelado`
- `concluido`

Se enviar outro status:
```json
{
  "erro": "Status inválido. Use: agendado, confirmado, cancelado, concluido"
}
```

---

## 🔄 HTTP STATUS CODES

| Código | Significado | Quando ocorre |
|--------|-------------|---------------|
| 200 | OK | GET, PUT, DELETE com sucesso |
| 201 | Created | POST com sucesso (criado novo) |
| 400 | Bad Request | Validação falhou (campos inválidos) |
| 404 | Not Found | ID não encontrado |
| 500 | Server Error | Erro interno do servidor |

---

##  EXEMPLOS EM JAVASCRIPT (para o Frontend)

### Criar Agendamento

```javascript
const criarAgendamento = async (dados) => {
  try {
    const response = await fetch('http://localhost:3000/agendamentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    const result = await response.json();

    if (response.ok) {
      console.log(' Sucesso:', result.mensagem);
      return result;
    } else {
      console.error(' Erro:', result.erro);
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

// Uso:
criarAgendamento({
  nome_cliente: "João Silva",
  servico: "Corte de Cabelo",
  data: "2024-04-20",
  horario: "14:00",
  telefone: "(11) 98765-4321"
});
```

---

### Listar Agendamentos

```javascript
const listarAgendamentos = async () => {
  try {
    const response = await fetch('http://localhost:3000/agendamentos');
    const data = await response.json();

    if (response.ok) {
      console.log(`Total: ${data.total} agendamentos`);
      console.log(data.agendamentos);
      return data.agendamentos;
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

---

### Atualizar Agendamento

```javascript
const atualizarAgendamento = async (id, dados) => {
  try {
    const response = await fetch(`http://localhost:3000/agendamentos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    const result = await response.json();

    if (response.ok) {
      console.log(' Atualizado:', result.mensagem);
    } else {
      console.error(' Erro:', result.erro);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

---

### Deletar Agendamento

```javascript
const deletarAgendamento = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/agendamentos/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (response.ok) {
      console.log(' Deletado:', result.mensagem);
    } else {
      console.error(' Erro:', result.erro);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

---

##  TESTANDO COM POSTMAN

1. Abra o Postman
2. Use os exemplos acima (copie a URL e o Body)
3. Configure o método (POST, GET, PUT, DELETE)
4. Mude o Content-Type para JSON
5. Clique em Send
6. Veja a resposta

---

##  CHECKLIST 

- [ ] API está rodando (`node server.js`)
- [ ] Consegue listar agendamentos (GET /agendamentos)
- [ ] Consegue criar agendamento (POST /agendamentos)
- [ ] Consegue atualizar agendamento (PUT /agendamentos/:id)
- [ ] Consegue deletar agendamento (DELETE /agendamentos/:id)
- [ ] Validações estão funcionando
- [ ] Interface conecta na API
- [ ] Dados aparecem na tabela
- [ ] Botões de editar e deletar funcionam

---

##  Erros e como resolver

### "Erro: Cannot fetch from localhost:3000"
- Verifique se o servidor está rodando
- Execute: `node server.js`

### "erro: Não é possível agendar em datas passadas"
- Use uma data no futuro
- Formato: YYYY-MM-DD (ex: 2024-04-25)

### "erro: Já existe um agendamento para..."
- Escolha outro horário
- Ou escolha outro dia
- Não pode ter 2 agendamentos no mesmo dia e hora

### "erro: Campos obrigatórios..."
- Preencha todos os campos (nome, serviço, data, horário)
- Telefone é opcional

---