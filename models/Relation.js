const mongoose = require('mongoose');

const RelationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        max:255
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

module.exports = mongoose.model('Relation',RelationSchema)