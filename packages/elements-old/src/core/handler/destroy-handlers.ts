import Elements from "../elements.js";

/**
 * For each used handler, destroy it.
 */
const destroyHandlers = () => {
	for (const [_, item] of Elements.handlers) {
		if (item.dispose) item.dispose();
	}
};

export default destroyHandlers;
