const jwt = require('jsonwebtoken')


module.exports = {
    isAdmin: (req, res, next) =>{
        const token  = req.header('auth-token');
        if(!token) return res.status(401).send('Access Denied');
    const verified = jwt.verify(token,process.env.TOKEN_SECRET);
    // console.log(verified);
        if(verified.role='admin'){
            next();
        }else{
            res.status(403).send("You are not allowed to access this route!!");
        }
    }
}

