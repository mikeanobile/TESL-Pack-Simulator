'use strict';
/* Memory Game Models and Business Logic */

function Tile(cardid) {
  this.cardid = cardid;
  this.flipped = false;
}

Tile.prototype.flip = function() {
  this.flipped = !this.flipped;
}



function Game(tileNames) {
	


//var clients = getClients();


  var tileDeck = makeDeck(tileNames);

  this.grid = makeGrid(tileDeck);
  this.message = Game.MESSAGE_CLICK;
  this.unmatchedPairs = tileNames.length;

  this.flipTile = function(tile) {
    if (tile.flipped) {
      return;
    }
    tile.flip();
  }
}

Game.MESSAGE_CLICK = 'Click on a card.';
Game.MESSAGE_ONE_MORE = 'Pick one more card.'
Game.MESSAGE_MISS = 'Try again.';
Game.MESSAGE_MATCH = 'Good job! Keep going.';
Game.MESSAGE_WON = 'You win!';




/* Create an array with two of each tileName in it */
function makeDeck(tileNames) {
  var tileDeck = [];
  tileNames.forEach(function(name) {
    tileDeck.push(new Tile(name.cardid));
  });

  return tileDeck;
}


function makeGrid(tileDeck) {
  var gridDimension = tileDeck.length,
      grid = [],
	  rows = 2,
	  cols = 3;

  for (var row = 0; row < rows; row++) {
    grid[row] = [];
    for (var col = 0; col < cols; col++) {
        grid[row][col] = removeRandomTile(tileDeck);
    }
  }

  return grid;
}


function removeRandomTile(tileDeck) {
  var i = Math.floor(Math.random()*tileDeck.length);
  return tileDeck.splice(i, 1)[0];
}

