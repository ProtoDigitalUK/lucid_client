import Elements from "../core/elements.js";

/**
 * Prepends the attribute prefix to the given attribute
 */
const buildAttribute = (attribute: string) =>
	`${Elements.options.attributes.prefix}${attribute}`;

export default buildAttribute;
