import C from "../core/constants.js";
import scope from "../core/scope/index.js";
import { extractBaseStateKey } from "../helpers.js";
import type { ScopedState, ScopedAction } from "../types/directives.js";

/**
 * Determines if the value is an action or state and returns the value
 * - If the attribute value is a dot notation, return the first part
 * - If the attribute value is a bracket notation, return the first part
 * - If the value contains @, its action
 * - If the value contains $, its state
 *
 * These are returned with the scope still attached
 */
const parseBindValue = (
	value: string,
):
	| {
			scope: string;
			type: "action";
			value: ScopedAction;
	  }
	| {
			scope: string;
			type: "state";
			value: ScopedState;
	  }
	| null => {
	const [storeScope, member] = scope.splitValue(value);
	if (!storeScope || !member) return null;

	if (value.includes(C.defaults.attributes.denote.action)) {
		return { type: "action", value: value as ScopedAction, scope: storeScope };
	}

	if (value.includes(C.defaults.attributes.denote.state)) {
		return {
			type: "state",
			value: extractBaseStateKey(value),
			scope: storeScope,
		};
	}

	return null;
};

export default parseBindValue;
