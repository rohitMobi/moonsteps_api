const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = (req, res, next) => {
    const token = req.headers['token'];

    if(token == '' || token == undefined || token == null){
        res.status(400).send({status: "error", message: "No Token Provided"});
    }
    
    try {
        var verifyTokenStatus = jwt.verify(token, "Moonsteps");
        if(!verifyTokenStatus){
            res.status(400).send({status: "error", message: "Something Went Wrong"});
        }
        req.userid = verifyTokenStatus.id;
        next();
    } catch (err) {
        res.status(400).send({status: "error", message: err});
    }
}

const isAdmin = (req, res, next) => {
    const userId = req.userid;

    try {
        User.findById(userId, (err, data) =>{
            if(err){
                res.status(400).send({status: "error", message: err});
            }

            if(data.role == "admin"){
                next();
                return;
            }else{
                res.status(400).send({status: "error", message: "Only Admin Access This API"});
            }
        })
    } catch (error) {
        res.status(400).send({status: "error", message: err});
    }
}

const data ={
    verifyToken,
    isAdmin
};

module.exports = data;