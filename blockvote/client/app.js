'use strict';

var app = angular.module('votingApp', []);

app.controller('appController', function($scope, appFactory) {

	$("#success_create").hide();

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

			$scope.votes = array;
		});
	}

	$scope.vote = {
									CandidateID: "Null",
									PartyID: "Null"
								};

	$scope.candidates = [{
												CandidateID: "1",
												PartyID: "1"
											},

											{
												CandidateID: "2",
												PartyID: "2"
											}];

	$scope.castVote = function() {
		appFactory.castVote(function() {
			$("#poll").hide();
			$("#success_create").show();
		});
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

	factory.castVote = function(data, callback) {
		$http.get('/cast_vote/').success(function(output){
			callback(output)
		});
	}

	return factory;
});
