import initialiseStore from "./initialise-store.js";
import registerStoreObserver from "./remove-store-observer.js";
import getStoreInterface from "./get-store-interface.js";
import destroyStore from "./destroy-store.js";

const store = {
	initialiseStore,
	registerStoreObserver,
	getStoreInterface,
	destroyStore,
};

export default store;
