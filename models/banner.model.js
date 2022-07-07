const mongoose = require("mongoose");

const Banner = mongoose.model(
  "Banner",
  new mongoose.Schema({
    name: {type:String},
    description: {type:String},
    media: [
        {
          url: {type:String},
          type: {type:String},
          link: {type:String}
        }
    ],
  })
);

module.exports = Banner;