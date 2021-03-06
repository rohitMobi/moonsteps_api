const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const bcryptjs = require("bcryptjs");
const sendmail = require("../services/sendMail.service");
const generateOtp = require("../services/otp.service");
const jwt = require("jsonwebtoken");

exports.signup = async(req, res) => {
    const { email, password, confirm_password, phone, role } = req.body;

    try {
        if (email != "" && password != "" && confirm_password != "" && phone != 0 && role != "") {
            if (!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)) {
                res.status(500).send({ status: "error", message: "Email not valid" });
                return;
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)) {
                res.status(500).send({ status: "error", message: "Password not valid" });
                return;
            } else if (password != confirm_password) {
                res.status(500).send({ status: "error", message: "Password or Confirm Password not matched." });
                return;
            } else if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(phone)) {
                res.status(500).send({ status: "error", message: "Phone Number not valid" });
                return;
            }

            const isEmail = await User.findOne({ email: email });
            const isMobile = await User.findOne({ phone: phone });
            if(isEmail && isMobile){
                res.status(500).send({ status: "error", message: "Email & Phone Number is already exits." });
                return;
            }else if(isEmail){
                res.status(500).send({ status: "error", message: "Email is already exits." });
                return;
            }else if(isMobile){
                res.status(500).send({ status: "error", message: "Mobile Phone is already exits." });
                return;
            }

            const newUser = new User({ firstName: "", lastName: "", bio: "", gender: "", email: email, profilePhoto: "", password: bcryptjs.hashSync(password, 8), phone: phone, role: role, isVerify: false, weight: 0, height: 0, lat: 0, long: 0 });
            newUser.save().then(async (data) => {
                const OTP = generateOtp();
                const htmlContent = `
                    <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                            <h2>Welcome to the MoonSteps.</h2>
                            <h4>You are officially In ???</h4>
                            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
                            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
                    </div>`;
                var sendMailStatus = await sendmail(email, "Registed SuccessFully", htmlContent);
                const newOTP = new Otp({ otp: OTP, userId: data._id });
                newOTP.save().then(() => {
                    res.status(200).send({ status: "success", message: "Successfully User Register" });
                }).catch((err) => {
                    res.status(500).send({ status: "error", message: err });
                })
            }).catch((error) => {
                res.status(500).send({ status: "error", message: "Your Email Or Mobile Number is already register.", err: error });
            });
        } else {
            res.status(500).send({ status: "error", message: "All Fields are required. Fields is email, password, confirm password, phone" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.signin = async(req, res) => {
    const { email, password } = req.body;
    try {
        if (!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)) {
            res.status(500).send({ status: "error", message: "Email not valid" });
            return;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password)) {
            res.status(500).send({ status: "error", message: "Password not valid" });
            return;
        }
        
        var user = await User.findOne({ email: email })
        if(user){
            if (bcryptjs.compareSync(password, user.password)) {
                const token = jwt.sign({ id: user._id }, "Moonsteps", { expiresIn: "1h" });
                res.status(200).send({ status: "success", message: "Successfully User Login", token: token, userId: user._id, email: email });
            } else {
                res.status(500).send({ status: "error", message: "Password Not Matched." });
            }
        }else{
            res.status(500).send({ status: "error", message: "User not found." });
        }
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.sendOTP = (req, res) => {
    const userid = req.params.userid;
    try {
        if (userid == '' || userid == undefined || userid == null) {
            res.status(500).send({ status: "error", message: "User Not Valid" });
            return;
        }
        User.findById(userid).then((userdata) => {
            Otp.findOne({ userId: userid }).then((otpdata) => {
                console.log(otpdata);
                if(otpdata != null){
                    res.status(500).send({ status: "error", message: "Otp Already Send." });
                }else{

                    const OTP = generateOtp();
                    const htmlContent = `
                            <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                                    <h2>Welcome to the MoonSteps.</h2>
                                    <h4>You are officially In ???</h4>
                                    <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
                                    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
                            </div>`;
                    sendmail(userdata.email, "Registed SuccessFully", htmlContent);
                    const newOTP = new Otp({ otp: OTP, userId: userid });
                    newOTP.save().then(() => {
                        res.status(200).send({ status: "success", message: "Successfully OTP Send" });
                    }).catch((err) => {
                        res.status(500).send({ status: "error", message: err });
                    });
                }
            }).catch((err) => {
                res.status(500).send({ status: "error", message: err });
            })
        }).catch((err) => {
            res.status(500).send({ status: "error", message: "User Not Found." });
        })
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.verifyOTP = (req, res) => {
    const userid = req.params.userid;
    const otp = req.body.otp;
    try {
        if (userid == "" || otp == "" || userid == null || otp == null || userid == undefined || otp == undefined) {
            res.status(500).send({ status: "error", message: "User or OTP not found." });
            return;
        }
        User.findById(userid).then((userdata) => {
            Otp.findOne({ userId: userid, otp: otp }).then((otpdata) => {
                if (!otpdata) {
                    res.status(500).send({ status: "error", message: "OTP Expired" });
                    return;
                }
                User.findByIdAndUpdate(userid, { $set: { isVerify: true } }).then(() => {
                    Otp.findByIdAndDelete(otpdata._id).then(() => {
                        res.status(200).send({ status: "success", message: "OTP Verify Successfully." });
                    }).catch((error) => {
                        res.status(500).send({ status: "error", message: error });
                    });
                }).catch((error) => {
                    res.status(500).send({ status: "error", message: error });
                });
            }).catch((error) => {
                res.status(500).send({ status: "error", message: error });
            })
        }).catch((error) => {
            res.status(500).send({ status: "error", message: "User Not Found" });
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.sendOTPByEmail = (req, res) => {
    const email = req.params.email;
    try {
        if (email == '' || email == undefined || email == null) {
            res.status(500).send({ status: "error", message: "User Email is required" });
            return;
        } else if (!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)) {
            res.status(500).send({ status: "error", message: "Email not valid" });
            return;
        } 
        User.findOne({email: email}).then((userdata) => {
            Otp.findOne({ userId: userdata._id }).then((otpdata) => {
                console.log(otpdata);
                if(otpdata != null){
                    res.status(500).send({ status: "error", message: "Otp Already Send." });
                }else{

                    const OTP = generateOtp();
                    const htmlContent = `
                            <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                                    <h2>Welcome to the MoonSteps.</h2>
                                    <h4>You are officially In ???</h4>
                                    <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
                                    <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
                            </div>`;
                    sendmail(userdata.email, "Registed SuccessFully", htmlContent);
                    const newOTP = new Otp({ otp: OTP, userId: userdata._id });
                    newOTP.save().then(() => {
                        res.status(200).send({ status: "success", message: "Successfully OTP Send" });
                    }).catch((err) => {
                        res.status(500).send({ status: "error", message: err });
                    });
                }
            }).catch((err) => {
                res.status(500).send({ status: "error", message: err });
            })
        }).catch((err) => {
            res.status(500).send({ status: "error", message: "User Not Found"});
        })
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.verifyOTPByEmail = (req, res) => {
    const email = req.params.email;
    const otp = req.body.otp;
    try {
        if (email == "" || otp == "" || email == null || otp == null || email == undefined || otp == undefined) {
            res.status(500).send({ status: "error", message: "User Email or OTP not found." });
            return;
        } else if (!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)) {
            res.status(500).send({ status: "error", message: "Email not valid" });
            return;
        }

        User.findOne({ email: email }).then((userdata) => {
            Otp.findOne({ userId: userdata._id, otp: otp }).then((otpdata) => {
                if (!otpdata) {
                    res.status(500).send({ status: "error", message: "OTP Expired" });
                    return;
                }
                User.findByIdAndUpdate(userdata._id, { $set: { isVerify: true } }).then(() => {
                    Otp.findByIdAndDelete(otpdata._id).then(() => {
                        res.status(200).send({ status: "success", message: "OTP Verify Successfully." });
                    }).catch((error) => {
                        res.status(500).send({ status: "error", message: error });
                    });
                }).catch((error) => {
                    res.status(500).send({ status: "error", message: error });
                });
            }).catch((error) => {
                res.status(500).send({ status: "error", message: error });
            })
        }).catch((error) => {
            res.status(500).send({ status: "error", message: "User Not Found" });
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.resetPassword = (req, res) => {
    const userid = req.params.userid;
    const { new_password, confirm_password } = req.body;
    try {
        if (userid == "" || userid == null || userid == undefined) {
            res.status(500).send({ status: "error", message: "User or OTP not found." });
            return;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(new_password)) {
            res.status(500).send({ status: "error", message: "New Password not valid" });
            return;
        } else if (new_password != confirm_password) {
            res.status(500).send({ status: "error", message: "New Password or Confirm Password not matched." });
            return;
        }
        User.findById(userid).then(() => {
            User.findByIdAndUpdate(userid, { $set: { password: bcryptjs.hashSync(new_password, 8) } }).then((data) => {
                res.status(200).send({ status: "success", message: "Password Update Successfully."});
            }).catch((err) => {
                res.status(500).send({ status: "error", message: err });
            });
        }).catch((err) => {
            res.status(500).send({ status: "error", message: "User not found" });
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.resetPasswordByEmail = (req, res) => {
    const email = req.params.email;
    const { new_password, confirm_password } = req.body;
    try {
        if (email == "" || email == null || email == undefined) {
            res.status(500).send({ status: "error", message: "User or OTP not found." });
            return;
        } else if (!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)) {
            res.status(500).send({ status: "error", message: "Email not valid" });
            return;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(new_password)) {
            res.status(500).send({ status: "error", message: "New Password not valid" });
            return;
        } else if (new_password != confirm_password) {
            res.status(500).send({ status: "error", message: "New Password or Confirm Password not matched." });
            return;
        }

        User.findOne({ email: email }).then((userdata) => {
            User.findByIdAndUpdate(userdata._id, { $set: { password: bcryptjs.hashSync(new_password, 8) } }).then((data) => {
                res.status(200).send({ status: "success", message: "Password Update Successfully."});
            }).catch((err) => {
                res.status(500).send({ status: "error", message: err });
            });
        }).catch((err) => {
            res.status(500).send({ status: "error", message: "User not found" });
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}

exports.changePassword = (req, res) => {
    const userid = req.params.userid;
    const { email, otp, new_password } = req.body;
    try {
        if (userid == "" || userid == null || userid == undefined || otp == "" || otp == null || otp == undefined || new_password == "" || new_password == null || new_password == undefined || email == "" || email == null || email == undefined) {
            res.status(500).send({ status: "error", message: "User Id or OTP or Email or New Password not found." });
            return;
        } else if (!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)) {
            res.status(500).send({ status: "error", message: "Email not valid" });
            return;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(new_password)) {
            res.status(500).send({ status: "error", message: "New Password not valid" });
            return;
        }

        User.findOne({ _id: userid, email: email }).then((userdata) => {
            Otp.findOne({ userId: userdata._id, otp: otp }).then((otpdata) => {
                if (!otpdata) {
                    res.status(500).send({ status: "error", message: "OTP Expired" });
                    return;
                }
                User.findByIdAndUpdate(userdata._id, { $set: { isVerify: true } }).then(() => {
                    Otp.findByIdAndDelete(otpdata._id).then(() => {
                        User.findByIdAndUpdate(userid, { $set: { password: bcryptjs.hashSync(new_password, 8) } }).then((data) => {
                            res.status(200).send({ status: "success", message: "Password Update Successfully."});
                        }).catch((err) => {
                            res.status(500).send({ status: "error", message: err });
                        });
                    }).catch((error) => {
                        res.status(500).send({ status: "error", message: error });
                    });
                }).catch((error) => {
                    res.status(500).send({ status: "error", message: error });
                });
            }).catch((error) => {
                res.status(500).send({ status: "error", message: error });
            })
        }).catch((error) => {
            res.status(500).send({ status: "error", message: "User Not Found" });
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error });
    }
}