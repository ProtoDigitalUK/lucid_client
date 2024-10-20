import type { ElementsInstance } from "../types/index.js";

/**
 * Stores the state of the Elements library
 */
const Elements: ElementsInstance = {
	options: {
		debug: false,
		attributePrefix: "data-",
	},
	started: false,
	plugins: [],
	stores: new Map(),
	storeModules: new Map(),
	trackedElements: new Set(),
};

export default Elements;
