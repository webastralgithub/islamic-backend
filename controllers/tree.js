const express = require('express');
const TreeModel = require("../models/Tree");
const RelationModel = require("../models/Relation");
const jwt = require("jsonwebtoken");
const exp = require('constants');
const path = require("path")
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());  

exports.createRelation = async(req,res) => {

    const relation = new RelationModel({
        name:req.body.name,
    });

    try {
        const saveRelation =  await relation.save();
        return res.status(200).json(saveRelation);
        
    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.relationList = async(req,res) => {

    try {
        const list =  await RelationModel.find()
        return res.status(200).json(list);
        
    } catch (error) {
        return res.status(400).json(error);
    }
}


exports.addFamilyMember = async(req,res) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
                  cb(null, './uploads/familyTree');
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
            const addMember = new TreeModel({
                name:req.body.name,
                relation:req.body.relation,
                childrens:req.body.childrens,
                user_id:req.body.user_id,
                spouse:req.body.spouse,
                order:req.body.order,
                family_type:req.body.family_type,
                image:req.files[0].originalname,
            });
            try {

                const CheckData = await TreeModel.find({_id:req.body._id});
                if (CheckData.length === 0) {
                  const saveMember = await addMember.save();
                  return res.status(200).json({data:saveMember})
                } else {
                  const updatedMember =  await TreeModel.findByIdAndUpdate(req.params._id, req.body, { new: true });
                  return res.json({data:activityCategory,msg:"Member updated successfully"});
                }
              
            } catch (error) {
              return res.status(400).json(error)
                
            }
       
        }
      }); 
    


}

exports.memberList = async(req,res) =>{
    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            // await TreeModel.remove({})
       const list = await TreeModel.find({}).populate('relation');
       return res.status(200).json(list) 
    } catch (error) {
        return res.status(400).json(error) 
    }
}
}