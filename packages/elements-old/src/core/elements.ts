import type { ElementsInstance } from "../types/index.js";
import C from "./constants.js";

/**
 * Stores the state of the Elements library
 */
const Elements: ElementsInstance = {
	options: {
		debug: C.defaults.debug,
		attributes: C.defaults.attributes,
	},
	started: false,
	handlers: new Map(),
	stores: new Map(),
	storeModules: new Map(),
	syncedElements: new Map(),
};

export default Elements;
