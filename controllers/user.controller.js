const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const bcryptjs = require("bcryptjs");
const sendmail = require("../services/sendMail.service");
const generateOtp = require("../services/otp.service");
const jwt = require("jsonwebtoken");


exports.updateProfile = (req, res) => {
    const userid = req.params.userid;
    const { firstName, lastName, bio, gender, email, weight, height, profilePhoto } = req.body;
    try {
        if(firstName && lastName && bio && gender && email && weight && height && profilePhoto){
            if(!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)){
                res.status(500).send({ status: "error", message: "Email not valid" });
                return;
            }else if(gender !== "Male" && gender !== "Female" && gender !== "male" && gender !== "female"){
                res.status(500).send({ status: "error", message: "Gender not valid" });
                return;
            }

            User.findOne({ _id: userid }).then((data) => {
                if(data !== null){
                    User.findByIdAndUpdate(userid, { $set: { firstName: firstName, lastName : lastName,bio: bio, gender: gender, email: email, weight: weight, height: height, profilePhoto: profilePhoto } }).then(() => {
                        res.status(200).send({ status: "success", message: "User Update Successfully." });
                    }).catch((err) => {
                        res.status(500).send({ status: "error", message: err });
                    });
                }else{
                    res.status(500).send({ status: "error", message: "User Not Found" });
                }
            }).catch(() => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            })
        }else{
            res.status(500).send({ status: "error", message: "User Id or first name, last name, bio, gender, email, weight, height, profile photo not found." });
            return;
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.updateProfilePhoto = (req, res) => {
    const userid = req.params.userid;
    const { profilePhoto } = req.body;
    try {
        if(profilePhoto){
            console.log("User Id: " + userid);
            User.findOne({ _id: userid }).then((data) => {
                if(data !== null){
                    User.findByIdAndUpdate(userid, { $set: { profilePhoto: profilePhoto } }).then(() => {
                        res.status(200).send({ status: "success", message: "User Update Successfully." });
                    }).catch((err) => {
                        res.status(500).send({ status: "error", message: err });
                    });   
                }else{
                    res.status(500).send({ status: "error", message: "User Not Found" });
                }
            }).catch((err) => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            })
        }else{
            res.status(500).send({ status: "error", message: "User Id or Profile Photo not found." });
            return;
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}


exports.updateGeolocation = (req, res) => {
    const userid = req.params.userid;
    const { lat, long } = req.body;
    try {
        if(lat && long){
            console.log("User Id: " + userid);
            User.findOne({ _id: userid }).then((data) => {
                if(data !== null){
                    User.findByIdAndUpdate(userid, { $set: { profilePhoto: profilePhoto } }).then(() => {
                        res.status(200).send({ status: "success", message: "User Update Successfully." });
                    }).catch((err) => {
                        res.status(500).send({ status: "error", message: err });
                    });   
                }else{
                    res.status(500).send({ status: "error", message: "User Not Found" });
                }
            }).catch((err) => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            })
        }else{
            res.status(500).send({ status: "error", message: "User Id or Latitude, Longitude not found." });
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

            User.findOne({ _id: userid }).then((data) => {
                if(data !== null){
                    User.findByIdAndUpdate(userid, { $set: { gender: gender, weight: weight, height: height } }).then(() => {
                        res.status(200).send({ status: "success", message: "User Update Gender, Weight, Height Successfully." });
                    }).catch(() => {
                        res.status(500).send({ status: "error", message: "User Not Found" });
                    })
                }else{
                    res.status(500).send({ status: "error", message: "User Not Found" });
                }
            }).catch((err) => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            });
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
                if(data !== null){
                    User.findByIdAndUpdate(data._id, { $set: { gender: gender, weight: weight, height: height } }).then(() => {
                        res.status(200).send({ status: "success", message: "User Update Gender, Weight, Height Successfully." });
                    }).catch(() => {
                        res.status(500).send({ status: "error", message: "User Not Found" });
                    })
                }else{
                    res.status(500).send({ status: "error", message: "User Not Found" });
                }
            }).catch((err) => {
                res.status(500).send({ status: "error", message: "User Not Found" });
            });
        }else{
            res.status(500).send({ status: "error", message: "User Id or gender, weight, height not found." });
            return;
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}