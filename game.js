/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

let BG_COLOR = 0x050505;
let TEXT_COLOR = 0xf0f0f0;
let PLAYER_COLOR = 0x80C0B0;

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = function(system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize(32, 32);

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	PS.statusText("This path leads to the haunted house");

	// Add any other initialization code you need here.
	
	PS.statusColor(TEXT_COLOR);
	PS.gridColor(BG_COLOR);
	PS.border(PS.ALL, PS.ALL, 0);
	PS.color(PS.ALL, PS.ALL, BG_COLOR);

	currentMap = pathMap;
	PS.timerStart(1, gameLoop);
};

function gameLoop () {
	erase();
	gameLogic();
	render();
}

function erase () {
	//PS.color(xPlayer, yPlayer, BG_COLOR);
	PS.imageBlit(currentMap, 0, 0);
}

// Player position and movement
let xPlayer = 15;
let yPlayer = 15;
let moveDelay = 0;

// Mouse position
let xMouse = 15;
let yMouse = 15;

// Map info
let currentMap = undefined;
let xMap = 7;
let yMap = 31;

function gameLogic () {
	if (moveDelay > 0) {
		moveDelay -= 1;
	}
	else {
		let xDelta = 0;
		let yDelta = 0;
		if (upPressed) {
			yDelta -= 1;
		}
		if (downPressed) {
			yDelta += 1;
		}
		if (leftPressed) {
			xDelta -= 1;
		}
		if (rightPressed) {
			xDelta += 1;
		}
		if (xDelta !== 0 || yDelta !== 0) {
			let xTarget = xPlayer + xDelta;
			let yTarget = yPlayer + yDelta;
			if (xTarget <= 0) {
				xTarget = 0;
			}
			if (yTarget <= 0) {
				yTarget = 0;
			}
			if (xTarget >= 31) {
				xTarget = 31;
			}
			if (yTarget >= 31) {
				yTarget = 31;
			}
			let tileTarget = currentMap.tile[xTarget + yTarget * 32];
			if (tileTarget === 1) {
				// Blocked, can't move here
				// Try keeping current X position
				tileTarget = currentMap.tile[xPlayer + yTarget * 32];
				if (tileTarget === 1) {
					// Blocked, can't move here
					// Try keeping current Y position
					tileTarget = currentMap.tile[xTarget + yPlayer * 32];
					if (tileTarget === 1) {
						// Blocked, can't move here
						// Give up
						xDelta = 0;
						yDelta = 0;
					}
					else {
						// New target is good, use it
						yDelta = 0;
					}
				}
				else {
					// New target is good, use it
					xDelta = 0;
				}
			}
			else {
				// Initial tile target was good
			}
			xPlayer += xDelta;
			yPlayer += yDelta;
			if (xPlayer <= 0) {
				xPlayer = 0;
			}
			if (yPlayer <= 0) {
				yPlayer = 0;
			}
			if (xPlayer >= 31) {
				xPlayer = 31;
			}
			if (yPlayer >= 31) {
				yPlayer = 31;
			}
			moveDelay = 5;
		}
	}
	// Move between map spaces
	if (yPlayer === 0 && yMap > 0) {
		yMap -= 1;
		yPlayer = 30;
		currentMap = mapGrid[xMap + yMap * 32];
	}
	else if (yPlayer === 31 && yMap < 31) {
		yMap += 1;
		yPlayer = 1;
		currentMap = mapGrid[xMap + yMap * 32];
	}
	else if (xPlayer === 0 && xMap > 0) {
		xMap -= 1;
		xPlayer = 30;
		currentMap = mapGrid[xMap + yMap * 32];
	}
	else if (xPlayer === 31 && xMap < 31) {
		xMap += 1;
		xPlayer = 1;
		currentMap = mapGrid[xMap + yMap * 32];
	}
}

function render () {
	PS.color(xPlayer, yPlayer, PLAYER_COLOR);
}

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function(x, y, data, options) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead. 
	if (editMode) {
		PS.border(x, y, 2);
		PS.borderColor(x, y, 0xC0C0C0);
		currentMap.tile[x + y * 32] = 1;
		editTouching = true;
	}
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function(x, y, data, options) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
	if (editMode) {
		editTouching = false;
	}
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function(x, y, data, options) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
	xMouse = x;
	yMouse = y;
	if (editMode) {
		if (editTouching) {
			PS.border(x, y, 2);
			PS.borderColor(x, y, 0xC0C0C0);
			currentMap.tile[x + y * 32] = 1;
		}
	}
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function(x, y, data, options) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function(options) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

