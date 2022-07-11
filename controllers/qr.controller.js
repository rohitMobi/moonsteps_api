const qr = require("qrcode");

exports.qrgenerator = (req, res) => {
    res.render("qrscanner");
}


exports.qrscanner = (req, res) => {
    const url = req.body.url;

    if (url.length === 0) res.send("Empty Data!");
    qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");

        res.render("generateqr", { src });
    });
}