const otp_generators = require("otp-generator")

const generateOtp = () => {
    const otp = otp_generators.generate(6, {
        upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false,
    });
    console.log("OTP: " + otp);

    return otp;
}

module.exports = generateOtp;