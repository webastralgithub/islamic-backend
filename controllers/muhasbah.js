const express = require('express');
const MoodModel = require("../models/Mood");
const DailyMoodModel = require("../models/DailyMood");
const MuhasbahActionModel = require("../models/MuhasbahAction");
const MuhasbahConflictModel = require("../models/MuhasbahConflict");
const jwt = require("jsonwebtoken");
const exp = require('constants');


exports.createMood = async (req, res) => {

    const moods =  new MoodModel({
        name:req.body.name,
    })


    try {
        const savemoods = await moods.save();
        res.status(200).json(savemoods);
        } catch (error) {
            res.status(400).send(error);
        }

}

exports.createDailyMood = async (req,res) => {

    const dailyMoods =  new DailyMoodModel({
        moods:req.body.moods,
        rating:req.body.rating,
        user_id:req.body.user_id,
        work:req.body.work,
        user_mood:req.body.user_mood,
        date:req.body.date,
    })
    // await DailyMoodModel.remove({});
    // return false;
    const Checkdata = await DailyMoodModel.find({user_id:req.body.user_id,date:req.body.date});
    if (Checkdata.length === 0) {
        try {
            console.log("if rating",req.body.rating);

            const savemoods = await dailyMoods.save();
            res.status(200).json(savemoods);
            } catch (error) {
                res.status(400).send(error);
            }
    }
    else{
        var Id= Checkdata[0]._id;
        try {
            var ratings = Checkdata[0].rating;
              req.body.rating = ratings.concat(req.body.rating);
          const dailyMood =  await DailyMoodModel.findByIdAndUpdate(Id, req.body, { new: true });
          return res.json({data:dailyMood,msg:"dailyMood updated successfully"});
       
      } catch (error) {
        return res.status(400).json(error);
      }
    }
  

}

exports.list = async(req,res) =>{
    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            const dailyMood = await DailyMoodModel.find({user_id:userId,date:req.params.date}).populate('moods').limit(1);
            const moodList = await MoodModel.find();
            if (dailyMood.length == 0) {
               const recentData =  await DailyMoodModel.find({user_id:userId}).populate('moods').sort( { date: -1 } ).limit(1);
               if (recentData.length == 0) {
                   const defaultData = [
                    {
                        "moods": [
                            {
                                "_id": "61403e0b7a55c6488b25b0f2",
                                "name": "Confident",
                                "created_at": "2021-09-14T06:15:39.434Z",
                                "updated_at": "2021-09-14T06:15:39.434Z",
                                "__v": 0
                            },
                            {
                                "_id": "61403b387a55c6488b25ade4",
                                "name": "Happy",
                                "created_at": "2021-09-14T06:03:36.954Z",
                                "updated_at": "2021-09-14T06:03:36.954Z",
                                "__v": 0
                            },
                            {
                                "_id": "61403b387a55c6488b25ade4",
                                "name": "Valuable",
                                "created_at": "2021-09-14T06:03:36.954Z",
                                "updated_at": "2021-09-14T06:03:36.954Z",
                                "__v": 0
                            }
                        ],
                        "_id": "6141829e88f0b641ab61e7c2",
                        "rating": 14,
                        "user_id": "61125c7d32945d177ef458b6",
                        "work": "Just Completed Project",
                        "user_mood": "In Control",
                        "date": "2021-09-15",
                        "created_at": "2021-09-15T05:20:30.399Z",
                        "updated_at": "2021-09-15T05:20:30.399Z",
                        "__v": 0
                    }
                ];
                return res.json({data:defaultData,moodList:moodList,msg:"dailyMood displayed successfully"});
               }
               return res.json({data:recentData,moodList:moodList,msg:"dailyMood displayed successfully"});
            } else{
                return res.json({data:dailyMood,moodList:moodList,msg:"dailyMood displayed successfully"});
            }
                
            // }
        } catch (e) {
          console.log(e);
            return res.status(401).json(e);
        }
      }
}

exports.moodList = async (req,res) => {
    try {
          const dailyMood = await MoodModel.find();
          return res.status(200).json(({data:dailyMood,msg:"Data listed Successfully."}));
    } catch (e) {
        return res.status(401).json(e);
    }
}

