const mongoose = require("mongoose");

const Notificationchema = new mongoose.Schema({
    message:{ type: String, required: true },
    userId:{ type: mongoose.Schema.Types.ObjectId, role:"users", required: true }
}, { timestamps: true });

module.exports = mongoose.model("notification", Notificationchema);