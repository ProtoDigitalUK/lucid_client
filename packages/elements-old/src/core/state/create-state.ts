import { createSignal, type Signal } from "solid-js";
import { produce } from "solid-js/store";
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
	directives: DirectiveMap | undefined,
) => {
	const stateMap = directives?.state;
	if (!stateMap) return;

	store[1](
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
