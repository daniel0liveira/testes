'use strict'
global.SALT_KEY = 'ffed98b4978eb672a14de2deb00a205f94027a0f28165047af237dfa4eab45be';
const jwt = require('jsonwebtoken');


exports.generateToken = async(data)=> {
    return jwt.sign(data,global.SALT_KEY, {expiresIn : '1d'});
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token,global.SALT_KEY);
    return data;
}

exports.authorize = (req,res,next) => {
    let token =  req.query.token || req.headers['Authorization'];

    if(!token){
        res.status(401).json({
                message : 'Não Autorizado!'
        });
    }else{
        jwt.verify(token,global.SALT_KEY,function(error,decoded){
            if(error){
                res.status(401).json({message : 'Token Inválido'});
            }
            else{
                next();
            }
        });
    }
}