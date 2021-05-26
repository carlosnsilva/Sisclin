const jwt = require("jsonwebtoken");
require("dotenv").config();


// checa se o usuario possui token, se possuir verifica se o token é valido
module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token"); // o token estará no header
        // checa se há token
        if (!jwtToken) {
            return res.status(403).json("Not Authorized")
        }

        // checa se o token é valido
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;

        next();

    } catch (error) { 
        console.error(error.message)
        return res.status(403).json("Not Authorized")
    }
}