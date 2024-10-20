import type { Store } from "../../types/index.js";
import { createEffect, type Signal } from "solid-js";
import utils from "../../utils/index.js";

/**
 * Registers effect for each state signal
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings
 */
const watchState = (
	element: HTMLElement,
	store: Store<Record<string, unknown>>,
) => {
	for (const [key, signal] of Object.entries(store[0].state))
		registerStateEffect(element, key, signal);
};

/**
 * Register effect for state signal updates
 * - Updates the state attributes for the parent and all children
 * - Updates attribute bindings (no longer the case - the state observer does this)
 */
const registerStateEffect = (
	element: HTMLElement,
	key: string,
	signal: Signal<unknown>,
) => {
	createEffect(() => {
		utils.attributes.updateState(element, {
			key: key,
			value: signal[0](),
		});
	});
};

export default watchState;
