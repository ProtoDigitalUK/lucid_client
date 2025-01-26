import { createEffect } from "solid-js";
import scope from "../scope/index.js";
import type { Store, StoreState, StoreActions } from "../../types/index.js";

/**
 * Register a createEffect for any effect attributes
 * - When a dependency of an effect changes, the effect is re-ran
 */
const registerEffects = (store: Store<StoreState, StoreActions>) => {
	if (!store[0].attributeMaps?.effects) return;
	const effectInitialStates = new Map<string, boolean>();

	for (const effect of store[0].attributeMaps.effects) {
		const effectKey = scope.removeScope(effect);
		if (!store[0].effects[effectKey]) continue;

		effectInitialStates.set(effectKey, false);

		createEffect(() => {
			try {
				const initial = effectInitialStates.get(effectKey);
				store[0].effects[effectKey]?.({
					isInitial: initial ?? false,
				});

				if (!initial) {
					effectInitialStates.set(effectKey, true);
				}
			} catch (error) {
				console.error(error);
			}
		});
	}
};

export default registerEffects;
