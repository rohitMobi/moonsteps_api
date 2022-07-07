const Notification = require("../models/notification.model");

exports.createNotification = (req, res) =>{
    const { message, userid } = req.body;
    const newNotication = new Notification({ message: message, userId: userid });

    newNotication.save().then(() => {
        res.status(200).send({ status: "success", message: "Successfully Send Notification" });
    }).catch((err) => {
        res.status(500).send({ status: "error", message: err });
    })
}


exports.getNotificationByUser = (req, res) =>{
    const userid = req.params.userid;

    Notification.find({userId : userid}).then((data) => {
        res.status(200).send({ status: "success", message: "Successfully Get Users Notification", data: data });
    }).catch((err) => {
        res.status(500).send({ status: "error", message: err });
    })
}