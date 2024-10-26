import type { Store, StoreState, StoreActions } from "./index.js";

export type Handler = {
	/**
	 * A unique namespace for the handler
	 */
	namespace: string;
	/**
	 * For each store, this is called on initialisation
	 */
	initialise: (store: Store<StoreState, StoreActions>) => void;
	/**
	 * When a store is destroyed, this is called. This can be used to remove event listeners, etc.
	 */
	destroy?: (store: Store<StoreState, StoreActions>) => void;
};

export type Handlers = Map<string, Handler>;
