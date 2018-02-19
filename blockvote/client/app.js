'use strict';

var app = angular.module('votingApp', []);

// Angular Controller
app.controller('appController', function($scope, appFactory) {
	$scope.checkVotes = function() {
		appFactory.checkVotes(function(data) {
			var array = [];

			for(var i = 0; i < data.length; i++) {
				parseInt(data[i].Key);

				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}

			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});

			$scope.all_tuna = array;
		});
	}

	$scope.castVote = function() {
		$("#poll").hide();
		console.log("Vote has been casted");
	}
});

// Angular Factory
app.factory('appFactory', function($http) {

	var factory = {};

  factory.checkVotes = function(callback) {
    $http.get('/check_votes/').success(function(output){
		callback(output)
		});
	}

	factory.castVote = function(callback) {
		$http.get('/cast_vote').success(function(output) {
			callback(output)
		});
	}

	return factory;
});
