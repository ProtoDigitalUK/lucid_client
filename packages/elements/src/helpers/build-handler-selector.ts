import Elements from "../core/elements.js";

/**
 * Creates a selector for a handler
 */
const buildHandlerSelector = (
	namespace: string,
	specifier: string,
	action: string,
) =>
	`[${Elements.options.attributes.prefix}${Elements.options.attributes.selectors.handler}${namespace}\\.${specifier.replace(/\./g, "\\.")}="${action}"]`;

export default buildHandlerSelector;
