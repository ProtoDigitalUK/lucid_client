import { createSignal, type Signal } from "solid-js";
import { produce } from "solid-js/store";
import Elements from "../elements.js";
import type {
	Store,
	StoreState,
	StoreActions,
	DirectiveMap,
} from "../../types/index.js";

/**
 * Creates a state object for the store
 * - For each state attribute in the attribute map, create a signal and add it to the state object
 */
const createState = (
	store: Store<StoreState, StoreActions>,
	directives?: DirectiveMap,
) => {
	const [storeGet, storeSet] = store;
	const targetDirectives = directives
		? directives
		: Elements.storeDirectives.get(storeGet.key);

	const stateMap = targetDirectives?.state;
	if (!stateMap) return;

	storeSet(
		produce((s) => {
			for (const [key, defaultValue] of stateMap.entries()) {
				if (s.state[key] === undefined) {
					s.state[key] = createSignal(defaultValue) as Signal<unknown>;
				}
			}
		}),
	);
};

export default createState;
