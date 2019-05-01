import {items} from "./Items.js";
import {tools} from "./Tools.js";

export let recipes = {
	axe: {
		resultingItems: [[tools.axe, 1]],
		requiredItems: [[items.smallStone, 3], [items.wood, 1]],
		recipeName: "axe",
	},
	seeds: {
		resultingItems: [[items.seeds, 1]],
		requiredItems: [[items.plant, 2]],
		recipeName: "seeds",
	},
	hoe: {
		resultingItems: [[tools.hoe, 1]],
		requiredItems: [[items.smallStone, 10], [items.wood, 4]],
		recipeName: "hoe",
	},
	grain: {
		resultingItems: [[items.seeds, 1], [items.grain, 1]],
		requiredItems: [[items.crops, 1]],
		recipeName: "grain & seeds",
	},
	barrel: {
		resultingItems: [[items.barrel, 1]],
		requiredItems: [[items.wood, 6]],
		recipeName: "barrel",
	},
};