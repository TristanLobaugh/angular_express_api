var voteApp = angular.module("voteApp", ["ngRoute"]);

voteApp.config(function($routeProvider){
	$routeProvider.when("/", {
		templateUrl: "pages/main.html",
		controller: "voteController"
	});
	$routeProvider.when("/standings", {
		templateUrl: "pages/standings.html",
		controller: "standingsController"
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
});

voteApp.controller("voteController", function($scope, $http, $location){
	getImage();
	var apiUrl = "http://localhost:3030/voted";

	$scope.vote = function(val){
		var apiUrl = "http://localhost:3030/voted";
		$http.post(apiUrl, {"votes": val, image: $scope.image})
		.then(function successCallback(response){
		$scope.data = response.data;

	  }, function errorCallback(response){
	  	$scope.result = "ERROR!!! " + response.status;
	  });
	  getImage();	
	}

	function getImage(){
		var apiUrl = "http://localhost:3030/get_image";
		$http.get(apiUrl)
		.then(function successCallback(response){
			if(response.data.changeTo === "/standings"){
				$location.path("/standings");
			}else{
				$scope.image = response.data.landmarkImage;
			}
	  }, function errorCallback(response){
	  	$scope.result = "ERROR!!! " + response.status;

	  });	
	}
});

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


//END CONTROLLER
});
