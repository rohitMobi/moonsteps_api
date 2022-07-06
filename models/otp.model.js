const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    otp:{ type: Number, required: true },
    userId:{ type: mongoose.Schema.Types.ObjectId, role:"users", required: true }
}, { timestamps: true });

OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });
module.exports = mongoose.model("otps", OTPSchema);