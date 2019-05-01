import { GameMap } from "./GameMap.js";
import { InfoBar } from "./InfoBar.js";
import { LeftSideMenu } from "./LeftSideMenu.js";
import { GameBoard } from "./GameBoard.js";
import { RightSideMenu } from "./RightSideMenu.js";
import { PauseMenu } from "./PauseMenu.js";
import { Player } from "./Player.js";
import { Inventory } from "./Inventory.js";
import { CraftingMenu } from "./CraftingMenu.js";
import { recipes } from "./Recipes.js";


var infoBar, leftSideMenu, gameBoard, rightSideMenu, pauseMenu, player, inventory, mainStage, craftingMenu, map;

var mapWidth = 20;
var mapHeight = 10;

$(document).ready(function() {
	createGameBoard();


	$("#back-to-game-button").on("click", toggleMenu);

	map.load(0, 0);
	map.step("", 0, 0);

	player.step(0, 0, "right");
	
	var miniMapX = map.mapX;
	var miniMapY = map.mapY;

	gameLoop();
});

export function getIDFromCoords(x, y) {
	return ((y * mapWidth) + x);
}
export function getCoordsFromID(id) {
	return [(id % mapWidth), (Math.floor(id / mapWidth))];
}

function toggleMenu() {
	if (mainStage.contains(gameBoard.getNode())) {
		mainStage.removeChild(gameBoard.getNode());
		mainStage.appendChild(pauseMenu.getNode());
	}
	else if (mainStage.contains(pauseMenu.getNode())) {
		mainStage.removeChild(pauseMenu.getNode());
		mainStage.appendChild(gameBoard.getNode());
	}
}

function toggleCraftingMenu() {
	if (mainStage.contains(gameBoard.getNode())) {
		mainStage.removeChild(gameBoard.getNode());
		mainStage.appendChild(craftingMenu.getNode());
	}
	else if (mainStage.contains(craftingMenu.getNode())) {
		mainStage.removeChild(craftingMenu.getNode());
		mainStage.appendChild(gameBoard.getNode());
	}
}

function createGameBoard() {
	mainStage = document.createElement("div");
	mainStage.id = "main-stage";

	map = new GameMap(mapWidth, mapHeight);
	infoBar = new InfoBar( 3, 3 );
	leftSideMenu = new LeftSideMenu();
	rightSideMenu = new RightSideMenu();
	inventory = new Inventory(leftSideMenu, rightSideMenu, infoBar);
	player = new Player(map, inventory);
	gameBoard = new GameBoard(mapWidth, mapHeight, player);
	pauseMenu = new PauseMenu(toggleMenu);
	craftingMenu = new CraftingMenu(inventory);

	craftingMenu.addRecipe(recipes.axe);
	craftingMenu.addRecipe(recipes.seeds);
	craftingMenu.addRecipe(recipes.hoe);
	craftingMenu.addRecipe(recipes.grain);
	craftingMenu.addRecipe(recipes.barrel);

	mainStage.appendChild(gameBoard.getNode());

	var body = document.getElementsByTagName("body")[0];
	body.appendChild(infoBar.getNode());
	body.appendChild(leftSideMenu.getNode());
	body.appendChild(mainStage);
	body.appendChild(rightSideMenu.getNode());

	let audio = document.createElement("audio");
	audio.setAttribute("src", "sounds/tink.wav");
	audio.id = "tink-sound";
	body.appendChild(audio);




	infoBar.addCoordinateDisplay();

	infoBar.addMiniMap();
	infoBar.addCurrentItem();
	gameBoard.initialize();
	player.initializeInventory();


}

$( "body" ).on( "keypress", function( event ) {
	if ( !( player.frozen ) ) {
		if ( !$( "game-board" ).hasClass( "inactive" ) ) {
			switch(event.which) {
				case 87: // shift-w
					player.deface();
					player.face( "up" );
					player.cancelMoveTo();
					break;
				case 119: // w
					player.step( 0, -1, "up" );
					player.cancelMoveTo();
					break;
				case 65: // shift-a
					player.deface();
					player.face( "left" );
					player.cancelMoveTo();
					break;
				case 97: // a
					player.step( -1, 0, "left" );
					player.cancelMoveTo();
					break;
				case 83: // shift-s
					player.deface();
					player.face( "down" );
					player.cancelMoveTo();
					break;
				case 115: // s
					player.step( 0, 1, "down" );
					player.cancelMoveTo();
					break;
				case 68: // shift-d
					player.deface();
					player.face( "right" );
					player.cancelMoveTo();
					break;
				case 100: // d
					player.step( 1, 0, "right" );
					player.cancelMoveTo();
					break;
				case 32: // space-bar
					player.interact();
					player.cancelMoveTo();
					break;
				case 67: // shift-c
				case 99: // c
					toggleCraftingMenu();
					player.cancelMoveTo();
					break;
			}
		}
	}
});

$("body").on("contextmenu", false);

var escHeld = false;

$("body").on("keypress", function(event) {
	switch(event.keyCode) {
		case 27: // escape
			if (!escHeld) {
				toggleMenu();
				player.cancelMoveTo();
				escHeld = true;
			}
			break;
	}
});
$("body").on("keyup", function(event) {
	switch(event.keyCode) {
		case 27: //escape
			escHeld = false;
			break;
	}
});

function gameLoop() {
	map.loop();
	setTimeout(gameLoop, 10);
}