import parseAttributes from "./parse-attributes.js";
import Elements from "./elements.js";
import handler from "./handler/index.js";
import store from "./store/index.js";
import { log } from "../helpers.js";

/**
 * Refreshes the library
 * - Re-creates attribute maps
 * - Re-initialises stores
 * - Re=initialises handlers
 */
const refresh = (targetStore?: string) => {
	const { elements, handlerAttributes, storeAttributes } = parseAttributes();

	Elements.handlerAttributes = handlerAttributes;

	handler.destroyHandlers();

	for (const item of elements) {
		if (!item[1]) {
			log.warn(
				"Please ensure all 'data-store' attributes have a value. This is needed to scope state, binds and handler actions.",
			);
			continue;
		}

		if (targetStore && targetStore !== item[1]) {
			continue;
		}

		const s = Elements.stores.get(item[1]);
		if (s) store.destroyStore(item[1], s);

		store.initialiseStore(item[0], item[1], storeAttributes.get(item[1]));
	}

	handler.initialiseHandlers();

	log.debug("Library refreshed.");
};

export default refresh;
