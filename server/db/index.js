// Conexão com o banco de dados

const { Pool } = require("pg");

const configs = {
    user:"postgres",
    host:"localhost",
    password:"carlos",
    database:"sisclin",
    port:5432,
    client_encoding:"UTF8",
};

const pool = new Pool(configs);

module.exports = {
    query: (text, params) => pool.query(text, params)
};