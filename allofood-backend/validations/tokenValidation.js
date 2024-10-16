const jwt = require('jsonwebtoken');
require('dotenv').config();

function validateToken(token) {
    try{
        let decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        let obj = {"success": "Token is valid", "data": decodedToken};
        return obj;
    } catch (err) {
        return {"error": "Token is invalid"}
    }
}

module.exports = validateToken;