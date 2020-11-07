const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');


const middleware = async (req, res, next) =>{
    try {
        const authorization = req.headers["authorization"];
        
        if (!authorization)
        throw new Error("Not authenticated")
        
        const token = authorization.split(" ")[1];
        const payload = jsonwebtoken.verify(token, process.env.ACCESS_JWT);
        
        
        const user = await User.findById(payload.user_id);

        if(!user)
            throw new Error("Not authenticated")

        req.auth_user = user;
        next();
    } catch (error) {
        console.error(error);
        res.statusCode = 403;
        next(error);
    }
}

module.exports = middleware;