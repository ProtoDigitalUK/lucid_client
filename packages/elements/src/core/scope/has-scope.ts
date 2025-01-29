import Elements from "../elements.js";

/**
 * Determines if the given value has a scope
 */
const valueHasScope = (value: string): boolean =>
	value.includes(Elements.options.attributes.seperators.scope);

export default valueHasScope;
