const express = require("express");
const router = express.Router();
const upload = require("../services/multer.service");
const jwtAuth = require("../middelware/jwtAuth");
const authController = require("../controllers/auth.controller")
const userController = require("../controllers/user.controller")
const notificationController = require("../controllers/notification.controller");
const bannerController = require("../controllers/banner.controller");
const fileController = require("../controllers/file.controller");

// Files Routes
router.post("/file/upload", upload.single("image"), fileController.uploadImage);

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
router.patch("/user/updateprofilephoto/:userid", jwtAuth.verifyToken, userController.updateProfilePhoto);
router.patch("/user/updategenheiwei/:userid", jwtAuth.verifyToken, userController.updateProfileGenderHeightWeight);
router.patch("/user/updategenheiweibyemail/:email", jwtAuth.verifyToken, userController.updateProfileGenderHeightWeightByEmail);
router.patch("/user/updategeolocation/:userid", jwtAuth.verifyToken, userController.updateGeolocation);

// Notification Routes
router.post("/user/createnotification", notificationController.createNotification);
router.get("/user/getusersnotification/:userid", notificationController.getNotificationByUser);

// Banner Controller
router.get("/banner",jwtAuth.verifyToken,jwtAuth.isAdmin,bannerController.getAllBanner);
router.get("/banner/:id",jwtAuth.verifyToken,jwtAuth.isAdmin,bannerController.getSingleBanner);    
router.post("/banner",jwtAuth.verifyToken,jwtAuth.isAdmin,bannerController.createBanner);
router.put("/banner/:id",jwtAuth.verifyToken,jwtAuth.isAdmin,bannerController.updateBanner);


module.exports = router;