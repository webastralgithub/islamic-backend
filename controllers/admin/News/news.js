const express = require('express')
const News = require("../../../models/News.js");
const path = require("path")
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  

exports.create = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
                  cb(null, './uploads/news');
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
                const news = new News({
                    title:req.body.title,
                    description:req.body.description,
                    image:req.files[0].originalname,
                });
                try {
                    const saveNews = await news.save();
                    return res.status(200).json({data:saveNews,msg:"News created successfully."});
                } catch (error) {
                    return res.status(400).send(error);
                }
       
        }
      }); 
}


exports.edit = (req,res) =>{

  News.findById(req.params._id)
  .then(news => {
      if(!news) {
          return res.status(404).send({
              message: "News not found with id " + req.params._id
          });
      }
      return res.json(news);
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "News not found with id " + req.params._id
          });                
      }
      return res.status(500).send({
          message: "Could not find News with id " + req.params._id
      });
  });
}

exports.update = (req,res) =>{
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
            cb(null, './uploads/news');
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
      const imageData = req.files && req.files.length ? req.files[0].originalname :req.body.image;
          News.findByIdAndUpdate(req.params._id, {
              title:req.body.title,
              description:req.body.description,
              image:imageData
          }, {new: true})
          .then(news => {
              if(!news) {
                  return res.status(404).send({
                      message: "News not found with id " + req.params._id
                  });
              }
              return res.send(news);
          });
 
  }
})
}

exports.delete = async (req,res) => {

  News.findByIdAndRemove(req.params._id)
  .then(news => {
      if(!news) {
          return res.status(404).send({
              message: "News not found with id " + req.params._id
          });
      }
      return res.send({message: "News deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "News not found with id " + req.params._id
          });                
      }
      return res.status(500).send({
          message: "Could not delete News with id " + req.params._id
      });
  });
}

exports.list = async (req, res) => {

  try {
      const news = await News.find();
      return res.status(200).json(({data:news,msg:"News listed Successfully."}));
  } catch (error) {
      return res.status(400).send(error);
  }
}