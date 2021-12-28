const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DailyPurificationsSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },    
    purification:{
        type: Schema.ObjectId,
        ref:'Purification',
    },
    type:{
        type: Schema.ObjectId,
        ref:  'PurificationsTypes',
    },
    options:{
        type:Object,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    date:{
        type:String,
        quired:true,
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


module.exports = mongoose.model('DailyPurifications',DailyPurificationsSchema)