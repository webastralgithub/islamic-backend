const jwt = require('jsonwebtoken')

module.exports =  function(req,res,next){

    const token  = req.header('auth-token');
    // console.log("tokkkkkkkkkkkkkkkkkkkkkkkkkkkkkkken:   ",token);
    if(!token) return res.status(401).json('Access Denied');

    try {
        
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        // console.log(verified);
        next();
    } catch (error) {

        res.status(400).json('Invalid token');
        
    }

}