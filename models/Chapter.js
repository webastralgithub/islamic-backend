const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ChapterSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:4,
        max:255
    },
    description:{
        type:String,
        required:true,
        min:4,
    },
    book_id:{
        type:String,
        required:true,
    },
    books:{
        type: Schema.ObjectId,
        ref:'Book',
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

module.exports = mongoose.model('Chapter',ChapterSchema)