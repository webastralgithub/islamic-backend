const express = require('express')
const Blog = require("../../../models/Blog.js");
const path = require("path")
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  


exports.create = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
                  cb(null, './uploads/blogs');
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
                const blogs = new Blog({
                    title:req.body.title,
                    description:req.body.description,
                    image:req.files[0].originalname,
                });
                try {
                    const saveblogs = await blogs.save();
                    return res.status(200).json({data:saveblogs,msg:"blog created successfully."});
                } catch (error) {
                    return res.status(400).send(error);
                }
       
        }
      }); 
}


exports.edit = (req,res) =>{

  Blog.findById(req.params._id)
  .then(blogs => {
      if(!blogs) {
          return res.status(404).send({
              message: "blogs not found with id " + req.params._id
          });
      }
      return res.json(blogs);
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "blogs not found with id " + req.params._id
          });                
      }
      return res.status(500).send({
          message: "Could not find blogs with id " + req.params._id
      });
  });
}

exports.update = (req,res) =>{
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
            cb(null, './uploads/blogs');
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
          Blog.findByIdAndUpdate(req.params._id, {
              title:req.body.title,
              description:req.body.description,
              author:req.body.author,
              image:imageData
          }, {new: true})
          .then(blogs => {
              if(!blogs) {
                  return res.status(404).send({
                      message: "blog not found with id " + req.params._id
                  });
              }
              return res.send(blogs);
          });
 
  }
})
}

exports.delete = async (req,res) => {

  Blog.findByIdAndRemove(req.params._id)
  .then(blogs => {
      if(!blogs) {
          return res.status(404).send({
              message: "blog not found with id " + req.params._id
          });
      }
      return res.send({message: "blog deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "blog not found with id " + req.params._id
          });                
      }
      return res.status(500).send({
          message: "Could not delete blog with id " + req.params._id
      });
  });
}

exports.list = async (req, res) => {

  try {
      const blogs = await Blog.find();
      return res.status(200).json(({data:blogs,msg:"blogs listed Successfully."}));
  } catch (error) {
      return res.status(400).send(error);
  }
}