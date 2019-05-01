export class RightSideMenu {
	constructor() {
		this.node = document.createElement("div");
		this.node.id = "right-side-game-menu";
		this.node.className = "side-menu";
		this.node.innerHTML = "Materials";
	}
	getNode() {
		return this.node;
	}
}