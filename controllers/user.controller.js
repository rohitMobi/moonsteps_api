const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const bcryptjs = require("bcryptjs");
const sendmail = require("../services/sendMail.service");
const generateOtp = require("../services/otp.service");
const jwt = require("jsonwebtoken");


exports.updateProfile = (req, res) => {
    const userid = req.params.userid;
    const { firstName, lastName, bio, gender, email, weight, height } = req.body;
    try {
        if(firstName && lastName && bio && gender && email && weight && height){
            if(!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)){
                res.status(500).send({ status: "error", message: "Email not valid" });
                return;
            }else if(gender !== "Male" && gender !== "Female" && gender !== "male" && gender !== "female"){
                res.status(500).send({ status: "error", message: "Gender not valid" });
                return;
            }

            User.findOne({ _id: userid, email: email }).then((data) => {
                console.log(data)
                User.findByIdAndUpdate(userid, { $set: { firstName: firstName, lastName : lastName, bio: bio, gender: gender, email: email, weight: weight, height: height } }).then(() => {
                    res.status(200).send({ status: "success", message: "User Update Successfully." });
                }).catch((err) => {
                    res.status(500).send({ status: "error", message: err });
                });
            }).catch(() => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            })
        }else{
            res.status(500).send({ status: "error", message: "User Id or firstName, lastName, bio, gender, email, weight, height not found." });
            return;
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}



exports.updateProfileGenderHeightWeight = (req, res) => {
    const userid = req.params.userid;
    const { gender, weight, height } = req.body;
    try {
        if(gender && weight && height){
            if(gender !== "Male" && gender !== "Female" && gender !== "male" && gender !== "female"){
                res.status(500).send({ status: "error", message: "Gender not valid" });
                return;
            }

            User.findByIdAndUpdate(userid, { $set: { gender: gender, weight: weight, height: height } }).then(() => {
                res.status(200).send({ status: "success", message: "User Update Gender, Weight, Height Successfully." });
            }).catch(() => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            })
        }else{
            res.status(500).send({ status: "error", message: "User Id or gender, weight, height not found." });
            return;
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}


exports.updateProfileGenderHeightWeightByEmail = (req, res) => {
    const email = req.params.email;
    const { gender, weight, height } = req.body;
    try {
        if(gender && weight && height){
            if(gender !== "Male" && gender !== "Female" && gender !== "male" && gender !== "female"){
                res.status(500).send({ status: "error", message: "Gender not valid" });
                return;
            }else if(!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)){
                res.status(500).send({ status: "error", message: "Email not valid" });
                return;
            }

            User.findOne({ email : email }).then((data) => {
                User.findByIdAndUpdate(data._id, { $set: { gender: gender, weight: weight, height: height } }).then(() => {
                    res.status(200).send({ status: "success", message: "User Update Gender, Weight, Height Successfully." });
                })
            }).catch(() => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            })
        }else{
            res.status(500).send({ status: "error", message: "User Id or gender, weight, height not found." });
            return;
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}