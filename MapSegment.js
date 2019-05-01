import { getIDFromCoords } from "./script.js";
import {tools} from "./Tools.js";
import {items} from "./Items.js";

export class MapSegment {
	constructor(mapWidth, mapHeight) {
		this.mapWidth = mapWidth;
		this.mapHeight = mapHeight;
		this.tiles = [];
		this.biome = "grassland";
		
		this.createSegment();
	}

	load() {

		if (this.biome === "grassland") {
			document.documentElement.style.setProperty("--current-background", "url('./textures/grass.png')");
			document.documentElement.style.setProperty("--current-background-selected", "url('./textures/grass-selected.png')");
		}
		else if (this.biome === "desert") {
			document.documentElement.style.setProperty("--current-background", "url('./textures/sand.png')");
			document.documentElement.style.setProperty("--current-background-selected", "url('./textures/sand-selected.png')");
		}
		else if (this.biome === "tundra") {
			document.documentElement.style.setProperty("--current-background", "url('./textures/snow.png')");
			document.documentElement.style.setProperty("--current-background-selected", "url('./textures/snow-selected.png')");
		}

		for (var i = 0; i < this.mapHeight; i++) {
			for (var j = 0; j < this.mapWidth; j++) {
				document.getElementById("square" + getIDFromCoords(j, i)).classList = ["square"];
				document.getElementById("square" + getIDFromCoords(j, i)).classList.add("has-" + this.tiles[i][j].itemName);
				document.getElementById("square" + getIDFromCoords(j, i)).setAttribute("data-durability", this.tiles[i][j].durability);
			}
		}
	}

	getSquareStatus(x, y) {
		return this.tiles[y][x];
	}

	interact(x, y, selectedItem) {
		let currentSquareElement = document.getElementById("square" + getIDFromCoords(x, y));
		let currentItem = this.tiles[y][x];

		if (selectedItem.itemType === "tool") {
			switch(selectedItem) {
				case tools.hoe:
					if (!currentItem.takesUpSpace) {
						this.tiles[y][x] = items.farmland;
						currentSquareElement.classList.remove("has-" + currentItem.itemName);
						currentSquareElement.classList.add("has-" + items.farmland.itemName);
						currentSquareElement.setAttribute("data-durability", items.farmland.durability);
					}
					break;
				default:
					if (currentItem.isBreakable) {
						if (selectedItem === currentItem.effectiveTool) {
							currentSquareElement.setAttribute("data-durability", (currentSquareElement.getAttribute("data-durability") - 2));
						}
						else {
							currentSquareElement.setAttribute("data-durability", (currentSquareElement.getAttribute("data-durability") - 1));
						}
						if (currentSquareElement.getAttribute("data-durability") <= 0) {
							this.tiles[y][x] = items.air;
							currentSquareElement.classList.remove("has-" + currentItem.itemName);
							currentSquareElement.classList.add("has-" + items.air.itemName);
							return [currentItem, currentItem.drops];
						}
						else {
							return [null, 0];
						}
					}
					break;
			}
		}
		else if (selectedItem.itemType === "material") {
			if (!currentItem.takesUpSpace && selectedItem.isPlacable) {
				currentSquareElement.classList.remove("has-" + currentItem.itemName);
				currentSquareElement.classList.add("has-" + selectedItem.itemName);
				currentSquareElement.setAttribute("data-durability", selectedItem.durability);
				this.tiles[y][x] = selectedItem;
				return [selectedItem, -1];
			}
			else if (selectedItem.isPlantable && currentItem === items.farmland) {
				currentSquareElement.classList.remove("has-" + currentItem.itemName);
				currentSquareElement.classList.add("has-" + selectedItem.itemName);
				this.tiles[y][x] = selectedItem;
				if (selectedItem === items.seeds) {
					//let self = this;
					//setTimeout(function() {
					//	self.tiles[y][x] = items.crops;
					//	currentSquareElement.classList.remove("has-" + selectedItem.itemName);
					//	currentSquareElement.classList.add("has-" + items.crops.itemName);
					//}, 1000);
					document.getElementById("square" + getIDFromCoords(x, y)).setAttribute("data-progress", 0);

				}
				return [selectedItem, -1];
			}
		}

		return [null, 0];
	}

	createSegment() {
		for ( let i = 0; i < this.mapHeight; i++ ) {
			let mapRow = [];
			for ( let j = 0; j < this.mapWidth; j++) {
				let randomValue = (Math.floor(Math.random() * 100));
				if (randomValue < 5) {
					mapRow.push(items.wood);
				}
				else if (randomValue < 10) {
					mapRow.push(items.smallStone);
				}
				else if (randomValue < 15) {
					mapRow.push(items.plant);
				}
				else {
					mapRow.push(items.air);
				}
			}
			this.tiles.push(mapRow);
		}

		let randomValue = (Math.floor(Math.random() * 100));
		if (randomValue < 50)  {
			this.biome = "grassland";
		}
		else if (randomValue < 80) {
			this.biome = "desert";
		}
		else {
			this.biome = "tundra";
		}
	}

	loop() {
		this.updateTiles();
	}

	updateTiles() {
		for (let i = 0; i < this.mapHeight; i++) {
			for (let j = 0; j < this.mapWidth; j++) {
				if (this.tiles[i][j] === items.seeds) {
					let tile = document.getElementById("square" + getIDFromCoords(j, i));
					let randomValue = (Math.floor(Math.random() * 100));
					if (randomValue === 1) {
						tile.setAttribute("data-progress", parseInt(tile.getAttribute("data-progress")) + 1);
						if (parseInt(tile.getAttribute("data-progress")) >= 100) {
							this.tiles[i][j] = items.crops;
							tile.classList.remove("has-" + items.seeds.itemName);
							tile.classList.add("has-" + items.crops.itemName);
							tile.removeAttribute("data-progress");
						}
					}
				}
			}
		}
	}
}