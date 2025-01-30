import { createSignal, type Signal } from "solid-js";
import { produce } from "solid-js/store";
import Elements from "../elements.js";
import type { Store, StoreState, StoreActions } from "../../types/index.js";

/**
 * Creates a state object for the store
 * - For each state attribute in the attribute map, create a signal and add it to the state object
 */
const createState = (store: Store<StoreState, StoreActions>) => {
	const [storeGet, storeSet] = store;
	const directives = Elements.storeDirectives.get(storeGet.key);

	const stateMap = directives?.state;
	if (!stateMap) return;

	storeSet(
		produce((s) => {
			for (const [key, defaultValue] of stateMap.entries()) {
				s.state[key] = createSignal(defaultValue) as Signal<unknown>;
			}
		}),
	);
};

export default createState;
