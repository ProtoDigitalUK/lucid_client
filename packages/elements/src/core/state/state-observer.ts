import type { Store, StoreState, StoreActions } from "../../types/index.js";
import utils from "../../utils/index.js";
import helpers from "../../utils/helpers.js";
import C from "../constants.js";

/**
 * Handles a mutation on a state attribute
 * - Updates the state
 * - Updates the attribute bindings
 */
const handleMutation = (
	target: HTMLElement,
	attribute: string,
	oldValue: string | null,
	get: Store<StoreState, StoreActions>[0],
	statePrefix: string,
) => {
	const key = attribute.slice(statePrefix.length);
	const attributeValue = target.getAttribute(attribute);
	if (attributeValue === oldValue) return;

	const value = helpers.parseStateString(attributeValue);

	get.state[key]?.[1](value);
	utils.attributes.updateBind(target, { key, value }, get.attributeMaps?.bind);
};

/**
 * Registers a mutation observer for all of the stores state attributes
 * - Updates all attribute bindings
 *
 * This allows for you to update the state attributes outside of the Elements library and Elements will keep it in sync with its state
 */
const stateObserver = (
	element: HTMLElement,
	store: Store<StoreState, StoreActions>,
): MutationObserver => {
	const [get] = store;
	const statePrefix = utils.helpers.buildAttribute(C.attributes.statePrefix);
	const stateAttributes = Array.from(get.attributeMaps?.state.keys() ?? []).map(
		(key) => `${statePrefix}${key}`,
	);

	// sync initial state to bind attributes
	for (const attribute of stateAttributes) {
		handleMutation(element, attribute, null, get, statePrefix);
	}

	// register mutation observer
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (
				mutation.type === "attributes" &&
				mutation.target instanceof HTMLElement &&
				mutation.attributeName
			) {
				handleMutation(
					mutation.target,
					mutation.attributeName,
					mutation.oldValue,
					get,
					statePrefix,
				);
			}
		}
	});

	// configure the observer
	observer.observe(element, {
		attributes: true,
		attributeFilter: stateAttributes,
		attributeOldValue: true,
		// subtree: true, //* state cannot be registered on children
	});

	return observer;
};

export default stateObserver;
