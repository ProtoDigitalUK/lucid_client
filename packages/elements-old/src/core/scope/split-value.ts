import Elements from "../elements.js";

/**
 * Splits the value by the scope seperator
 */
const splitValue = (value: string) =>
	value.split(Elements.options.attributes.seperators.scope);

export default splitValue;
