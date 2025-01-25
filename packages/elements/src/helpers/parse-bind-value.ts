import C from "../core/constants.js";
import { extractBaseStateKey } from "../helpers.js";

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
): {
	type: "state" | "action";
	value: string;
} | null => {
	if (value.includes(C.defaults.attributes.denote.action)) {
		return { type: "action", value: value };
	}

	if (value.includes(C.defaults.attributes.denote.state)) {
		return {
			type: "state",
			value: extractBaseStateKey(value),
		};
	}

	return null;
};

export default parseBindValue;
