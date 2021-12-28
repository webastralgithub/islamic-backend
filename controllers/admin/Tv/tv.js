const express = require('express')
const Tv = require("../../../models/Tv.js");
const path = require("path")
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  
const ThumbnailGenerator = require('video-thumbnail-generator').default;

exports.create = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
                  cb(null, './uploads/tv');
                },
                filename: function (req, file, cb) {
                  cb(null, file.originalname);
              }
      });
        var upload = multer({
        storage: storage
      }).any();
      
      upload(req, res, async function(err) {
        if (err) {
            return res.end('Error');
        } else {
            const tg = new ThumbnailGenerator({
                sourcePath: req.files[0].path,
                thumbnailPath: './uploads/thumbnails/',
                tmpDir: './uploads/thumbnails' //only required if you can't write to /tmp/ and you need to generate gifs
              });
              tg.generateOneByPercentCb(90, async (err, result) => {
                console.log(result);
                const tv = new Tv({
                    title:req.body.title,
                    description:req.body.description,
                    video:req.files[0].originalname,
                    thumbnailPath:result
                });
                try {
                    const saveTv = await tv.save();
                    return res.status(200).json({data:saveTv,msg:"Tv created successfully."});
                } catch (error) {
                    return res.status(400).send(error);
                }
              });
               
       
        }
      }); 
}


exports.edit = (req,res) =>{

  Tv.findById(req.params._id)
  .then(tv => {
      if(!tv) {
          return res.status(404).send({
              message: "Tv not found with id " + req.params._id
          });
      }
      return res.json(tv);
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "Tv not found with id " + req.params._id
          });                
      }
      return res.status(500).send({
          message: "Could not find Tv with id " + req.params._id
      });
  });
}

exports.update = (req,res) =>{
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
            cb(null, './uploads/tv');
          },
          filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
});
console.log(storage.getDestination.destination);
// return res.send(storage);
var upload = multer({
  storage: storage
}).any();

upload(req, res, async function(err) {
  if (err) {
      return res.end('Error');
  } else {
      const tg = new ThumbnailGenerator({
        sourcePath: req.files[0].path,
        thumbnailPath: './uploads/thumbnails/',
        tmpDir: './uploads/thumbnails'
      });
       
      tg.generateOneByPercentCb(90, (err, result) => {
        const imageData = req.files && req.files.length ? req.files[0].originalname :req.body.video;
        Tv.findByIdAndUpdate(req.params._id, {
            title:req.body.title,
            description:req.body.description,
            video:imageData,
            thumbnailPath:result
        }, {new: true})
        .then(tv => {
            if(!tv) {
                return res.status(404).send({
                    message: "Tv not found with id " + req.params._id
                });
            }
            return res.send(tv);
        });
      });
    
 
  }
})
}

exports.delete = async (req,res) => {

  Tv.findByIdAndRemove(req.params._id)
  .then(tv => {
      if(!tv) {
          return res.status(404).send({
              message: "Tv not found with id " + req.params._id
          });
      }
      return res.send({message: "Tv deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "Tv not found with id " + req.params._id
          });                
      }
      return res.status(500).send({
          message: "Could not delete Tv with id " + req.params._id
      });
  });
}

exports.list = async (req, res) => {

  try {
      const tv = await Tv.find();
      return res.status(200).json(({data:tv,msg:"Tv listed Successfully."}));
  } catch (error) {
      return res.status(400).send(error);
  }
}