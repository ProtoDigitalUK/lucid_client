import utils from "../../utils/index.js";
import Elements from "../elements.js";
import type { HandlerAttributesMap } from "../../types/index.js";

/**
 * Creates the map of all handlers attributes.
 */
const createAttributeMap = (): HandlerAttributesMap => {
	const handlerPrefix = utils.helpers.buildAttribute(
		Elements.options.attributes.selectors.handler,
	);
	const elements = document.querySelectorAll("*"); //* dont think there is a nice way to select all data-handler-- elements :(
	const handlers: HandlerAttributesMap = new Map();

	for (const element of elements) {
		for (const attribute of element.attributes) {
			if (attribute.name.startsWith(handlerPrefix)) {
				const handlerParts = attribute.name
					.slice(handlerPrefix.length)
					.split(Elements.options.attributes.seperators.handler);

				if (handlerParts.length === 2) {
					const [namespace, specifier] = handlerParts;
					if (!namespace || !specifier) continue;

					if (!handlers.has(namespace)) {
						handlers.set(namespace, new Map());
					}

					const namespaceMap = handlers.get(namespace);
					if (namespaceMap) {
						if (!namespaceMap.has(specifier)) {
							namespaceMap.set(specifier, new Set());
						}
						namespaceMap.get(specifier)?.add(attribute.value);
					}
				}
			}
		}
	}

	return handlers;
};

export default createAttributeMap;
