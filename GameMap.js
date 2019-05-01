import { MapSegment } from "./MapSegment.js";


export class GameMap {
	constructor(width, height) {
		
		this.mapX = 0;
		this.mapY = 0;
		this.width = width;
		this.height = height;
		this.node = document.createElement("div");
		this.node.id = "map";


		this.mapSegments = [[0, [[0, new MapSegment(this.width, this.height)]]]];
		
	}
	load(mapX, mapY) {
		this.mapX = mapX;
		this.mapY = mapY;
		this.getSegmentAt(this.mapX, this.mapY).load();
	}
	doesSegmentExist(x, y) {
		for (let i = 0; i < this.mapSegments.length; i++) {
			if (this.mapSegments[i][0] === y) {
				for (let j = 0; j < this.mapSegments[i][1].length; j++) {
					if (this.mapSegments[i][1][j][0] === x) {
						return true;
					}
				}
			}
		}
		return false;
	}
	getSegmentAt(x, y) {
		for (let i = 0; i < this.mapSegments.length; i++) {
			if (this.mapSegments[i][0] === y) {
				for (let j = 0; j < this.mapSegments[i][1].length; j++) {
					if (this.mapSegments[i][1][j][0] === x) {
						return this.mapSegments[i][1][j][1];
					}
				}
			}
		}
	}
	createSegment(x, y) {
		for (let i = 0; i < this.mapSegments.length; i++) {
			let found = false;
			if (this.mapSegments[i][0] === y) {
				found = true;
			}
			else if (this.mapSegments[i][0] > y || i === this.mapSegments.length - 1) {
				found = true;
				this.mapSegments.splice(i, 0, [y, []]);
			}
			if (found) {
				for (let j = 0; j < this.mapSegments[i][1].length; j++) {
					if (this.mapSegments[i][1][j][0] > x || j === this.mapSegments[i][1].length - 1) {
						this.mapSegments[i][1].splice(j, 0, [x, new MapSegment(this.width, this.height)]);
						break;
					}
				}
				if (this.mapSegments[i][1].length === 0) {
					this.mapSegments[i][1].push([x, new MapSegment(this.width, this.height)]);
					break;
				}
			}
		}
	}
	getSquareStatus(x, y) {
		return this.getSegmentAt(this.mapX, this.mapY).getSquareStatus(x, y);
	}
	step(direction, x, y) {
		$("#mini-map-square-" + ((this.mapY * this.mapWidth) + this.mapX)).removeClass("selected");
		var changed = false;
		switch(direction) {
			case "up":
				if (!this.doesSegmentExist(this.mapX, this.mapY - 1)) {
					this.createSegment(this.mapX, this.mapY - 1);
				}
				this.mapY--;
				if (!this.getSegmentAt(this.mapX, this.mapY).getSquareStatus(x, this.height - 1).isWall) {
					changed = true;
				}
				else {
					this.mapY++;
				}
				break;
			case "right":
				if (!this.doesSegmentExist(this.mapX + 1, this.mapY)) {
					this.createSegment(this.mapX + 1, this.mapY);
				}
				this.mapX++;
				if (!this.getSegmentAt(this.mapX, this.mapY).getSquareStatus(0, y).isWall) {
					changed = true;
				}
				else {
					this.mapX--;
				}
				break;
			case "down":
				if (!this.doesSegmentExist(this.mapX, this.mapY + 1)) {
					this.createSegment(this.mapX, this.mapY + 1);
				}
				this.mapY++;
				if (!this.getSegmentAt(this.mapX, this.mapY).getSquareStatus(x, 0).isWall) {
					changed = true;
				}
				else {
					this.mapY--;
				}
				break;
			case "left":
				if (!this.doesSegmentExist(this.mapX - 1, this.mapY)) {
					this.createSegment(this.mapX - 1, this.mapY);
				}
				this.mapX--;
				if (!this.getSegmentAt(this.mapX, this.mapY).getSquareStatus(this.width - 1, y).isWall) {
					changed = true;
				}
				else {
					this.mapX++;
				}
				break;
		}
		$("#mini-map-square-" + ((this.mapY * this.mapWidth) + this.mapX)).addClass("selected");
		if (changed) {
			this.load(this.mapX, this.mapY);
			return true;
		}
	}

	interact(x, y, selectedItem) {
		return this.getSegmentAt(this.mapX, this.mapY).interact(x, y, selectedItem);
	}

	getMapNode() {
		this.updateMapNode();
	}
	updateMapNode() {
		for (let i = 0; i < this.mapSegments.length; i++) {

		}
	} // this.mapSegments = [[0, [[0, new MapSegment(this.width, this.height)]]]];

	loop() {
		this.getSegmentAt(this.mapX, this.mapY).loop();
	}
}