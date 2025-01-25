import Elements from "../core/elements.js";

/**
 * Creates a selector for a handler
 */
const buildHandlerSelector = (
	namespace: string,
	specifier: string,
	action: string,
) => {
	const baseSelector = `${Elements.options.attributes.prefix}${Elements.options.attributes.selectors.handler}${namespace}`;

	const specifierPart =
		specifier === "" ? "" : `\\.${specifier.replace(/\./g, "\\.")}`;

	return `[${baseSelector}${specifierPart}="${action}"]`;
};

export default buildHandlerSelector;
