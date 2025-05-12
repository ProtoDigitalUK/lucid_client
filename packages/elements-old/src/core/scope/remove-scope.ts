import Elements from "../elements.js";

/**
 * Removes the scope from the given value
 */
const removeScope = (value: string): string =>
	value.split(Elements.options.attributes.seperators.scope)?.[1] ?? value;

export default removeScope;
