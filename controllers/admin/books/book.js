const express = require('express')
const Books = require("../../../models/Books.js");
const path = require("path")
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  

exports.list = async (req, res) => {

    try {
        const books = await Books.find();
        return res.status(200).json(({data:books,msg:"books listed Successfully."}));
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.create = async (req, res) => {
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
              cb(null, './uploads/books');
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
            const books = new Books({
                title:req.body.title,
                description:req.body.description,
                author:req.body.author,
                image:req.files[0].originalname,
            });
            try {
                const savebooks = await books.save();
                return res.status(200).json({msg:"book created successfully."});
            } catch (error) {
                return res.status(400).send(error);
            }
   
    }
  }); 
}

exports.edit = (req,res) =>{

    Books.findById(req.params._id)
    .then(books => {
        if(!books) {
            return res.status(404).send({
                message: "books not found with id " + req.params._id
            });
        }
        return res.json(books);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "books not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find books with id " + req.params._id
        });
    });
}

exports.update = (req,res) =>{
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
              cb(null, './uploads/books');
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
            Books.findByIdAndUpdate(req.params._id, {
                title:req.body.title,
                description:req.body.description,
                author:req.body.author,
                image:imageData
            }, {new: true})
            .then(books => {
                if(!books) {
                    return res.status(404).send({
                        message: "book not found with id " + req.params._id
                    });
                }
                return res.send(books);
            });
   
    }
})
}

exports.delete = async (req,res) => {

    Books.findByIdAndRemove(req.params._id)
    .then(books => {
        if(!books) {
            return res.status(404).send({
                message: "book not found with id " + req.params._id
            });
        }
        return res.send({message: "book deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "book not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete book with id " + req.params._id
        });
    });
  }