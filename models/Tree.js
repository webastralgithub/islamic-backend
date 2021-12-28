const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const TreeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    relation:{
        type: Schema.ObjectId,
        ref:'Relation',
    },
    childrens:[{
        type:String,
        required:true,
    }],
    spouse:{
        type:String,
        required:true,
    },
    family_type:{
        type:Number,
        required:true,
    },
    order:{
        type:Number,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    created_at:{
        type:Date,
       default:Date.now
    },
    updated_at:{
        type:Date,
       default:Date.now
    },
});

module.exports = mongoose.model('Tree',TreeSchema)