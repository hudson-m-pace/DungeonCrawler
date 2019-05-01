export class PauseMenu {
	constructor(toggleMenuFunction) {
		this.node = document.createElement("div");
		this.node.id = "menu";

		let side = document.createElement("div");
		side.id = "left-side-menu";
		side.className = "menu-column";
		let button = document.createElement("div");
		button.id = "back-to-game-button";
		button.className = "menu-item";
		button.innerHTML = "Back To Game";
		side.appendChild(button);
		this.node.appendChild(side);
		side = document.createElement("div");
		side.id = "right-side-menu";
		side.className = "menu-column";
		this.node.appendChild(side);

		button.addEventListener("click", function() {
			toggleMenuFunction();
		});

	}
	getNode() {
		return this.node;
	}

}