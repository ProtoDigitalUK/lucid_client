import type { AttributeMaps } from "../../types/index.js";
import C from "../constants.js";
import Elements from "../elements.js";
import scope from "../scope/index.js";
import {
	evaluatePathValue,
	inferValueType,
	stringifyState,
	buildAttribute,
} from "../../helpers.js";

/**
 * Updates a single element's attribute based on its binding value
 */
const resolveBindingValue = (
	element: Element,
	attribute: string,
	targetKey: string,
	state: {
		key: string;
		value: unknown;
	},
	valueType: string,
	valueCache: Map<string, string>,
) => {
	const bindValue = element.getAttribute(attribute);
	if (!bindValue) return;

	let value: string;
	if (valueCache.has(bindValue)) {
		value = valueCache.get(bindValue) as string;
	} else {
		let stringifyValue: unknown;

		if (valueType === "object" || valueType === "array") {
			stringifyValue = evaluatePathValue(
				state.value as Record<string, unknown> | Array<unknown>,
				bindValue,
			);
		} else {
			stringifyValue = state.value;
		}

		value = stringifyState(stringifyValue);
		valueCache.set(bindValue, value);
	}

	element.setAttribute(targetKey, value);
};

/**
 * Updates the attribute bindings for state. Updates the target element and all children.
 */
const updateStateAttributes = (
	parent: Element,
	state: {
		key: string;
		value: unknown;
	},
	attributeMaps: AttributeMaps | undefined,
) => {
	if (!attributeMaps?.bindState) return;
	//* prefix it with the state key $ so it matches that in the bindState map
	const stateWithPrefix = `${C.defaults.attributes.denote.state}${state.key}`;

	const stateKey = attributeMaps.scope
		? scope.scopeValue(attributeMaps.scope, stateWithPrefix)
		: stateWithPrefix;

	const affectedAttributes = attributeMaps.bindState.get(stateKey);
	if (!affectedAttributes) return;

	const bindPrefix = buildAttribute(Elements.options.attributes.selectors.bind);
	const valueType = inferValueType(state.value);
	const valueCache = new Map<string, string>();

	for (const targetKey of affectedAttributes) {
		const attribute = `${bindPrefix}${targetKey}`;
		const selector = `[${attribute}^="${stateKey}"]`;

		if (parent.matches(selector)) {
			resolveBindingValue(
				parent,
				attribute,
				targetKey,
				state,
				valueType,
				valueCache,
			);
		}

		for (const element of parent.querySelectorAll(selector)) {
			resolveBindingValue(
				element,
				attribute,
				targetKey,
				state,
				valueType,
				valueCache,
			);
		}
	}
};

export default updateStateAttributes;
