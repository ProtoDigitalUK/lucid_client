import type {
	Store,
	StoreState,
	StoreActions,
	StoreInterface,
} from "../../types/index.js";

/**
 * Gets the store interface which is passed to the store module for refined/restricted access
 */
const getStoreInterface = (
	store: Store<StoreState, StoreActions>,
): StoreInterface<StoreState, StoreActions> => {
	return {
		get state() {
			return store[0].state;
		},
		get actions() {
			return store[0].actions;
		},
		get refs() {
			return store[0].refs;
		},
	};
};

export default getStoreInterface;
