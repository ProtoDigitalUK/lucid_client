import type {
	Store,
	StoreState,
	StoreActions,
	DirectiveMap,
} from "../../types/index.js";
import { batch } from "solid-js";
import { parseStateString, buildAttribute } from "../../helpers.js";
import bind from "../bind/index.js";
import Elements from "../elements.js";

/**
 * Handles a mutation on a state attribute
 * - Updates the state
 * - Updates the attribute bindings
 */
export const handleMutation = (
	target: Element,
	attribute: string,
	oldValue: string | null,
	get: Store<StoreState, StoreActions>[0],
	statePrefix: string,
	directives: DirectiveMap | undefined,
	initial: boolean,
) => {
	const key = attribute.slice(statePrefix.length);
	const attributeValue = target.getAttribute(attribute);

	if (attributeValue === oldValue) return;

	const value = parseStateString(attributeValue);

	if (!directives) return;

	//* we only need need to update the state signal when the observer calls this, on init, the default value is already populated in the signal
	if (!initial) get.state[key]?.[1](value);

	bind.updateStateAttributes(target, { key, value }, directives);
};

/**
 * Registers a mutation observer for all of the stores state attributes
 * - Updates all attribute bindings
 *
 * This allows for you to update the state attributes outside of the Elements library and Elements will keep it in sync with its state
 */
const stateObserver = (
	element: Element,
	store: Store<StoreState, StoreActions>,
	directives: DirectiveMap | undefined,
): MutationObserver => {
	const statePrefix = buildAttribute(
		Elements.options.attributes.selectors.state,
	);

	const stateAttributes = Array.from(directives?.state.keys() ?? []).map(
		(key) => `${statePrefix}${key}`,
	);

	// sync initial state to bind attributes
	for (const attribute of stateAttributes) {
		handleMutation(
			element,
			attribute,
			null,
			store[0],
			statePrefix,
			directives,
			true,
		);
	}

	// register mutation observer
	const observer = new MutationObserver((mutations) => {
		batch(() => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					mutation.target instanceof Element &&
					mutation.attributeName
				) {
					handleMutation(
						mutation.target,
						mutation.attributeName,
						mutation.oldValue,
						store[0],
						statePrefix,
						directives,
						false,
					);
				}
			}
		});
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
