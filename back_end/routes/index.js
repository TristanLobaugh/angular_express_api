var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://localhost:27017/landmarks";

var multer = require("multer");
var fs = require("fs");
var upload = multer({dest: "uploads/"});
var type = upload.single("uploadedImg");
var db;

MongoClient.connect(mongoUrl, function(error, database){
	db = database;
  console.log(db);
});

router.post("/uploads", type, function(req, res, next){
  var target_path = "../front-end/img/" + req.file.originalname;
  fs.readFile(req.file.path, function(error, imgData){
    fs.writeFile(target_path, imgData, function(error){
      if(error){
        // res.json("ERROR!!! There was an error: " + error);
        res.status(500).json("ERROR!!! There was an error: " + error);
      }else{
        // res.json("success");
        res.status(200).json("success");
        //INSERT db.collection("landmark").indertOne()  yada yada yada
      }
    });
  });
});

router.get("/get_image", function(req, res, next) {
  var currIP = req.ip;
	db.collection("users").find({ip: currIP}).toArray(function(error, userResult){
    var landmarksVotedOn = [];
    for(var i = 0; i < userResult.length; i++){
      landmarksVotedOn.push(userResult[i].image);
    }
    db.collection("landmark").find({imgSrc: {$nin: landmarksVotedOn}}).toArray(function(error, imagesToShow){
      if(imagesToShow.length === 0){
        console.log("************ZERO LEFT***********");
        // res.json("index", {changeTo: "/standings"});
        res.status(200).json("index", {changeTo: "/standings"});
      }else{
        var randomNum = Math.floor(Math.random() * imagesToShow.length);
        // res.json("index", {landmarkImage: imagesToShow[randomNum].imgSrc});
        res.status(200).json("index", {landmarkImage: imagesToShow[randomNum].imgSrc});
      }
    });
	});
});

router.get("/get_all_images", function(req, res, next){
  console.log("**Getting All Images**");
  db.collection("landmark").find().toArray(function(error, allImages){
    console.log(allImages);
    // res.json(allImages);
    res.status(200).json(allImages);
  });
});

router.post('/voted', function(req, res, next) {
  // console.log(req);
  db.collection("users").insertOne({
    ip: req.ip,
    vote: "voted",
    image: req.body.image
  });

  var guess = req.body.votes;
  db.collection("landmark").find({imgSrc: req.body.image}).toArray(function(error, dbResult){
  	if(dbResult[0].inusa === guess){
  		var correct = dbResult[0].voteCorrect + 1;
  		var incorrect = dbResult[0].voteWrong;
  		var message = 1;
  	}else{
  		var correct = dbResult[0].voteCorrect;
  		var incorrect = dbResult[0].voteWrong + 1;
  		var message = 0;
  	}
  		db.collection("landmark").updateOne(
  		{imgSrc: req.body.image},
  		{
  			$inc: {"totalVotes": 1},
  			$set: {"voteCorrect": correct, "voteWrong": incorrect}
  		});	
  		// res.json(message);
      res.status(200).json(message);
  });
});


module.exports = router;
