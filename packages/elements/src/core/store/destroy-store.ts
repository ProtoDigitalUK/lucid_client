import type { Store, StoreState, StoreActions } from "../../types/index.js";
import Elements from "../elements.js";
import utils from "../../utils/index.js";

/**
 * Removes the store and disposes the SolidJS createRoot
 */
const destroyStore = (key: string, store: Store<StoreState, StoreActions>) => {
	store[0].stateObserver?.disconnect();
	store[0].dispose();
	Elements.stores.delete(key);

	utils.log.debug(`The store with the key "${key}" has been destroyed.`);
};

export default destroyStore;
