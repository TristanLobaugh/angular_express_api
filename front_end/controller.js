var searchApp = angular.module("searchApp", []);

searchApp.controller("searchController", function($scope, $http){
	getImage();
	var apiUrl = "http://localhost:3030/voted";

	$scope.vote = function(val){
		var apiUrl = "http://localhost:3030/voted";
		$http.post(apiUrl, {"votes": val, image: $scope.image})
		.then(function successCallback(response){
		$scope.data = response.data;
		// console.log(response.data);

	  }, function errorCallback(response){
	  	$scope.result = "ERROR!!! " + response.status;
	  });
	  getImage();	
	}

	function getImage(){
		var apiUrl = "http://localhost:3030/get_image";
		$http.get(apiUrl)
		.then(function successCallback(response){
			// console.log(response.data);
		$scope.image = response.data.landmarkImage;
	  }, function errorCallback(response){
	  	$scope.result = "ERROR!!! " + response.status;

	  });	
	}


	// 	$http({
	// 			method: "GET",
	// 			url: apiUrl
	// 		}).then(
	// 		function successCallback(response){
	// 		$scope.studentsOnLoad = response.data;
	// 		console.log($scope.studentsOnLoad)
	// 	  }, function errorCallback(response){
	// 	  	$scope.result = "ERROR!!! " + response.status;
	// 	  });	

	// $scope.search = function(){
	// 	var apiUrl = "http://localhost:3000/search";
	// 	$http.post(apiUrl, {"name": $scope.who})
	// 	.then(function successCallback(response){
	// 		$scope.data = response.data;

	// 	  }, function errorCallback(response){
	// 	  	$scope.result = "ERROR!!! " + response.status;

	// 	  });	
	// }
});