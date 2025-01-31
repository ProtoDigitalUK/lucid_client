import type { Store, StoreState, StoreActions } from "../../types/index.js";
import { createEffect, type Signal } from "solid-js";
import state from "./index.js";
import { inferValueType } from "../../helpers.js";
import { produce } from "solid-js/store";

/**
 * Registers effect for each state signal
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings
 * - If we're updating a array or object, do nothing.
 * - If we're updating a string, number, boolean, etc, we update the state attribute.
 */
const watchState = (
	element: Element,
	store: Store<StoreState, StoreActions>,
) => {
	const state = store[0].state;

	for (const [key, signal] of Object.entries(state)) {
		// check if the state has already had an effect registered for it
		if (store[0].stateRegisteredEffects.has(key)) continue;

		const type = inferValueType(signal[0]());
		if (type === "object" || type === "array") return;

		registerStateEffect(element, key, signal);

		store[1](
			produce((s) => {
				s.stateRegisteredEffects.add(key);
			}),
		);
	}
};

/**
 * Register effect for state signal updates to update the state attributes

 *
 * Attribute bindings are update by the state-observer.
 */
const registerStateEffect = (
	element: Element,
	key: string,
	signal: Signal<unknown>,
) => {
	createEffect(
		() => {
			state.updateAttributes(element, {
				key: key,
				value: signal[0](),
			});
		},
		undefined,
		{
			name: `State key: ${key} effect`,
		},
	);
};

export default watchState;
