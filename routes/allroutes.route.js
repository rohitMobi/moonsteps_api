const express = require("express");
const router = express.Router();
const jwtAuth = require("../middelware/jwtAuth");
const authController = require("../controllers/auth.controller")
const userController = require("../controllers/user.controller")

// Auth Routes
router.post("/auth/signup", authController.signup);
router.post("/auth/signin", authController.signin);
router.post("/auth/sendotp/:userid", authController.sendOTP);
router.post("/auth/verifyotp/:userid", authController.verifyOTP);
router.post("/auth/sendotpbyemail/:email", authController.sendOTPByEmail);
router.post("/auth/verifyotpbyemail/:email", authController.verifyOTPByEmail);
router.patch("/auth/resetpassword/:userid", authController.resetPassword);
router.patch("/auth/resetpasswordbyemail/:email", authController.resetPasswordByEmail);
router.patch("/auth/changepassword/:userid", jwtAuth.verifyToken, authController.changePassword);

// Users Routes
router.patch("/user/updateprofile/:userid", jwtAuth.verifyToken, userController.updateProfile);
router.patch("/user/updategenheiwei/:userid", jwtAuth.verifyToken, userController.updateProfileGenderHeightWeight);
router.patch("/user/updategenheiweibyemail/:email", jwtAuth.verifyToken, userController.updateProfileGenderHeightWeightByEmail);


module.exports = router;