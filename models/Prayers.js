const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const PrayerSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    type:{
        type: Schema.ObjectId,
        ref:  'PurificationsTypes',
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

module.exports = mongoose.model('Prayer',PrayerSchema)