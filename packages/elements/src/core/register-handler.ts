import type { Handler } from "../types/handlers.js";
import Elements from "./elements.js";
import { log } from "../helpers.js";

/**
 * Registerss handlers for Elements
 */
const registerHandler = (handler: Handler) => {
	if (Elements.handlers.has(handler.namespace)) {
		log.warn(`Handler for namespace "${handler.namespace}" already registered`);
		return;
	}

	Elements.handlers.set(handler.namespace, handler);
	log.debug(`Handler registered for namespace "${handler.namespace}"`); //* debug here not working as registerHandler is called before start, either remove, store message or start or change how debug is toggled
};

export default registerHandler;
