const jwt = require("jsonwebtoken");
require('dotenv').config();

function jwtGenerator(user_id, manterAuth) {
    const payload = {
        user: user_id
    }    
    if (manterAuth) {
        return jwt.sign(payload, process.env.jwtSecret, {})
    } else {
        return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "4h"})
    }
}

module.exports = jwtGenerator;