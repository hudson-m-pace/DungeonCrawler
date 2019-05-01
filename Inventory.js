import {tools, getToolByName} from "./Tools.js";
import {items, getItemByName} from "./Items.js";

export class Inventory {
	constructor(leftSideMenu, rightSideMenu, infoBar) {
		this.leftSideMenu = leftSideMenu;
		this.rightSideMenu = rightSideMenu;
		this.infoBar = infoBar;
		this.materials = [];
		this.tools = [];
		for (let i = 0; i < 10; i++) {
			this.materials.push(null);
			this.tools.push(null);
		}
		this.selectedItem = tools.empty;

		this.createSlots();
	}

	selectItem(itemToSelect, index) {
		document.getElementById(this.getItemSlotID(this.selectedItem)).classList.remove("selected");
		document.getElementById(this.getItemSlotID(itemToSelect)).classList.add("selected");
		this.selectedItem = itemToSelect;
		this.infoBar.updateCurrentItem(itemToSelect);
	}

	add(itemAddArray) {
		let itemToAdd = itemAddArray[0];
		let amountToAdd = itemAddArray[1];
		if (itemToAdd !== null && amountToAdd !== 0) {

			let menuChoice;
			let menuChoiceIDText;
			if (itemToAdd.itemType === "tool") {
				menuChoice = this.tools;
				menuChoiceIDText = "tool-slot-";
			}
			else if (itemToAdd.itemType === "material") {
				menuChoice = this.materials;
				menuChoiceIDText = "material-slot-";
			}

			let result = this.find(itemToAdd);
			let found = result[0];
			let index = result[1];
			if (!found) {

				if (index === -1) {
					console.log("no room");
					return;
				}

				menuChoice[index] = [itemToAdd, amountToAdd];
				let slot = document.getElementById(menuChoiceIDText + index);
				slot.setAttribute("data-item", itemToAdd.itemName);
				slot.innerHTML = (itemToAdd.itemName + ": " + menuChoice[index][1]);
			}
			else {
				menuChoice[index][1] += amountToAdd;
				document.getElementById(menuChoiceIDText + index).innerHTML = (itemToAdd.itemName + ": " + menuChoice[index][1]);
				if (menuChoice[index][1] <= 0) {
					if (this.selectedItem === itemToAdd) {
						this.selectItem(tools.empty);
					}
					menuChoice[index] = null;
					document.getElementById(menuChoiceIDText + index).setAttribute("data-item", "none");
					this.alignInventory();
				}
			}
		}
	}

	alignInventory() {
		let currentIndex = 0;
		for(let i = 0; i < this.tools.length; i++) {
			document.getElementById("tool-slot-" + i).innerHTML = "";
			if (this.tools[i] !== null) {
				this.tools[currentIndex] = this.tools[i];
				document.getElementById("tool-slot-" + currentIndex).innerHTML = this.tools[i][0].itemName + ": " + this.tools[i][1];
				document.getElementById("tool-slot-" + currentIndex).setAttribute("data-item", this.tools[i][0].itemName);
				if (i !== currentIndex) {
					this.tools[i] = null;
					document.getElementById("tool-slot-" + i).setAttribute("data-item", "none");
				}
				currentIndex++;
			}
			else {
				document.getElementById("tool-slot-" + i).setAttribute("data-item", "none");
			}
		}
		currentIndex = 0;
		for(let i = 0; i < this.materials.length; i++) {
			document.getElementById("material-slot-" + i).innerHTML = "";
			if (this.materials[i] !== null) {
				this.materials[currentIndex] = this.materials[i];
				document.getElementById("material-slot-" + currentIndex).innerHTML = this.materials[i][0].itemName + ": " + this.materials[i][1];
				document.getElementById("material-slot-" + currentIndex).setAttribute("data-item", this.materials[i][0].itemName);
				if (i !== currentIndex) {
					this.materials[i] = null;
					document.getElementById("material-slot-" + i).setAttribute("data-item", "none");
				}
				currentIndex++;
			}
			else {
				document.getElementById("material-slot-" + i).setAttribute("data-item", "none");
			}
		}
	}

	has(item, amount) {
		let result = this.find(item);
		let found = result[0];
		let index = result[1];
		if (index === -1) {
			return false;
		}
		let menu;
		if (item.itemType === "tool") {
			menu = this.tools;
		}
		else if (item.itemType === "material") {
			menu = this.materials;
		}

		if (menu[index][1] >= amount) {
			return true;
		}
		else {
			return false;
		}
	}
	

	find(item) {
		let menu;
		if (item.itemType === "tool") {
			menu = this.tools;
		}
		else if (item.itemType === "material") {
			menu = this.materials;
		}

		for (let i = 0; i < menu.length; i++) {
			
			if (menu[i] === null) {
				return [false, i];
			}
			else if (menu[i][0] === item) {
				return [true, i];
			}
		}
		return [false, -1];

	}

	makeItemID(item) {
		return ("#" + item.itemName + "-count");
	}
	getItemSlotID(item) {
		let id;
		if (item.itemType === "tool") {
			id = "tool-slot-";
		}
		else if (item.itemType === "material") {
			id = "material-slot-";
		}
		return (id + this.find(item)[1]);
	}

	createSlots() {
		for (let i = 0; i < this.tools.length; i++) {
			let slot = document.createElement("div");
			slot.id = ("tool-slot-" + i);
			slot.classList.add("menu-item");
			slot.setAttribute("data-item", "none");
			let self = this;
			slot.addEventListener("click", function() {
				let itemName = this.getAttribute("data-item");
				if (itemName !== "none") {
					self.selectItem(getToolByName(itemName));
				}
			});
			this.leftSideMenu.getNode().appendChild(slot);
		} 
		for (let i = 0; i < this.materials.length; i++) {
			let slot = document.createElement("div");
			slot.id = ("material-slot-" + i);
			slot.classList.add("menu-item");
			slot.setAttribute("data-item", "none");
			let self = this;
			slot.addEventListener("click", function() {
				let itemName = this.getAttribute("data-item");
				if (itemName !== "none") {
					self.selectItem(getItemByName(itemName));
				}
				//self.selectItem(getItemByName(this.getAttribute("data-item")));
			});
			this.rightSideMenu.getNode().appendChild(slot);
		}
	}
}