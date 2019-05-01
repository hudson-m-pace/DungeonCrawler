import { getIDFromCoords } from "./script.js";
import { tools } from "./Tools.js";

export class Player {
	constructor(map, inventory) {
		this.x = 0;
		this.y = 0;
		this.facing = "up";
		this.frozen = false;
		this.woodCount = 0;
		this.map = map;
		this.inventory = inventory;
		this.moveQueue = [];

		this.face(this.facing);
	}

	initializeInventory() {
		this.inventory.add([tools.empty, 1]);
		this.inventory.selectItem(tools.empty);
	}

	face( direction ) {
		this.facing = direction;
		$( "#square" + getIDFromCoords( this.x, this.y ) ).addClass( "facing-" + this.facing );
	}
	deface() {
		$( "#square" + getIDFromCoords( this.x, this.y ) ).removeClass( "facing-" + this.facing );
	}

	step( xMovement, yMovement, direction ) {
		this.deface();
		$( "#square" + getIDFromCoords( this.x, this.y ) ).removeClass( "has-player" );
		this.x += xMovement;
		this.y += yMovement;
		let movingMaps = false;
		if (this.x < 0) {
			if (this.map.step("left", this.x, this.y)) {
				movingMaps = true;
				this.x = this.map.width - 1;
			}
			else {
				this.x = 0;
			}
		}
		else if (this.x >= this.map.width) {
			if (this.map.step("right", this.x, this.y)) {
				movingMaps = true;
				this.x = 0;
			}
			else {
				this.x = this.map.width - 1;
			}
		}
		if (this.y < 0) {
			if (this.map.step("up", this.x, this.y)) {
				movingMaps = true;
				this.y = this.map.height - 1;
			}
			else {
				this.y = 0;
			}
		}
		else if (this.y >= this.map.height) {
			if (this.map.step("down", this.x, this.y)) {
				movingMaps = true;
				this.y = 0;
			}
			else {
				this.y = this.map.height - 1;
			}
		}
		if (!movingMaps) {
			if (this.map.getSquareStatus(this.x, this.y).isWall) {
				this.x -= xMovement;
				this.y -= yMovement;
			}
		}
		this.face(direction);
		$("#square" + getIDFromCoords(this.x, this.y)).addClass("has-player");
		$("#location").html("(" + this.x + ", " + this.y + ")");
	}

	interact() {
		var valid = false;
		var interactCoordinateX = this.x;
		var interactCoordinateY = this.y;
		switch (this.facing) {
			case "up":
				if ((this.y - 1) >= 0) {
					interactCoordinateY--;
					valid = true;
				}
				break;
			case "right":
				if ((this.x + 1) < this.map.width) {
					interactCoordinateX++;
					valid = true;
				}
				break;
			case "down":
				if ((this.y + 1) < this.map.height) {
					interactCoordinateY++;
					valid = true;
				}
				break;
			case "left":
				if ((this.x - 1) >= 0) {
					interactCoordinateX--;
					valid = true;
				}
				break;
		}
		if (valid && this.frozen === false) {
			//document.getElementById("tink-sound").currentTime = 0;
			//document.getElementById("tink-sound").play();
			$("#square" + getIDFromCoords(interactCoordinateX, interactCoordinateY)).toggleClass("selected");
			this.frozen = true;
			var self = this;
			setTimeout( function() { 
				$("#square" + getIDFromCoords(interactCoordinateX, interactCoordinateY)).toggleClass("selected");
				self.frozen = false;
				self.inventory.add(self.map.interact(interactCoordinateX, interactCoordinateY, self.inventory.selectedItem));
			}, 100);
		}
	}

	unfreeze( x, y ) {
		$( "#square" + getIDFromCoords( x, y ) ).toggleClass( "selected" );
		this.frozen = false;
		var result = this.map.interact( x, y, this.selectedItem );
		if ( result === "w" ) {
			if ( this.woodCount === 0 ) {
				$( "#right-side-game-menu" ).html( $( "#right-side-game-menu" ).html() + "<br><div id='wood-count' class='material menu-item'></div>" );
				$( "#wood-count" ).on( "click", function() {
					this.selected = "wood";
					$( "#wood-count" ).addClass( "selected" );
					$( "#empty-tool-button" ).removeClass( "selected" );
				});
			}
			this.woodCount++;
			$( "#wood-count" ).html( "Wood: " + this.woodCount );
		}
		if ( result === "" && this.selected === "wood" ) {
			this.woodCount--;
			$( "#wood-count").html("Wood: " + this.woodCount );
		}
	}

		moveTo( destination ) {
			let destinationX = destination[0];
			let destinationY = destination[1];
			let currentX = this.x;
			let currentY = this.y;
			let counter = 1;
			let self = this;

			if (this.moveQueue.length !== 0) {
				this.cancelMoveTo();
			}

			while ( destinationX !== currentX || destinationY !== currentY ) {
				if ( destinationX < currentX ) {
					this.moveQueue.push(setTimeout( function() {
						self.step( -1, 0, "left" );
					}, 200 * counter ));
					currentX--;
				}
				else if ( destinationX > currentX ) {
					this.moveQueue.push(setTimeout( function() {
						self.step( 1, 0, "right" );
					}, 200 * counter ));
					currentX++;
				}
				else if ( destinationY < currentY ) {
					this.moveQueue.push(setTimeout( function() {
						self.step( 0, -1, "up" );
					}, 200 * counter ));
					currentY--;
				}
				else if ( destinationY > currentY ) {
					this.moveQueue.push(setTimeout( function() {
						self.step( 0, 1, "down" );
					}, 200 * counter ));
					currentY++;
				}

				counter++;
			}
			this.moveQueue.push(setTimeout( function() {
				self.moveQueue = [];
			}, 200 * counter ));
		}

		cancelMoveTo() {
			for (let i = 0; i < this.moveQueue.length; i++) {
				clearTimeout(this.moveQueue[i]);
			}
			this.moveQueue = [];
		}
	}

