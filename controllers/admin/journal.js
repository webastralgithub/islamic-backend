const express = require('express')
const Journal = require("../../models/Journal");
const { journalValidation } = require("../../validation");


exports.journal = async (req, res) => {

    try {
        const JournalList = await Journal.find();
        res.status(200).json(({data:JournalList,msg:"Journal listed Successfully."}));
    } catch (error) {
        res.status(400).send(error);
    }
 
     
};

exports.create = async (req, res) => {

    const { error } = journalValidation(req.body);
    console.log(error);

    if (error) return res.status(400).json({error:error.details[0].message});

    const journal = new Journal({
        title:req.body.title,
        description:req.body.description
    });


    try {
        const savejournal = await journal.save();
        res.status(200).json(savejournal);
    } catch (error) {
        res.status(400).send(error);
    }
     
};

exports.editJournal = (req,res) =>{

    Journal.findById(req.params._id)
    .then(journal => {
        if(!journal) {
            return res.status(404).send({
                message: "journal not found with id " + req.params._id
            });
        }
        res.json(journal);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "journal not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find journal with id " + req.params._id
        });
    });
}


exports.updateJournal = (req,res) =>{

    // Find note and update it with the request body
    Journal.findByIdAndUpdate(req.params._id, {
        title: req.body.title || false,
        description: req.body.description || false,
    }, {new: true})
    .then(journal => {
        if(!journal) {
            return res.status(404).send({
                message: "journal not found with id " + req.params._id
            });
        }
        res.send(journal);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "journal not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating journal with id " + req.params._id
        });
    });
}



exports.deleteJournal = async (req,res) => {

    Journal.findByIdAndRemove(req.params._id)
    .then(journal => {
        if(!journal) {
            return res.status(404).send({
                message: "journal not found with id " + req.params._id
            });
        }
        res.send({message: "journal deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "journal not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete journal with id " + req.params._id
        });
    });
  }