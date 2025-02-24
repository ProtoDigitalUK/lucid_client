import Elements from "./elements.js";
import s from "./store/index.js";
import handler from "./handler/index.js";

/**
 * Destroys the library
 * - Calls destroy on all handlers - depending on implementation this removes event listeners, etc.
 * - Removes the stores and destroys the SolidJS createRoot
 * - Removes the observer
 */
const destroy = () => {
	handler.destroyHandlers();
	Elements.stores.forEach((store, key) => s.destroyStore(key, store));
	for (const syncedEle of Elements.syncedElements) syncedEle[1]();
};

export default destroy;
