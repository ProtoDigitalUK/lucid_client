import { createEffect } from "solid-js";
import scope from "../scope/index.js";
import type {
	Store,
	StoreState,
	StoreActions,
	DirectiveMap,
} from "../../types/index.js";

const registerEffects = (
	store: Store<StoreState, StoreActions>,
	directives: DirectiveMap | undefined,
) => {
	const effectInitialStates = new Map<string, boolean>();

	//* create effects for manual effects
	if (directives?.effects) {
		for (const effect of directives.effects) {
			if (!store[0].effects.manual?.[effect]) continue;

			const manualKey = `manual:${effect}`;
			if (store[0].effectsRegistered.has(manualKey)) continue;

			effectInitialStates.set(manualKey, false);
			createEffect(() => {
				try {
					const initial = effectInitialStates.get(manualKey);
					store[0].effects.manual[effect]?.({
						isInitial: initial ?? false,
					});
					if (!initial) {
						effectInitialStates.set(manualKey, true);
					}
				} catch (error) {
					console.error(error);
				}
			});

			store[0].effectsRegistered.add(manualKey);
		}
	}

	//* create effects for all global effects
	if (store[0].effects.global) {
		for (const [effectKey, effectFn] of Object.entries(
			store[0].effects.global,
		)) {
			const globalKey = `global:${effectKey}`;
			if (store[0].effectsRegistered.has(globalKey)) continue;

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

			store[0].effectsRegistered.add(globalKey);
		}
	}
};

export default registerEffects;