exports.createMyaction = async (req,res) => {

    const muhasbahAction =  new MuhasbahActionModel({
        mood_action:req.body.mood_action,
        mood_prosecutor:req.body.mood_prosecutor,
        mood_judge:req.body.mood_judge,
        rating:req.body.rating,
        user_id:req.body.user_id,
        work:req.body.work,
        user_mood:req.body.user_mood,
        date:req.body.date,
    })

    const Checkdata = await MuhasbahActionModel.find({user_id:req.body.user_id,date:req.body.date});
    if (Checkdata.length === 0) {
        try {
            const savemuhasbahAction = await muhasbahAction.save();
            res.status(200).json(savemuhasbahAction);
            } catch (error) {
                res.status(400).send(error);
            }
    }
    else{
        var Id= Checkdata[0]._id;
        try {
          const savemuhasbahAction =  await MuhasbahActionModel.findByIdAndUpdate(Id, req.body, { new: true });
          return res.json({data:savemuhasbahAction,msg:"dailyMood updated successfully"});
       
      } catch (error) {
        return res.status(400).json(error);
      }
    }
  

}

exports.createConflict = async (req,res) => {

    const muhasbahAction =  new MuhasbahConflictModel({
        myfeeling:req.body.myfeeling,
        allah_feeling:req.body.allah_feeling,
        // user_feeling:req.body.user_feeling,
        person_name:req.body.person_name,
        rating:req.body.rating,
        user_id:req.body.user_id,
        work:req.body.work,
        user_mood:req.body.user_mood,
        date:req.body.date,
    })

    const Checkdata = await MuhasbahConflictModel.find({user_id:req.body.user_id,date:req.body.date});
    if (Checkdata.length === 0) {
        try {
            const savemuhasbahAction = await muhasbahAction.save();
            res.status(200).json(savemuhasbahAction);
            } catch (error) {
                res.status(400).send(error);
            }
    }
    else{
        var Id= Checkdata[0]._id;
        try {
          const savemuhasbahAction =  await MuhasbahConflictModel.findByIdAndUpdate(Id, req.body, { new: true });
          return res.json({data:savemuhasbahAction,msg:"dailyMood updated successfully"});
       
      } catch (error) {
        return res.status(400).json(error);
      }
    }

}

exports.actionlist = async(req,res) =>{
    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            const dailyMood = await MuhasbahActionModel.find({user_id:userId,date:req.params.date}).populate('mood_action').populate('mood_prosecutor').populate('mood_judge').limit(1);
            const moodList = await MoodModel.find();
            if (dailyMood.length == 0) {
               const recentData =  await MuhasbahActionModel.find({user_id:userId}).populate('mood_action').populate('mood_prosecutor').populate('mood_judge').sort( { date: -1 } ).limit(1);
               if (recentData.length == 0) {
                   const defaultData = [
                    {
                        "data": [
                            {
                                "mood_action": [
                                    {
                                        "_id": "61403e0b7a55c6488b25b0f2",
                                        "name": "Confident",
                                        "created_at": "2021-09-14T06:15:39.434Z",
                                        "updated_at": "2021-09-14T06:15:39.434Z",
                                        "__v": 0
                                    },
                                    {
                                        "_id": "61403b387a55c6488b25ade4",
                                        "name": "Happy",
                                        "created_at": "2021-09-14T06:03:36.954Z",
                                        "updated_at": "2021-09-14T06:03:36.954Z",
                                        "__v": 0
                                    }
                                ],
                                "mood_prosecutor": [
                                    {
                                        "_id": "61403e0b7a55c6488b25b0f2",
                                        "name": "Confident",
                                        "created_at": "2021-09-14T06:15:39.434Z",
                                        "updated_at": "2021-09-14T06:15:39.434Z",
                                        "__v": 0
                                    },
                                    {
                                        "_id": "61403b387a55c6488b25ade4",
                                        "name": "Happy",
                                        "created_at": "2021-09-14T06:03:36.954Z",
                                        "updated_at": "2021-09-14T06:03:36.954Z",
                                        "__v": 0
                                    }
                                ],
                                "mood_judge": [
                                    {
                                        "_id": "61403e0b7a55c6488b25b0f2",
                                        "name": "Confident",
                                        "created_at": "2021-09-14T06:15:39.434Z",
                                        "updated_at": "2021-09-14T06:15:39.434Z",
                                        "__v": 0
                                    },
                                    {
                                        "_id": "61403b387a55c6488b25ade4",
                                        "name": "Happy",
                                        "created_at": "2021-09-14T06:03:36.954Z",
                                        "updated_at": "2021-09-14T06:03:36.954Z",
                                        "__v": 0
                                    }
                                ],
                                "_id": "6140a6ed3d1be4739cecbe9f",
                                "rating": 14,
                                "user_id": "61125c7d32945d177ef458b6",
                                "date": "2021-09-14",
                                "created_at": "2021-09-14T13:43:09.468Z",
                                "updated_at": "2021-09-14T13:43:09.468Z",
                                "__v": 0
                            }
                        ]
                    }
                ];
                return res.json({data:defaultData,moodList:moodList,msg:"dailyMood displayed successfully"});
               }
               return res.json({data:recentData,moodList:moodList,msg:"dailyMood displayed successfully"});
            } else{
                return res.json({data:dailyMood,moodList:moodList,msg:"dailyMood displayed successfully"});
            }
                
            // }
        } catch (e) {
          console.log(e);
            return res.status(401).json(e);
        }
      }
}


