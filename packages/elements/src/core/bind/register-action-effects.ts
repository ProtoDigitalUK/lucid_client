import { createEffect } from "solid-js";
import type { Store, StoreState, StoreActions } from "../../types/index.js";
import utils from "../../utils/index.js";
import C from "../constants.js";
import Elements from "../elements.js";
import scope from "../scope/index.js";

/**
 * Register the createEffect for any action binds
 * - When the state the actions call get updated this will update the bind attribute values
 */
const registerActionEffects = (store: Store<StoreState, StoreActions>) => {
	if (!store[0].attributeMaps?.bindActions) return;

	for (const [action, attributes] of store[0].attributeMaps.bindActions) {
		const actionKey = scope
			.removeScope(action)
			.replace(C.defaults.attributes.denote.action, "");

		if (!store[0].actions[actionKey]) continue;

		for (const attr of attributes.values()) {
			const selector = `[${utils.helpers.buildAttribute(Elements.options.attributes.selectors.bind)}${attr}="${action}"]`;
			const targets = document.querySelectorAll(selector);

			createEffect(async () => {
				try {
					const result = store[0].actions[actionKey]?.();
					const resolvedResult = await Promise.resolve(result);
					const stringValue = utils.helpers.stringifyState(resolvedResult);
					for (const target of targets) target.setAttribute(attr, stringValue);
				} catch (error) {
					console.error(error);
				}
			});
		}
	}
};

export default registerActionEffects;
