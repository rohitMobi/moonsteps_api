const cloudinary = require("../services/cloudinary.service");

exports.uploadImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        return res.status(200).send({ status: "success", message: "Image Upload Successfully.", result: result });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error });
    }
}