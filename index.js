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
        return allCards > 0 ? 
        res.status(200).json({
            total: allCards.rowCount,
            cards: allCards.rows
        }) : 
        res.status(200).json({ message: 'Não há cartas cadastradas'});
    } catch(e) {
        console.error('Erro ao obter todas as cartas', e);
        res.status(500).send({ mensagem: 'Erro ao obter todas as cartas' });
    }
});

app.get('/cards/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const card = await pool.query('SELECT * FROM cards WHERE id=$1;', [id]);
        return card ?
        res.status(200).send(card) : res.status(404).send({ message: 'Não há carta com este id' });
    } catch(e) {
        console.error('Erro ao obter a carta', e);
        res.status(500).send({ mensagem: 'Erro ao obter a carta' }); 
    }
});

//variables for includes
const types = ['construction', 'troop', 'air', 'spell'];
const rarityCards = ['commum', 'rare', 'epic', 'legendary', 'champion'];

app.post('/cards', async(req, res) => {
    try {
        const { name, level, rarity, type, life, damage } = req.body;

        if(name < 3) {
            return res.status(400).send({ message: 'invalid_name' });

        } else if(level < 1 || level > 15) {
            return res.status(400).send({ message: 'invalid_level' });

        } else if(!rarityCards.includes(rarity.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_rarity' });

        } else if(!types.includes(type.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_type' });

        } else if(typeof level !== 'number' || typeof life !== 'number' || typeof damage !== 'number') {
            return res.status(400).send({ message: 'invalid_type_number' });

        } else {
            await pool.query('INSERT INTO cards(name, level, rarity, type, life, damage) VALUES ($1, $2, $3, $4, $5, $5);',
            [name, level, rarity, type, life, damage]);
            return res.status(201).send({ message: `card ${name} registered` });
        }
    } catch(e) {
        console.error('Erro ao postar a carta', e);
        res.status(500).send({ mensagem: 'Erro ao postar a carta' });   
    }
});

app.put('/cards/:id', async(req, res) => {
    try {
        const { name, level, rarity, type, life, damage } = req.body;
        const { id } = req.params;
        
        if(name < 3) {
            return res.status(400).send({ message: 'invalid_name' });

        } else if(level < 1 || level > 15) {
            return res.status(400).send({ message: 'invalid_level' });

        } else if(!rarityCards.includes(rarity.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_rarity' });

        } else if(!types.includes(type.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_type' });

        } else if(typeof level !== 'number' || typeof life !== 'number' || typeof damage !== 'number') {
            return res.status(400).send({ message: 'invalid_type_number' });

        } else {
            await pool.query('UPDATE cards SET name=$1, level=$2, rarity=$3, type=$4, life=$5, damage=$6 WHERE id=$7;',
            [name, level, rarity, type, life, damage, id]);
            return res.status(200).send({ message: `card ${name} updated` });
        }
    } catch(e) {
        console.error('Erro ao editar a carta', e);
        res.status(500).send({ mensagem: 'Erro ao editar a carta' });   
    }
});


app.listen(port, () => console.log(`Server starred in http://localhost:${port}`));