// Pressed input keys
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let interactPressed = false;
// Released input keys
let upReleased = true;
let downReleased = true;
let leftReleased = true;
let rightReleased = true;
let interactReleased = true;
// Edit mode
let editMode = false;
let editTouching = false;

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function(key, shift, ctrl, options) {
	// Uncomment the following code line to inspect first three parameters:

	//PS.debug("PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n");

	// Add code here for when a key is pressed.
	if (key === 119 || key === 1006) {
		// W or Up
		upPressed = true;
	}
	else if (key === 115 || key === 1008) {
		// S or Down
		downPressed = true;
	}
	else if (key === 97 || key === 1005) {
		// A or Left
		leftPressed = true;
	}
	else if (key === 100 || key === 1007) {
		// D or Right
		rightPressed = true;
	}
	else if (key === 122 || key === 120 || key === 32 || key === 13) {
		// Z, X, Space, Enter
		interactPressed = true;
	}
	else if (key === 112) {
		// P
		// Edit mode
		if (editMode) {
			editMode = false;
			editTouching = false;
			PS.statusText("Done with edit mode");
			PS.debug(exportTileData());
			PS.border(PS.ALL, PS.ALL, 0);
		}
		else {
			editMode = true;
			PS.statusText("Edit Mode - press P again to export");
		}
	}
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function(key, shift, ctrl, options) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
	if (key === 119 || key === 1006) {
		// W or Up
		upPressed = false;
		upReleased = true;
	}
	else if (key === 115 || key === 1008) {
		// S or Down
		downPressed = false;
		downReleased = true;
	}
	else if (key === 97 || key === 1005) {
		// A or Left
		leftPressed = false;
		leftReleased = true;
	}
	else if (key === 100 || key === 1007) {
		// D or Right
		rightPressed = false;
		rightReleased = true;
	}
	else if (key === 122 || key === 120 || key === 32 || key === 13) {
		// Z, X, Space, Enter
		interactPressed = false;
		interactReleased = true;
	}
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function(sensors, options) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

function loadMap (mapName) {
	PS.imageLoad("maps/" + mapName + ".png", doneLoadMap, 1);
}

function doneLoadMap (imageData) {
	PS.imageDump(imageData);
}

function exportTileData () {
	let exportString = "\ttile: [\n";
	for (let i = 0; i < 1024; i += 32) {
		exportString = exportString + "\t" + (currentMap.tile.slice(i, i + 32).join(", ")) + (",\n");
	}
	exportString = exportString + "\t],";
	return exportString;
}

let emptyMap = {
	width : 32, height : 32, pixelSize : 1,
	text: "...",
	tile: [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	data : [
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000
	]
};

let entranceMap = {
	width: 32, height: 32, pixelSize: 1,
	text: "This is it... go up and knock on the door.",
	tile: [
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	data: [
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x440645, 0x440645, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x333645, 0x201E29, 0x201E29, 0x333645, 0x440645, 0x440645, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000,
	0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x300430, 0x300430, 0x300430, 0x300430, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645,
	0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x300430, 0x300430, 0x300430, 0x300430, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645, 0x440645,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100,
	0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807,
	0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807,
	0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100,
	0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807
	]
};

let pathMap = {
	width: 32, height: 32, pixelSize: 1,
	text: "This path leads to the haunted house",
	tile: [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	],
	data: [
	0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807,
	0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807,
	0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x402F1E, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807,
	0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x082100, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807,
	0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x402F1E, 0x082100, 0x402F1E, 0x402F1E, 0x402F1E, 0x402F1E, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807,
	0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100,
	0x2E1807, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x402F1E, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100,
	0x2E1807, 0x082100, 0x0B2B00, 0x0B4100, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100,
	0x2E1807, 0x0B2B00, 0x082100, 0x082100, 0x0B4100, 0x0B2B00, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x402F1E, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100,
	0x2E1807, 0x082100, 0x082100, 0x0B4100, 0x0B2B00, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00,
	0x2E1807, 0x2E1807, 0x0B4100, 0x0B2B00, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x0B4100, 0x0B2B00, 0x0B4100, 0x0B4100,
	0x2E1807, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x2E1807, 0x402F1E, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B4100, 0x0B4100, 0x0B2B00, 0x082100, 0x082100, 0x0B2B00, 0x0B4100, 0x0B2B00, 0x0B2B00,
	0x0B2B00, 0x0B4100, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B4100, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x2E1807,
	0x0B4100, 0x0B2B00, 0x0B4100, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x402F1E, 0x402F1E, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00,
	0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x082100, 0x0B2B00, 0x0B2B00,
	0x082100, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x0B4100, 0x0B2B00,
	0x2E1807, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100,
	0x2E1807, 0x2E1807, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x082100,
	0x2E1807, 0x082100, 0x0B2B00, 0x0B4100, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807,
	0x082100, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x0B2B00, 0x2E1807, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x402F1E, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x0B2B00, 0x0B2B00, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807,
	0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x402F1E, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B4100, 0x0B2B00, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807,
	0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x0B2B00, 0x0B2B00, 0x0B4100, 0x0B2B00, 0x0B4100, 0x0B2B00, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100, 0x0B2B00, 0x082100, 0x0B2B00, 0x082100, 0x082100, 0x2E1807, 0x2E1807,
	0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x2E1807, 0x082100, 0x2E1807,
	0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x0B4100, 0x082100, 0x0B2B00, 0x082100, 0x0B4100, 0x0B2B00, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x0B2B00, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807,
	0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x0B2B00, 0x0B2B00, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100,
	0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100,
	0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x082100,
	0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x2E1807, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x2E1807, 0x082100, 0x082100, 0x082100, 0x082100, 0x2E1807, 0x082100
	]
};


let mapGrid = [
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, entranceMap	, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
	emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, pathMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		, emptyMap		,
];

