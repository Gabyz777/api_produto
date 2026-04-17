
require('dotenv').config(); 

const { Pool } = require('pg');

const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
};

const pool = new Pool(config);

pool.on('error', (err, client) => {
    console.error("Erro inesperado no banco pelo Pool", err);
});

module.exports = pool;