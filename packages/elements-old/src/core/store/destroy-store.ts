import type { Store, StoreState, StoreActions } from "../../types/index.js";
import Elements from "../elements.js";
import { log } from "../../helpers.js";

/**
 * Removes the store and disposes the SolidJS createRoot
 */
const destroyStore = (key: string, store: Store<StoreState, StoreActions>) => {
	store[0].stateObserver?.disconnect();
	store[0].dispose();
	store[0].cleanup?.();
	Elements.stores.delete(key);

	log.debug(`The store with the key "${key}" has been destroyed.`);
};

export default destroyStore;
