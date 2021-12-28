const express = require('express')
const Chapter = require("../../../models/Chapter.js");
const path = require("path")
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  


exports.create = async (req, res) => {
    const chapter = new Chapter({
        title:req.body.title,
        description:req.body.description,
        book_id:req.body.book_id,
        books:req.body.books
    });
    try {
        const savechapter = await chapter.save();
        return res.status(200).json({savechapter:savechapter,msg:"Chapter created successfully."});
    } catch (error) {
        return res.status(400).send(error);
    }
}

exports.list = async (req, res) => {

    Chapter.
    find({book_id:req.params.book_id}).
    populate('books').
    exec(function (err, chapter) {
        if (err) return handleError(err);
        return res.status(200).json(({data:chapter,msg:"chapter listed Successfully."}));
    });
}


exports.delete = async (req,res) => {

    Chapter.findByIdAndRemove(req.params._id)
    .then(chapter => {
        if(!chapter) {
            return res.status(404).send({
                message: "chapter not found with id " + req.params._id
            });
        }
        return res.send({message: "chapter deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "chapter not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete chapter with id " + req.params._id
        });
    });
  }

  exports.edit = (req,res) =>{

    Chapter.findById(req.params._id)
    .then(chapter => {
        if(!chapter) {
            return res.status(404).send({
                message: "chapter not found with id " + req.params._id
            });
        }
        return res.json(chapter);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "chapter not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find chapter with id " + req.params._id
        });
    });
}

exports.update = (req,res) =>{
    Chapter.findByIdAndUpdate(req.params._id, {
        title:req.body.title,
        description:req.body.description,
        book_id:req.body.book_id,
        books:req.body.books
    }, {new: true})
    .then(chapter => {
        if(!chapter) {
            return res.status(404).send({
                message: "chapter not found with id " + req.params._id
            });
        }
        return res.status(200).json({data:chapter,msg:'Chapter Updated Successfully'});
    });
}