exports.conflictlist = async(req,res) =>{
    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
            const dailyMood = await MuhasbahConflictModel.find({user_id:userId,date:req.params.date}).populate('myfeeling').populate('allah_feeling').limit(1);
            // const dailyMood = await MuhasbahConflictModel.find({user_id:userId,date:req.params.date}).populate('myfeeling').populate('allah_feeling').populate('user_feeling').limit(1);
            const moodList = await MoodModel.find();
            if (dailyMood.length == 0) {
                const recentData =  await MuhasbahConflictModel.find({user_id:userId}).populate('myfeeling').populate('allah_feeling').sort( { date: -1 } ).limit(1);
                // const recentData =  await MuhasbahConflictModel.find({user_id:userId}).populate('myfeeling').populate('allah_feeling').populate('user_feeling').sort( { date: -1 } ).limit(1);
               if (recentData.length == 0) {
                   const defaultData = [
                    {
                        "data": [
                            {
                                "myfeeling": [
                                    {
                                        "_id": "61403e0b7a55c6488b25b0f2",
                                        "name": "Confident",
                                        "created_at": "2021-09-14T06:15:39.434Z",
                                        "updated_at": "2021-09-14T06:15:39.434Z",
                                        "__v": 0
                                    },
                                    {
                                        "_id": "61403b387a55c6488b25ade4",
                                        "name": "Happy",
                                        "created_at": "2021-09-14T06:03:36.954Z",
                                        "updated_at": "2021-09-14T06:03:36.954Z",
                                        "__v": 0
                                    }
                                ],
                                "allah_feeling": [
                                    {
                                        "_id": "61403e0b7a55c6488b25b0f2",
                                        "name": "Helpful",
                                        "created_at": "2021-09-14T06:15:39.434Z",
                                        "updated_at": "2021-09-14T06:15:39.434Z",
                                        "__v": 0
                                    },
                                    {
                                        "_id": "61403b387a55c6488b25ade4",
                                        "name": "Joy",
                                        "created_at": "2021-09-14T06:03:36.954Z",
                                        "updated_at": "2021-09-14T06:03:36.954Z",
                                        "__v": 0
                                    }
                                ],
                                "user_feeling": [
                                    {
                                        "_id": "61403e0b7a55c6488b25b0f2",
                                        "name": "Anger",
                                        "created_at": "2021-09-14T06:15:39.434Z",
                                        "updated_at": "2021-09-14T06:15:39.434Z",
                                        "__v": 0
                                    },
                                    {
                                        "_id": "61403b387a55c6488b25ade4",
                                        "name": "Sad",
                                        "created_at": "2021-09-14T06:03:36.954Z",
                                        "updated_at": "2021-09-14T06:03:36.954Z",
                                        "__v": 0
                                    }
                                ],
                                "_id": "6140a8b40c28421940e9124d",
                                "rating": 14,
                                "user_id": "61125c7d32945d177ef458b6",
                                "date": "2021-09-14",
                                "created_at": "2021-09-14T13:50:44.225Z",
                                "updated_at": "2021-09-14T13:50:44.225Z",
                                "__v": 0
                            }
                        ]
                    }
                ];
                return res.json({data:defaultData,moodList:moodList,msg:"dailyMood displayed successfully"});
               }
               return res.json({data:recentData,moodList:moodList,msg:"dailyMood displayed successfully"});
            } else{
                return res.json({data:dailyMood,moodList:moodList,msg:"dailyMood displayed successfully"});
            }
                
            // }
        } catch (e) {
          console.log(e);
            return res.status(401).json(e);
        }
      }
}

exports.moodGraph = async(req,res) => {
    var authorization = req.header('auth-token');
    if (authorization) {
        try {
            var decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
            var userId = decoded._id;
    const graphData = await DailyMoodModel.find().populate('moods').sort( { date: -1 } );
    console.log(userId);
    return res.status(200).json(graphData)
        
    } catch (error) {
        return res.status(400).json(error)
    }
 }
}