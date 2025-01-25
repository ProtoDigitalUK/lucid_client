import Elements from "../elements.js";
import { stringifyState, buildAttribute } from "../../helpers.js";

/**
 * Updates the state attribute for the given element if the value has changed
 */
const updateAttributes = (
	element: Element,
	state: {
		key: string;
		value: unknown;
	},
) => {
	const statePrefix = buildAttribute(
		Elements.options.attributes.selectors.state,
	); //* 'data-state--'

	const attribute = statePrefix + state.key;
	const value = stringifyState(state.value);

	if (element.hasAttribute(attribute)) {
		if (element.getAttribute(attribute) !== value) {
			element.setAttribute(attribute, value);
		}
	}
};

export default updateAttributes;
