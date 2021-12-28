const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const DailyIbadahTypesSchema = new mongoose.Schema({
    name:{
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

module.exports = mongoose.model('DailyIbadahTypes',DailyIbadahTypesSchema)