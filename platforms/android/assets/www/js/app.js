'use strict';
/* App Controllers */


var memoryGameApp = angular.module('memoryGameApp', []);


memoryGameApp.factory('game', function() {
  var tileNames = ['barbas', 'astrid', 'brotherhoodassassin', 'alduin', 'adoringfan', 'wispmother'];
  //var tileNames = getClients();

  return new Game(tileNames);
});


memoryGameApp.controller('GameCtrl', function GameCtrl($scope, $http, game) { 
  var pitytimer = 20;
  
  var clients = [];
  var tileNames = ['barbas', 'astrid', 'brotherhoodassassin', 'alduin', 'adoringfan', 'wispmother'];
  var expansion = "core";
  tileNames = getClients(expansion);
  console.log(tileNames);
  //$scope.game = new Game(tileNames);
  
  function getClients(expansion) {
	$scope.pitytimer = pitytimer;
	var baseURL = "https://api.tesl.site:8443/TESLAPI/ExecuteSQL?query=";
	//var url = baseURL + "SELECT cardid FROM card where expansion = '" + expansion + "' and evolves <> 'True' ORDER BY RAND() LIMIT 6";
	var url = baseURL + "SELECT common, rare, epic, legendary FROM pack where expansion = '" + expansion + "' ORDER BY RAND() LIMIT 1";
	if (pitytimer < 1) { 
	var url = baseURL + "SELECT common, rare, epic, legendary FROM pack where expansion = '" + expansion + "' AND legendary = 1 ORDER BY RAND() LIMIT 1";
	} 
	console.log(url);
	$http.get(url).then(function (response) {
		if (angular.isUndefined(response.data.client[0])) {
			console.log("Error opening pack. Please try again later.");
			return [];
		}
		else {
			console.log("Pack opened.");
			clients = response.data.client;
			//next we need to actually open the pack
			var query = "SELECT x.* FROM ((SELECT cardid FROM card where expansion = '" + expansion + "' and rarity = 'common' and evolves <> 'True' ORDER BY RAND() LIMIT " + clients[0].common +
			") UNION (SELECT cardid FROM card where expansion = '" + expansion + "' and rarity = 'rare' and evolves <> 'True' ORDER BY RAND() LIMIT " + clients[0].rare +
			") UNION (SELECT cardid FROM card where expansion = '" + expansion + "' and rarity = 'epic' and evolves <> 'True' ORDER BY RAND() LIMIT " + clients[0].epic +
			") UNION (SELECT cardid FROM card where expansion = '" + expansion + "' and rarity = 'legendary' and evolves <> 'True' ORDER BY RAND() LIMIT " + clients[0].legendary +
			") LIMIT 6) x ORDER BY RAND()";
			url = baseURL + query;
			console.log(url);
			$http.get(url).then(function (response) {
				if (angular.isUndefined(response.data.client[0])) {
					console.log("Error opening pack. Please try again later.");
					return [];
				}
				else {
					console.log("Pack opened.");
					pitytimer--;
					if (clients[0].legendary > 0) {pitytimer = 20;}
					clients = response.data.client;
					$scope.game = new Game(clients);
					return clients;
				}
			});
		}
	});
}

$scope.reset = function(expansion) {
	  clients = []
	  getClients(expansion);
}

  
});


//usages:
//- in the repeater as: <mg-card tile="tile"></mg-card>
//- card currently being matched as: <mg-card tile="game.firstPick"></mg-card>

memoryGameApp.directive('mgCard', function() {
  return {
    restrict: 'E',
    // instead of inlining the template string here, one could use templateUrl: 'mg-card.html'
    // and then either create a mg-card.html file with the content or add
    // <script type="text/ng-template" id="mg-card.html">.. template here.. </script> element to
    // index.html
    template: '<div class="container">' +
                '<div class="card" ng-class="{flipped: tile.flipped}">' +
                  '<img class="front" ng-src="img/back.png" style="height:95%;">' +
                  '<img class="back" ng-src="https://www.legends-decks.com/img_cards/{{tile.cardid}}.png" style="height:100%;">' +
                '</div>' +
              '</div>',
    scope: {
      tile: '='
    }
  }
});
