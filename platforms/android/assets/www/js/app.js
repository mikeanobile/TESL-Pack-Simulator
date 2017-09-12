'use strict';
/* App Controllers */


var memoryGameApp = angular.module('memoryGameApp', []);


memoryGameApp.factory('game', function() {
  var tileNames = ['barbas', 'astrid', 'brotherhoodassassin', 'alduin', 'adoringfan', 'wispmother'];
  //var tileNames = getClients();

  return new Game(tileNames);
});


memoryGameApp.controller('GameCtrl', function GameCtrl($scope, $http, game) { 
  var clients = [];
  var tileNames = ['barbas', 'astrid', 'brotherhoodassassin', 'alduin', 'adoringfan', 'wispmother'];
  tileNames = getClients();
  console.log(tileNames);
  //$scope.game = new Game(tileNames);
  
  function getClients() {
	var baseURL = "https://api.tesl.site:8443/TESLAPI/ExecuteSQL?query=";
	var url = baseURL + "SELECT cardid FROM card ORDER BY RAND() LIMIT 6";
	console.log(url);
	$http.get(url).then(function (response) {
		if (angular.isUndefined(response.data.client[0])) {
			console.log("Error opening pack. Please try again later.");
			return [];
		}
		else {
			console.log("Pack opened.");
			clients = response.data.client;
			$scope.game = new Game(clients);
			return clients;
		}
	});
}

function reset() {
	  clients = []
	  getClients();
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
                  '<img class="front" ng-src="img/back.png">' +
                  '<img class="back" ng-src="https://www.legends-decks.com/img_cards/{{tile.cardid}}.png">' +
                '</div>' +
              '</div>',
    scope: {
      tile: '='
    }
  }
});
