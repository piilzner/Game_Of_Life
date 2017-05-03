/*                                           Rules
* 1.     Any live cell with fewer than two live neighbours dies, as if caused by under-population.
* 2.     Any live cell with two or three live neighbours lives on to the next generation.
* 3.     Any live cell with more than three live neighbours dies, as if by overcrowding.
* 4.     Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/

/* Base function */
function GameOfLife(size) {
	this.size = size;
  this.grid = this.createGrid();
  this.directions = [ [-1,-1],   // Top left
  										[-1, 0],   // Top
                      [-1, 1],   // Top right
                      [ 0,-1],   // Left
                      [ 0, 1],   // Right
                      [ 1,-1],   // Bottom Left
                      [ 1, 0],   // Bottom
                      [ 1, 1] ]; // Bottom Right
	this.showGrid();
}

/* Render grid */
GameOfLife.prototype.createGrid = function () {
	var grid = [];
  for(var i = 0; i < this.size; i++) {
  	var row = [];
    for(var j = 0; j < this.size; j++) {
    	row.push(new Cell());
    }
  	grid.push(row);
  }
  return grid;
}

/* Show grid */
GameOfLife.prototype.showGrid = function() {
	for(var row = 0; row < this.size; row++) {
  	var rowDiv = document.createElement("DIV");
  	rowDiv.className = "row";
    for(var col = 0; col < this.size; col++) {
    	var cell = this.grid[row][col].el;
      rowDiv.appendChild(cell);
    }
    document.getElementById("grid").appendChild(rowDiv);
  }
}

/* If cell has fewer than two live neighbours */
GameOfLife.prototype.notEnoughNeighbours = function(x, y) {
	return this.grid[x][y].cellIsAlive() && this.grid[x][y].neighbours < 2;
}

/* If cell has more than three live neighbours */
GameOfLife.prototype.tooManyNeighbours = function(x, y) {
	return this.grid[x][y].cellIsAlive() && this.grid[x][y].neighbours > 3;
}

/* If cell has exactly three neighbours it can be resurrected */
GameOfLife.prototype.canBeResurrected = function(x, y) {
	return !this.grid[x][y].cellIsAlive() && this.grid[x][y].neighbours === 3;
}

/* Function to check directions around Cell
* Checks if its inside the grid.
* If its inside and a live neighbour, reproduce
*/
GameOfLife.prototype.updateNeighboursForCell = function(x, y) {
	var cell = this.grid[x][y];
  cell.neighbours = 0;
  for(var i = 0; i < this.directions.length; i++) {
  	var dx = this.directions[i][0];
    var dy = this.directions[i][1];
    if(this.inBounds(x + dx, y + dy)) {
    	var neighbourCell = this.grid[x + dx][y + dy];
      if(neighbourCell.cellIsAlive()) {
      	cell.neighbours++;
      }
    }
  }
};

/* Function to loop thrue and uppdate all neighbour cells */
GameOfLife.prototype.updateNeighBoursForAllCells = function() {
	for(var row = 0; row < this.size; row++) {
  	for(var col = 0; col < this.size; col++) {
    	this.updateNeighboursForCell(row, col);
    }
  }
};

/* Function to check if its inside the grid */
GameOfLife.prototype.inBounds = function(row, col){
	return row >= 0 && col >= 0 && row < this.size && col < this.size;
}

/* Function to check current Cell state.
 * Kill or resurrect Cell.
 */
GameOfLife.prototype.updateCell = function(row, col){
	var currentCell = this.grid[row][col];
  if (this.notEnoughNeighbours(row, col) || this.tooManyNeighbours(row, col)){
  	currentCell.killCell();
  }else if (this.canBeResurrected(row, col)){
  	currentCell.resurrectCell();
  }
}
/* Function to uppdate all Cells */
GameOfLife.prototype.updateAllCells = function(row, col){
	for (var row = 0; row < this.size; row++) {
    for (var col = 0; col < this.size; col++) {
      this.updateCell(row, col);
    }
  }
}


/* Cell base function */
function Cell() {
	this.el;
	this.alive = Math.random() > 0.7;
  this.neighbours = 0;
  if(this.alive) {
  	var element = document.createElement("DIV");
    element.className = "cell alive";
  	this.el = element;
  } else {
  	var element = document.createElement("DIV");
    element.className = "cell";
  	this.el = element;
  }
}

/* Function to check if Cell is alive */
Cell.prototype.cellIsAlive = function() {
	return this.el.classList.contains("alive");
}
/* Function to kill the Cell */
Cell.prototype.killCell = function() {
	return this.el.classList.remove("alive");
}
/* Function to resurrect Cell */
Cell.prototype.resurrectCell = function() {
	return this.el.classList.add("alive");
}

/* Initialize the game on page */
var game = new GameOfLife(100)

/* Start the game */
function startGame(){
  setInterval( function () {
    game.updateNeighBoursForAllCells();
    game.updateAllCells();
  },1000 / 60);
}
