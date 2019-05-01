import { getCoordsFromID } from "./script.js";

export class GameBoard {
	constructor( width, height, player ) {
		this.width = width;
		this.height = height;
		this.player = player;

		this.node = document.createElement("div");
		this.node.id = "game-board";
	}

	getNode() {
		return this.node;
	}

	initialize() {
		let element = document.createElement("div");
		element.id = "game-board";

		let gameBoardText = "";
		for (let i = 0; i < this.height; i++) {
			let row = ( "<div class='row' id='row" + i + "'>" );
			for (let j = 0; j < this.width; j++) {
				row += ( "<div class='square' id='square" + ((i * this.width) + j) + "'></div>" )
			}
			row += "</div>";
			gameBoardText += row;
		}
		element.innerHTML = gameBoardText;

		this.node.appendChild(element)

		let self = this;
		$(".square").on("click", function(event) {
			self.player.moveTo(getCoordsFromID(event.target.id.substring(6)));
		});
	}
}