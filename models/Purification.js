const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const PurificationSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type: Schema.ObjectId,
        ref:  'PurificationsTypes',
    },
    icons:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    order:{
        type:Number,
        required:true,
    },
    default_options:{
        type:Object,
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

module.exports = mongoose.model('Purification',PurificationSchema)