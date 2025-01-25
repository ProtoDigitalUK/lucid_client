import type { Store, StoreState, StoreActions } from "../../types/index.js";
import { createEffect, type Signal } from "solid-js";
import state from "./index.js";
import { inferValueType } from "../../helpers.js";

/**
 * Registers effect for each state signal
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings
 */
const watchState = (
	element: Element,
	store: Store<StoreState, StoreActions>,
) => {
	for (const [key, signal] of Object.entries(store[0].state))
		registerStateEffect(element, key, signal);
};

/**
 * Register effect for state signal updates to update the state attributes
 * - If we're updating a array or object, do nothing.
 * - If we're updating a string, number, boolean, etc, we update the state attribute.
 *
 * Attribute bindings are update by the state-observer.
 */
const registerStateEffect = (
	element: Element,
	key: string,
	signal: Signal<unknown>,
) => {
	const type = inferValueType(signal[0]());
	if (type === "object" || type === "array") return;

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
