import buildDirectives from "./build-directives.js";
import Elements from "./elements.js";
import handler from "./handler/index.js";
import store from "./store/index.js";
import { log } from "../helpers.js";

/**
 * Refreshes the library
 * - Re-creates attribute maps
 * - Re-initialises stores
 * - Re-initialises handlers
 */
const refresh = (targetStore?: string) => {
	const directives = buildDirectives();

	handler.destroyHandlers();

	for (const item of directives.elements) {
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

		store.initialiseStore(
			item[0],
			item[1],
			directives.storeDirectives.get(item[1]),
		);
	}

	handler.initialiseHandlers(directives.handlerDirectives, { partial: false });
	for (const syncedEle of Elements.syncedElements) syncedEle[1]();

	log.debug("Library refreshed.");
};

export default refresh;
