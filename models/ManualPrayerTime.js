const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ManualPrayerTimeSchema = new mongoose.Schema({
   
    type1:{
       type:{
        type: Schema.ObjectId,
        ref:  'ManualPrayer',
       },
        begins_time:{
            type:String,
            required:true,
        },
        jamah_time:{
            type:String,
            required:true,
        },
        alarm_time:{
            type:String,
            required:true,
        },
        prayerTime:{
            type:String,
            required:true,
         },
         set_alarm:{
             type: Boolean,
             required: true
         }
    },
    type2:{
        type:{
         type: Schema.ObjectId,
         ref:  'ManualPrayer',
        },
         begins_time:{
             type:String,
             required:true,
         },
         jamah_time:{
             type:String,
             required:true,
         },
         alarm_time:{
             type:String,
             required:true,
         },
         prayerTime:{
            type:String,
            required:true,
         },
         set_alarm:{
            type: Boolean,
            required: true
        }
     },
     type3:{
        type:{
         type: Schema.ObjectId,
         ref:  'ManualPrayer',
        },
         begins_time:{
             type:String,
             required:true,
         },
         jamah_time:{
             type:String,
             required:true,
         },
         alarm_time:{
             type:String,
             required:true,
         },
         prayerTime:{
            type:String,
            required:true,
         },
         set_alarm:{
            type: Boolean,
            required: true
        }
     },
     type4:{
        type:{
         type: Schema.ObjectId,
         ref:  'ManualPrayer',
        },
         begins_time:{
             type:String,
             required:true,
         },
         jamah_time:{
             type:String,
             required:true,
         },
         alarm_time:{
             type:String,
             required:true,
         },
         prayerTime:{
            type:String,
            required:true,
         },
         set_alarm:{
            type: Boolean,
            required: true
        }
     },
     type5:{
        type:{
         type: Schema.ObjectId,
         ref:  'ManualPrayer',
        },
         begins_time:{
             type:String,
             required:true,
         },
         jamah_time:{
             type:String,
             required:true,
         },
         alarm_time:{
             type:String,
             required:true,
         },
         prayerTime:{
            type:String,
            required:true,
         },
         set_alarm:{
            type: Boolean,
            required: true
        }
     },
     type6:{
        type:{
         type: Schema.ObjectId,
         ref:  'ManualPrayer',
        },
         begins_time:{
             type:String,
             required:true,
         },
         jamah_time:{
             type:String,
             required:true,
         },
         alarm_time:{
             type:String,
             required:true,
         },
         prayerTime:{
            type:String,
            required:true,
         },
         set_alarm:{
            type: Boolean,
            required: true
        }
     },
    user_id:{
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

module.exports = mongoose.model('ManualPrayerTime',ManualPrayerTimeSchema)