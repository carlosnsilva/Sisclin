const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/criar_token");

router.post("/", async (req, res) => {
    try {

        //1. "pegar" os dados do req.body
        // - login
        // - senha
        // - tipo de usuario (medico, atendente, cliente)
        // - manter autenticacao ativa (true, false)
        
        const {login, senha, tipoUsr, manterAuth} = req.body;

        //2. checa se o usuario existe(se não existir gerar erro)
        console.log(tipoUsr,login)
        const usr = await pool.query(`SELECT * FROM ${tipoUsr} WHERE login = ${login}`);
        if (usr.rows.length === 0) {
            return res.status(401).json({
                status:"error",
                dados: {
                    Erro: "Erro, usuário ou senha incorretos."
                }
            });
        };
        
        //3. checa se a senha é válida
        const senhaValida = await bcrypt.compare(senha, usr.rows[0].senha);
        if (!senhaValida) {
            return res.status(401).json({
                status:"error",
                dados: {
                    Erro: "Erro, usuário ou senha incorretos."
                }
            });
        }
        //4. retorna o token
        const token = jwtGenerator(usr.rows[0].id_usr, manterAuth);
        res.json({token})


    } catch (error) {
        console.log(error)
    }
})

module.exports = router;