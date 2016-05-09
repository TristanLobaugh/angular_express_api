# Landmarks of the USA

### Uses Express, NodeJS, Mogodb for backend server API and AngularJS, CSS and HTML to create a frontend web app.

## Summary

#### Voting app that allows the user to vote on weather or not they think the image shown is located in the USA or not. The info gets pulled by the Angular controller that makes a request to the Expess/Nodejs (backend) sever that makes a query to a Mongodb database. The response is then sent back to the frontend where the Angular controller takes the data and then places into the view. Once the user votes the vote is stored in the datebase and if the user has voted on all items in the datebase they are taken to a standing page via Angular Routes and shown the results of all images and votes.

### Author: Tristan Lobaugh 
+ Github - https://github.com/TristanLobaugh
+ Homepage - http://tristanlobaugh.com

## Demo

[Live Demo](http://tristanlobaugh.com/Landmarks)

## Screenshots

### Standings page:
![alt text](https://raw.githubusercontent.com/TristanLobaugh/angular_express_api/master/front_end/img/screen_shot.png)

##Code Examples

### Backend router.get that makes a query to the database for images that haven't been voted on yet
```
router.get("/get_image", function(req, res, next) {
  var currIP = req.ip;
	db.collection("users").find({ip: currIP}).toArray(function(error, userResult){
    var landmarksVotedOn = [];
    for(var i = 0; i < userResult.length; i++){
      landmarksVotedOn.push(userResult[i].image);
    }
    db.collection("landmark").find({imgSrc: {$nin: landmarksVotedOn}}).toArray(function(error, imagesToShow){
      if(imagesToShow.length === 0){
        res.json("index", {changeTo: "/standings"});
      }else{
        var randomNum = Math.floor(Math.random() * imagesToShow.length);
        res.json("index", {landmarkImage: imagesToShow[randomNum].imgSrc});
      }
    });
	});
});
```

### Angular controller for the standing page. Make request to the backend server for all the images and their information.
```
voteApp.controller("standingsController", function($scope, $http){
	getAllImages();

	function getAllImages(){
		var apiUrl = "http://localhost:3030/get_all_images";
		$http.get(apiUrl).then(function successCallback(response){
			var allImagesArray = response.data;
			allImagesArray.sort(function(a, b){
				return b.totalVotes - a.totalVotes;
			});
			$scope.allImages = allImagesArray;
		}, function errorCallback(response){
			console.log("ERROR");
		  	$scope.result = "ERROR!!! " + response.status;
		  });
		}
```

## To Do
