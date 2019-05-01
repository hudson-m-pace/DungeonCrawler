export let tools = {
	empty: {
		itemName: "empty",
		itemType: "tool",
		stackSize: 1,
	},
	axe: {
		itemName: "axe",
		itemType: "tool",
		stackSize: 1,
	},
	hoe: {
		itemName: "hoe",
		itemType: "tool",
		stackSize: 1,
	},
};

export function getToolByName(name) {
	for (let tool in tools) {
		if (tools[tool].itemName === name) {
			return tools[tool];
		}
	}
}