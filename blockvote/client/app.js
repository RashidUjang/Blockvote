'use strict';

var app = angular.module('votingApp', []);

app.controller('appController', function($scope, appFactory) {
	// Hiding the success messages for transaction confirmation
	$("#success_create").hide();

	$scope.checkVotes = function() {
		appFactory.checkVotes(function(data) {
			var array = [];
			var candidate1 = 0;

			for(var i = 0; i < data.length; i++) {
				data[i].Record.Key = data[i].Key;
				array.push(data[i].Record);

				if (parseInt(data[i].Record.CandidateID) == 1) {

					candidate1++;
				}
			}

			$scope.candidate1Percentage = candidate1/data.length * 100;

			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});

			$scope.votes = array;

		});
	}

	$scope.castVote = function() {
		$("#poll").hide();
		appFactory.castVote($scope.vote, function(data) {
			$scope.success_vote = data;
			$("#success_create").show();
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
});

// Dependency factory, used for routing the functions called from HTML to controller
app.factory('appFactory', function($http) {
	// Storing all functions in a variable
	var factory = {};

  factory.checkVotes = function(callback) {
    $http.get('/check_votes/').success(function(output){
		callback(output)
		});
	}

	factory.castVote = function(data, callback) {
		// Construct Vote object
		// TODO: Find a way to find pubkey
		var vote = "772829d" + "-" + data.CandidateID + "-" + data.PartyID;

		$http.get('/cast_vote/' + vote).success(function(output){
			callback(output)
		});
	}
	// Returning the factory to be used
	return factory;
});
