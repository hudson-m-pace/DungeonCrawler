export class CraftingMenu {
	constructor(inventory) {
		this.node = document.createElement("div");
		this.node.id = "crafting-menu";
		this.inventory = inventory;
	}
	getNode() {
		return this.node;
	}

	addRecipe(recipe) {
		let newRecipeButton = document.createElement("div");
		newRecipeButton.className = "menu-item";
		newRecipeButton.innerHTML = (recipe.recipeName + ": ");
		for (let i = 0; i < recipe.requiredItems.length; i++) {
			newRecipeButton.innerHTML += (recipe.requiredItems[i][1] + "x " + recipe.requiredItems[i][0].itemName + ", ");
		}
		newRecipeButton.innerHTML = newRecipeButton.innerHTML.substring(0, newRecipeButton.innerHTML.length - 2);
		let self = this;
		newRecipeButton.addEventListener("click", function() {
			self.tryToCraft(recipe);
		});

		this.node.appendChild(newRecipeButton);
	}

	tryToCraft(recipe) {
		let hasItems = true;
		for (let i = 0; i < recipe.requiredItems.length; i++) {
			if (!this.inventory.has(recipe.requiredItems[i][0], recipe.requiredItems[i][1])) {
				hasItems = false;
				break;
			}
		}
		if (hasItems) {
			for (let i = 0; i < recipe.requiredItems.length; i++) {
				this.inventory.add([recipe.requiredItems[i][0], (recipe.requiredItems[i][1] * -1)]);
			}
			//this.inventory.add([recipe.resultingItem, 1]);
			for (let i = 0; i < recipe.resultingItems.length; i++) {
				this.inventory.add(recipe.resultingItems[i]);
			}
		}
	}
}