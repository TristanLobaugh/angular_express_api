var express = require('express');
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var mongoUrl = "mongodb://localhost:27017/landmarks";

var db;

MongoClient.connect(mongoUrl, function(error, database){
	db = database;
});

router.get('/get_image', function(req, res, next) {
	db.collection("landmark").find().toArray(function(error, queryResult){
		res.json(queryResult);
	});
});

router.post('/voted', function(req, res, next) {
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
  		
  		res.json(message);

  });
});


//   var dcClass = [
//   	"Tristan",
//   	"Josh",
//   	"Bogdan",
//   	"Will",
//   	"Kieth"
//   ];

//   if(dcClass.indexOf(name) > -1){
//   	res.json({message: "Hello, " + name + " student in class."});
//   }else{
//   res.json({message: "You are not in the class."});
// 	}
// });

module.exports = router;
