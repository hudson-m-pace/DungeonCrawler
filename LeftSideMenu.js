export class LeftSideMenu {
	constructor() {
		this.node = document.createElement("div");
		this.node.id = "left-side-game-menu";
		this.node.className = "side-menu";
		this.node.innerHTML = "Tools";
	}

	getNode() {
		return this.node;
	}
}