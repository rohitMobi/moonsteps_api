const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName:{ type: String },
    lastName:{ type: String },
    bio:{ type: String },
    gender:{ type: String },
    email:{ type: String, required: true, unique: true },
    password:{ type: String, required: true },
    role:{ type: String, required: true },
    phone:{ type: Number, required: true, unique: true },
    weight:{ type: Number },
    height:{ type: Number },
    isVerify:{ type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model("users", UserSchema);