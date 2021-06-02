require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../db");


// GET || consulta por agendamentos retorna um json 
// com os agendamentos existentes no banco de dados, recebe os parametros:
//     - login
//     - consultante (medico, cliente)

router.get("/agendamentos", async function(req, res) {
    try {
        const usr = await db.query(`SELECT x.id_${req.params.consultante} FROM ${req.params.consultante} x WHERE x.login = ${req.params.login}`) 
        let query;

        if (usr.rows.length === 0) {
            return res.status(401).json({
                status:"error",
                dados: {
                    Erro: "Erro, usuário nao encontrado."
                }
            });
        } else {
            if (req.params.consultante === "medico") {
                query = await db.query(`SELECT * FROM consulta c WHERE c.id_medico = ${usr.rows[0].id_medico}`) 
            } else {
                query = await db.query(`SELECT * FROM consulta c WHERE c.id_cliente = ${usr.rows[0].id_cliente}`)
            }            
        }

        res.status(200).json({
            status:"success",
            results: query.rows.length,
            data: {
                agendamentos: query.rows
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    };
});


// GET || consulta pelo historico de um cliente retorna um json 
// com os agendamentos existentes no banco de dados, recebe o parametro:
//     - login

router.get("/historico", async function(req, res) {
    try {
        const usr = await db.query(`SELECT c.id_cliente FROM cliente WHERE c.login = ${req.params.login}`) 
        let query;

        if (usr.rows.length === 0) {
            return res.status(401).json({
                status:"error",
                dados: {
                    Erro: "Erro, usuário nao encontrado."
                }
            });
        }
        
        query = await db.query(`SELECT * FROM cliente_hist_consulta chc WHERE chc.cliente = ${usr.rows[0].id_cliente}`);

        res.status(200).json({
            status:"success",
            results: query.rows.length,
            data: {
                historico: query.rows
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    };
});



module.exports = router;