const express = require('express')
const Purification = require("../models/Purification");
const PurificationsTypes = require("../models/PurificationsTypes");
const DailyPurification = require("../models/DailyPurifications");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
    const purification = new DailyPurification({
      user_id:req.body.user_id,
      purification:req.body.purification,
      type:req.body.type,
      options:req.body.options,
      rating:req.body.rating,
      date:req.body.date,
      order:req.body.order
    });

    var startOfToday = new Date();
      startOfToday.setHours(0,0,0,0);
      const Checkdata = await DailyPurification.find({user_id:req.body.user_id,date:req.body.date,type:req.body.type,purification:req.body.purification });
      
       if(Checkdata.length === 0){
         try {
        const savePurification = await purification.save();
        return res.status(200).json(savePurification);
        } catch (error) {
          return res.status(400).send(error);
        }
      }
      else{
        var Id= Checkdata[0]._id;
        try {
          const purification =  await DailyPurification.findByIdAndUpdate(Id, req.body, { new: true });
          return res.json({data:purification,msg:"purification updated successfully"});
       
      } catch (error) {
        return res.status(400).json(error);
      }
      }
}

exports.list = async (req, res) => {
  var authorization = req.header('auth-token');
  if (authorization) {
      try {
          var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
          var userId = decoded._id;
          const PurificationListData = await Purification.find({type:req.params.type});
          await DailyPurification.find({type:req.params.type,date:req.params.date}).populate({
            path: 'purifications',
           // match: { date:req.params.date,user_id:userId }
        }).exec(function (err, data) {
              if (err) return handleError(err);
             return res.status(200).json(({data:data,PurificationList:PurificationListData,msg:"Data listed Successfully."}));
          });
                   
      } catch (e) {
        console.log(e);
          return res.status(401).json(e);
      }
    }

}

exports.view = async (req,res) => {

  try {

    var authorization = req.header('auth-token');
    var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    var userId = decoded._id;
    const purification = await DailyPurification.find({ purification: req.params._id,user_id:userId,date:req.params.date});
    if(purification.length === 0){

      const purificationlist = await DailyPurification.find({ purification: req.params._id,user_id:userId}).sort({'date': -1}).limit(1);
      // purificationlist.length == 0 ? await Purification.find({_id:req.params._id}):purificationlist;
      return res.status(200).json(({data: purificationlist.length == 0 ? await Purification.find({_id:req.params._id}):purificationlist,msg:"purification data Successfully."}));
    }
    return res.status(200).json(({data:purification,msg:"purification data Successfully."}));
  } catch (error) {
     return res.status(400).json(error);
  }
    
}

exports.dashboard = async(req,res) => {

  var authorization = req.header('auth-token');
 
  if (authorization) {
    var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    var userId = decoded._id;
    try {
      const docs = await DailyPurification.aggregate(
        [
        
        { $match : {date:req.body.date,user_id:userId} },
        
           { $group: {
              "_id": "$type",
             totalRatings: { $sum: "$rating", },
             count: { $sum: 1 },
            }
          }
        ]
      
        );

    // const allType = await PurificationsTypes.find();
    const allType = await PurificationsTypes.aggregate([
      { "$lookup": {
        "from": "purifications",
        "let": { "id": "$_id" },
        "pipeline": [
          { "$match": { "$expr": { "$eq": ["$type", "$$id"] }}},
          { "$count": "count" }
        ],
        "as": "count"
      }},
      {
        $sort: {
          "order": 1
        }},
      { "$project": {
        "name": 1,
        "type":1,
        "order":1,
        "icons":1,
        "info":1,
        "numberOfSegments": { "$arrayElemAt": ["$count.count", 0] }
      }},
      // {"$sort": {"type.order": -1}},
    ])

        return res.json({types:allType,data:docs,msg:"dashboard data displayed."});
  } catch (error) {
    return res.status(400).json(error);
  }
    }
    

}

exports.dashboardRange = async(req,res) => {
var authorization = req.header('auth-token');
if (authorization) {
  var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
  var userId = decoded._id;
}
try {
  const data = await DailyPurification.aggregate([
    { $match: { "date":
    {
        "$lte": req.body.endDate,
        "$gte": req.body.startDate,
    }, "user_id":userId } },
    { $group: {
      "_id": "$type",
    totalRating: { $sum: "$rating", },
                 count: { $sum: 1 },
    }
  }
  ]);
  const allType = await PurificationsTypes.aggregate([
    { "$lookup": {
      "from": "purifications",
      "let": { "id": "$_id" },
      "pipeline": [
        { "$match": { "$expr": { "$eq": ["$type", "$$id"] }}},
        { "$count": "count" }
      ],
      "as": "count"
    }},
    { "$project": {
      "name": 1,
      "type":1,
      "numberOfSegments": { "$arrayElemAt": ["$count.count", 0] }
    }}
  ])

  return res.json({data:data,msg:"dashboard data displayed."});
} catch (error) {
  return res.status(400).json(error);
}
}

exports.Typecreate = async (req,res) => {
  const purificationType = new PurificationsTypes({
    name:req.body.name,
    dummy_options:req.body.dummy_options
});

try {
  const savePurification = await purificationType.save();
  res.status(200).json(savePurification);
  } catch (error) {
      res.status(400).send(error);
  }
}

exports.createPurification = async (req,res) => {
  const purification = new Purification({
    title:req.body.title,
    default_options:req.body.default_options,
    type:req.body.type,
    color:req.body.color,
    icons:req.body.icons,
    order:req.body.order

});

try {
  const savePurification = await purification.save();
  res.status(200).json(savePurification);
  } catch (error) {
      res.status(400).send(error);
  }
}

exports.updateType = async (req,res) =>{
  try {
    const purification =  await PurificationsTypes.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.json({data:purification,msg:"purification type updated successfully"});
 
} catch (error) {
  return res.status(400).json(error);
}
}

exports.updatePurification = async (req,res) =>{
  try {
    const purification =  await Purification.findByIdAndUpdate(req.params._id, req.body, { new: true });
    return res.json({data:purification,msg:"purification updated successfully"});
 
} catch (error) {
  return res.status(400).json(error);
}
}