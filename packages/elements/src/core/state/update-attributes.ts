import Elements from "../elements.js";
import { stringifyState, buildAttribute } from "../../helpers.js";
import type { BindStateDirectives } from "../../types/directives.js";
import C from "../constants.js";

/**
 * Responsible for two thing:
 * 1. Updating the data-state--x="value" attribute values when the value has changed.
 * 2. Updating any data-bind attribute values where state wasnt registered via data-state, but through the store module.
 */
const updateAttributes = (
	element: Element,
	state: {
		key: string;
		value: unknown;
	},
	storeKey: string,
	bindState: BindStateDirectives | undefined,
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
	//* if there is no data-state-- attribute, this means it is state registered via the store moduel, in this case, the bind attributes will need updated.
	//* Traditionally this bind attributes update based on data-state attributes being mutated, but this wont work in this case obviously
	else {
		const tagetBinds = bindState?.get(state.key);
		if (!tagetBinds) return;

		const bindPrefix = buildAttribute(
			Elements.options.attributes.selectors.bind,
		);

		for (const attribute of tagetBinds) {
			const targetEles = document.querySelectorAll(
				`[${bindPrefix}${attribute}="${storeKey}${Elements.options.attributes.seperators.scope}${C.defaults.attributes.denote.state}${state.key}"]`,
			);
			for (const ele of targetEles) {
				if (ele.getAttribute(attribute) !== value) {
					ele.setAttribute(attribute, value);
				}
			}
		}
	}
};

export default updateAttributes;
