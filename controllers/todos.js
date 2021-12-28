const express = require('express')
const Todo = require("../models/Todo");
const jwt = require("jsonwebtoken");

exports.list = async (req, res) => {
    try {
        var authorization = req.header('auth-token');
        if (authorization) {
        var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
        var userId = decoded._id;
        }
        const todos = await Todo.find({ user_id:userId,});
        res.status(200).json(({data:todos,msg:"Todo listed Successfully."}));
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.create = async (req, res) => {
    var authorization = req.header('auth-token');
    if (authorization) {
    var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    var userId = decoded._id;
    }
    const todos = new Todo({
        title:req.body.title,
        description:req.body.description,
        user_id:userId,
    });


    try {
        const saveTodo = await todos.save();
        res.status(200).json(saveTodo);
    } catch (error) {
        res.status(400).send(error);
    }
}


exports.edit = (req,res) =>{

    Todo.findById(req.params._id)
    .then(todos => {
        if(!todos) {
            return res.status(404).send({
                message: "Todo not found with id " + req.params._id
            });
        }
        res.json(todos);
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Todo not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not find Todo with id " + req.params._id
        });
    });
}


exports.update = (req,res) =>{

    // Find note and update it with the request body
    Todo.findByIdAndUpdate(req.params._id, {
        title: req.body.title || false,
        description: req.body.description || false,
    }, {new: true})
    .then(todos => {
        if(!todos) {
            return res.status(404).send({
                message: "Todo not found with id " + req.params._id
            });
        }
        res.send(todos);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Todo not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Error updating Todo with id " + req.params._id
        });
    });
}



exports.delete = async (req,res) => {

    Todo.findByIdAndRemove(req.params._id)
    .then(todos => {
        if(!todos) {
            return res.status(404).send({
                message: "Todo not found with id " + req.params._id
            });
        }
        res.send({message: "Todo deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Todo not found with id " + req.params._id
            });                
        }
        return res.status(500).send({
            message: "Could not delete Todo with id " + req.params._id
        });
    });
  }