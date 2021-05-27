const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.post("/", async (req, res) => {

    function senhaInsegura (senha) {
        const letras_minusculas = 'abcdefghijklmnopqrstuvwxyz';
        const letras_maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numeros = '0123456789'
        const especiais = '!@#$%¨&*()_'

        let count_num = 0
        let count_esp = 0
        let count_ltr_min = 0
        let count_ltr_mai = 0 

        for (let i = 0; i < senha.length; i++) {
            if (letras_minusculas.indexOf(senha.charAt(i)) != -1) {
                count_ltr_min += 1 
            } else if (letras_maiusculas.indexOf(senha.charAt(i)) != -1) {
                count_ltr_mai += 1
            } else if (numeros.indexOf(senha.charAt(i)) != -1) {
                count_num += 1
            } else if (especiais.indexOf(senha.charAt(i)) != -1) {
                count_esp += 1
            }
        }
        if ((count_ltr_min === 0) | (count_ltr_mai === 0) | (count_num === 0) | (count_esp === 0) | (senha.length < 8)) {
            return true
        } else {
            return false
        }
    }

    try {

        const erros = {}
        const campos = req.body

        // verificacao se todos os campos necessarios para o cadastro existem existem
        // retorna true se todos os campos estiverem presentes
        const listaObjetos = [
            "Nome", "Login", "Senha", "Confirmação",
        ]
        let retorno = false
        for (campo of listaObjetos) {
            if (!(campo in campos)) {
                retorno = true
            }
        }
        if (retorno) {
            return res.status(400).json({
                status:"error",
                dados: {
                    Erro: "Bad request"
                }
            })
        }

        // verificacao se nenhum campo informado foi deixado em branco
        for (let campo in campos) {
            if (campos[campo] === "") {
                erros[campo] = "Campo vazio"
            }
        }

        // busca por erros nos campos informados
        // -- busca por erros na senha 
        if ((erros["Senha"] === undefined) && (erros["Confirmação"] === undefined)) {
            if (campos.senha != campos.Confirmação) {
                erros["Senhas"] = "As Senhas divergem"
            } else if (senhaInsegura(campos.senha)) {
                erros["Senhas"] = "As Senhas devem tery 8 caracteres ou mais, possuir: letra minúscula, letra maiúscula, número e caractere especial"
            }
        }
        // -- verificacao se o nome possui 3 caracteres ou mais
        if(erros["Nome"] == undefined) {
            if (campos.nome.length < 3) {
                erros["nome"] = "O nome do usuário deve possuir 3 caracteres ou mais"
            }
        }        
        // -- verificacao se o login do usuário possúi menos de 6 caracteres / se existe no banco de dados
        if (erros["Login"] === undefined) {
            if (campos.login.length <= 5) {
                erros["Login"] = "O login do usuário deve possuir mais de 6 caracteres."
            }
        } else {
            const busca = await db.query("SELECT * FROM $1 x WHERE x.login = $2;", [campos.tipocadastro, campos.login])
            if (busca.rowCount != 0) {
                erros["Login"] = "Login indisponível"
            }
        }

        // realizacao do cadastro
        if (Object.keys(erros).length === 0) {

            const senhaHash = await bcrypt.hash(campos.senha, 11);

            let insert = "INSERT INTO $1(nome, login, senha"

            if (campos.tipocadastro === "medico") {
                insert += "crm, especialidade) VALUES ($2, $3, $4, $5, $6)"
            } else {
                insert += ") VALUES ($2, $3, $4)"
            } 

            await db.query(insert, [campos.tipocadastro, campos.nome, campos.login, senhaHash, campos.crm, campos.especialidade])

            // retorna um json contendo o email e o login do usuario
            return res.status(200).json({
                status:"success",
                dados: {
                    login: campos.login
                }
            })
        } else {
            return res.status(200).json({
                status: "error",
                errors: erros
            })
        }
    } catch (error) {
        console.error("! Erro: ",error.message, " !");
        return res.status(500).json("Server Error");
    }
})

module.exports = router;