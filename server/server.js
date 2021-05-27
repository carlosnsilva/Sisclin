require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const db = require("./db");

// middleware //
app.use(cors())
app.use(express.json())

// cadastro POST
app.use("/cadastro", require("./routes/cadastro.js"))

// login POST
app.use("/login", require("./routes/login.js"))

// consultas GET (nao eh obrigatorio auth)
app.use("/consulta", require("./routes/consultas.js"))


// execução do servidor
const port = process.env.PORT || 5555
app.listen(port, ()=> {
    console.log(`Servidor sisclin online na porta ${port}`);
});
