const mongoose = require('mongoose');

const ActivityCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    color:{
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

module.exports = mongoose.model('ActivityCategory',ActivityCategorySchema)