const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ManualPrayerSchema = new mongoose.Schema({
    title:{
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

module.exports = mongoose.model('ManualPrayer',ManualPrayerSchema)