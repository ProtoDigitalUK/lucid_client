import { createEffect } from "solid-js";
import scope from "../scope/index.js";
import Elements from "../elements.js";
import type { Store, StoreState, StoreActions } from "../../types/index.js";

/**
 * Register a createEffect for both manual and global effects
 * - Manual effects are created when their data-effect attribute exists
 * - Global effects are always created when the store initialises
 */
const registerEffects = (store: Store<StoreState, StoreActions>) => {
	const directives = Elements.storeDirectives.get(store[0].key);

	if (!directives?.effects) return;
	const effectInitialStates = new Map<string, boolean>();

	//* create effects for manual effects
	if (directives?.effects) {
		for (const effect of directives.effects) {
			const effectKey = scope.removeScope(effect);
			if (!store[0].effects.manual?.[effectKey]) continue;

			const manualKey = `manual:${effectKey}`;
			effectInitialStates.set(manualKey, false);
			createEffect(() => {
				try {
					const initial = effectInitialStates.get(manualKey);
					store[0].effects.manual[effectKey]?.({
						isInitial: initial ?? false,
					});
					if (!initial) {
						effectInitialStates.set(manualKey, true);
					}
				} catch (error) {
					console.error(error);
				}
			});
		}
	}

	//* create effects for all global effects
	if (store[0].effects.global) {
		for (const [effectKey, effectFn] of Object.entries(
			store[0].effects.global,
		)) {
			const globalKey = `global:${effectKey}`;
			effectInitialStates.set(globalKey, false);
			createEffect(() => {
				try {
					const initial = effectInitialStates.get(globalKey);
					effectFn({
						isInitial: initial ?? false,
					});
					if (!initial) {
						effectInitialStates.set(globalKey, true);
					}
				} catch (error) {
					console.error(error);
				}
			});
		}
	}
};

export default registerEffects;
