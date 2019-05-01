export class InfoBar {
	constructor( miniMapWidth, miniMapHeight ) {
		this.miniMapWidth = miniMapWidth;
		this.miniMapHeight = miniMapHeight;

		this.node = document.createElement("div");
		this.node.id = "info-bar";
		this.node.innerHTML = "hello there";
	}

	getNode() {
		return this.node;
	}

	addCoordinateDisplay() {
		//$("#info-bar").html( $("#info-bar").html() + "<span id='location' class='info-bar-entry'></span>" );
		let element = document.createElement("div");
		element.id = "location";
		element.className = "info-bar-entry";
		this.node.appendChild(element);
	}
	updateCoordinateDisplay( x, y ) {
		$( "#location" ).html( "(" + x + ", " + y + ")" );
	}

	addMiniMap() {
		// $("#info-bar").html( $("#info-bar").html() + "<div id='mini-map' class='info-bar-entry'></div>" );
		let element = document.createElement("div");
		element.id = "mini-map";
		element.className = "info-bar-entry";

		let internalHTML = "";
		for (let i = 0; i < this.miniMapHeight; i++) {
			let row = "<div class='mini-map-row'>";
			for (let j = 0; j < this.miniMapWidth; j++) {
				row += ("<div class='mini-map-square' id='mini-map-square-" + ((i * this.miniMapWidth) + j) +"'></div>");
			}
			row +="</div>";
			internalHTML += row;
			//$("#mini-map").html($("#mini-map").html() + row);
		}
		element.innerHTML = internalHTML;

		this.node.appendChild(element);

	}
	updateMiniMap(x, y) {

	}

	addCurrentItem() {
		//$("#info-bar").html($("#info-bar").html() + "<div id='current-item' class='info-bar-entry'></div>");
		let element = document.createElement("div");
		element.id = "current-item";
		element.className = "info-bar-entry";

		this.node.appendChild(element);
	}
	updateCurrentItem(currentItem) {
		$("#current-item").html(currentItem.itemName);
	}
}