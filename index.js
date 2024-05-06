const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const port = 4000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 7007,
    password: 'ds564',
    database: 'clashroyaledb'
});

app.get('/cards', async (req, res) => {
    try {
        const allCards = await pool.query('SELECT * FROM cards;');
        return allCards ? res.status(200).json({
            total: allCards.rowCount,
            cards: allCards.rows
        }) : res.status(400).json({ message: 'Não há cartas cadastradas'});
    } catch(e) {
        console.error('Erro ao obter todas as cartas', e);
        res.status(500).send({ mensagem: 'Erro ao obter todas as cartas' });
    }
});

app.listen(port, () => console.log(`Server starred in http://localhost:${port}`));