import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import type {
	Store,
	StoreData,
	StoreModule,
	StoreActions,
	StoreState,
	AttributeMaps,
} from "../../types/store.js";
import { log } from "../../helpers.js";
import state from "../state/index.js";
import ref from "../ref/index.js";
import Elements from "../elements.js";
import getStoreInterface from "./get-store-interface.js";
import bind from "../bind/index.js";

/**
 * Creates a store for the given element if one hasnt already been specified.
 * - Populates the store with attribute maps.
 * - Creates state.
 * - Observes state.
 * - Creates refs.
 */
const initialiseStore = (
	element: Element,
	storeKey: string,
	attributeMaps?: AttributeMaps,
) => {
	createRoot((dispose) => {
		// -----------------
		// sreate store
		const store = createStore<StoreData<StoreState, StoreActions>>({
			initialised: false,
			dispose: dispose,
			attributeMaps: attributeMaps,
			state: {},
			actions: {},
			refs: new Map(),
		}) satisfies Store<StoreState, StoreActions>;

		// get store module and update the store
		if (Elements.storeModules.has(storeKey)) {
			const storeModuleFn = Elements.storeModules.get(storeKey) as StoreModule<
				StoreState,
				StoreActions
			>; // wrong generic type - doesnt matter currently
			const storeModule = storeModuleFn(getStoreInterface(store));

			log.debug(`Store module found for key "${storeKey}"`);

			if (storeModule.state) store[1]("state", storeModule.state);
			if (storeModule.actions) store[1]("actions", storeModule.actions);
		}

		// -----------------
		// set data
		store[1]("stateObserver", state.stateObserver(element, store));

		// -----------------
		// handle state, attribute bindings
		state.createState(store);
		state.watchState(element, store);
		ref.createRefs(element, store);
		bind.registerActionEffects(store);

		// -----------------
		// update Elements instance
		Elements.stores.set(storeKey, store);
		Elements.trackedElements.add(element);

		store[1]("initialised", true);
		void store[0].actions.init?.();

		log.debug(
			`Store initialised for element "${element.id || element.tagName}" with key "${storeKey}"`,
		);
	});
};

export default initialiseStore;
