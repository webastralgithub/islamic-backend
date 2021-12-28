const jwt = require('jsonwebtoken')


module.exports = {
    isAdmin: (req, res, next) =>{
        const token  = req.header('auth-token');
        // console.log('admin middleware');
        if(!token) return res.status(401).json('Access Denied');
    const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        if(verified.role == 'admin'){
            next();
        }else{
            res.status(403).json("You are not allowed to access this route!!");
        }
    }
}

