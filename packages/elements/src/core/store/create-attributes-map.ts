import type {
	BindAttributesMap,
	HandlerAttributesMap,
	StateAttribtuesMap,
} from "../../types/index.js";
import Elements from "../elements.js";
import s from "../scope/index.js";
import utils from "../../utils/index.js";

/**
 * Recursively build all attribute maps for a given element
 */
const createAttributesMap = (
	element: HTMLElement,
): {
	scope: string | null;
	state: StateAttribtuesMap;
	bind: BindAttributesMap;
	handler: HandlerAttributesMap;
} => {
	const scope =
		element.getAttribute(
			utils.helpers.buildAttribute(Elements.options.attributes.selectors.scope),
		) ?? null;
	const stateAttributes: StateAttribtuesMap = new Map();
	const bindAttributes: BindAttributesMap = new Map();
	const handlerAttributes: HandlerAttributesMap = new Map();

	if (
		!element.hasAttribute(
			utils.helpers.buildAttribute(
				Elements.options.attributes.selectors.element,
			),
		)
	) {
		utils.log.warn(
			`The element has no "${utils.helpers.buildAttribute(Elements.options.attributes.selectors.element)}" attribute.`,
		);
		return {
			scope: scope,
			state: stateAttributes,
			bind: bindAttributes,
			handler: handlerAttributes,
		};
	}

	const statePrefix = utils.helpers.buildAttribute(
		Elements.options.attributes.selectors.state,
	); //* 'data-state--'
	const bindPrefix = utils.helpers.buildAttribute(
		Elements.options.attributes.selectors.bind,
	); //* 'data-bind--'
	const handlerPrefix = utils.helpers.buildAttribute(
		Elements.options.attributes.selectors.handler,
	); //* 'data-handler--'

	//* for state bindings - state can only be defined on the parent
	for (const attr of element.attributes) {
		const { name, value } = attr;
		if (name.startsWith(statePrefix)) {
			const stateName = name.slice(statePrefix.length);
			stateAttributes.set(stateName, utils.helpers.parseStateString(value));
		}
	}

	//* binds and handlers can be defined on the element or its children, these can and should be scoped if scope is defined
	for (const attr of utils.helpers.deepCollectAttr(element)) {
		const { name, value } = attr;

		//* dont track the attribute if scope is defined on the parent, but the attribute value isnt scoped:
		if (scope && !s.valueIsScoped(scope, value)) continue;

		// TODO: for binds and maybe handlers if possible, we should try and determine if they belong to the current store,
		//       based on the state they reference, or in the case of handlers the action or state they reference.
		//       THis doesnt affect how any thing works, just reduces the amount of data we need to track.

		//* for binds
		if (name.startsWith(bindPrefix)) {
			const bindName = name.slice(bindPrefix.length);

			const stateKey = utils.helpers.stateFromAttrValue(value);
			if (!bindAttributes.has(stateKey)) {
				bindAttributes.set(stateKey, new Set());
			}
			bindAttributes.get(stateKey)?.add(bindName);
		}
		//* for handlers
		else if (name.startsWith(handlerPrefix)) {
			const handlerParts = name
				.slice(handlerPrefix.length)
				.split(Elements.options.attributes.seperators.handler);
			if (handlerParts.length === 2) {
				const [namespace, specifier] = handlerParts;
				if (!namespace || !specifier) continue;

				if (!handlerAttributes.has(namespace)) {
					handlerAttributes.set(namespace, new Map());
				}

				const namespaceMap = handlerAttributes.get(namespace);
				if (namespaceMap) {
					if (!namespaceMap.has(specifier)) {
						namespaceMap.set(specifier, new Set());
					}
					namespaceMap.get(specifier)?.add(value);
				}
			}
		}
	}

	return {
		scope: scope,
		state: stateAttributes,
		bind: bindAttributes,
		handler: handlerAttributes,
	};
};

export default createAttributesMap;
