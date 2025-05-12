import Elements from "../elements.js";

/**
 * Determines if the given value is scoped or not
 */
const valueIsScoped = (scope: string, value: string): boolean =>
	value.startsWith(`${scope}${Elements.options.attributes.seperators.scope}`);

export default valueIsScoped;
