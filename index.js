const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
    password: 'ds564',
    database: 'clashroyaledb'
});