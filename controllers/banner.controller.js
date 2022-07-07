const Banner = require("../models/banner.model");

exports.getAllBanner = (req,res)=>{

    Banner.find({},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "All Banner",
              data: data
          });
        }
    });
}

exports.getSingleBanner = (req,res)=>{

    Banner.find({_id:req.params.id},(err,data)=>{
        if(err){
          res.status(500).send({ status:"error", message: err });
        } else {
          res.status(200).send({
              status:"success",
              message : "Banner",
              data: data
          });
        }
    });
}

exports.createBanner = (req, res) => {
    const banner = new Banner({
      name: req.body.name,
      description: req.body.description,
      media: req.body.media
    });
  
    banner.save((err, data) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
  
        res.status(200).send({
            status:"success",
            message : "Banner Created Successful"
        });
    });
};

exports.updateBanner = (req,res)=>{
  Banner.findByIdAndUpdate(req.params.id,{$set:{name: req.body.name,description: req.body.description,media:req.body.media}},(err,data)=>{
    if(err){
      res.status(500).send({ status:"error", message: err });
    } else {
      res.status(200).send({
          status:"success",
          message : "Banner updated successfully"
      });
    }
  });
}