import { createEffect } from "solid-js";
import type {
	Store,
	StoreState,
	StoreActions,
	DirectiveMap,
} from "../../types/index.js";
import C from "../constants.js";
import Elements from "../elements.js";
import { stringifyState, buildAttribute } from "../../helpers.js";
import scope from "../scope/index.js";

/**
 * Register the createEffect for any action binds
 * - When the state the actions call get updated this will update the bind attribute values
 */
const registerActionEffects = (
	store: Store<StoreState, StoreActions>,
	directives: DirectiveMap | undefined,
) => {
	if (!directives?.bindActions) return;

	for (const [action, attributes] of directives.bindActions) {
		const actionWithPrefix = `${C.defaults.attributes.denote.action}${action}`;
		const actionKey = scope.scopeValue(directives.scope, actionWithPrefix);

		if (!store[0].actions[action]) continue;

		for (const attr of attributes.values()) {
			const selector = `[${buildAttribute(Elements.options.attributes.selectors.bind)}${attr}="${actionKey}"]`;
			const targets = document.querySelectorAll(selector);

			createEffect(async () => {
				try {
					const result = store[0].actions[action]?.();
					const resolvedResult = await Promise.resolve(result);
					const stringValue = stringifyState(resolvedResult);
					for (const target of targets) target.setAttribute(attr, stringValue);
				} catch (error) {
					console.error(error);
				}
			});
		}
	}
};

export default registerActionEffects;
