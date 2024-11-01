import type {
	HandlerAttributesMap,
	StoreAttributesMap,
} from "../types/index.js";
import utils from "../utils/index.js";
import Elements from "./elements.js";
import scope from "./scope/index.js";

/**
 * Responsible for extracting all the Elements attributes and config required for setup
 * - Gets all elements with data-element attribute and their store key
 * - Creates a store attribute map containing all of the state, binds and handlers for each store
 * - Creates a handler attribute map containing all of the handlers for each handler namespace
 */
const parseAttributes = (): {
	elements: Array<[Element, string | null]>;
	handlerAttributes: HandlerAttributesMap;
	storeAttributes: StoreAttributesMap;
} => {
	const handlerAttributes: HandlerAttributesMap = new Map();
	const storeAttributes: StoreAttributesMap = new Map();

	const prefix = {
		store: utils.helpers.buildAttribute(
			Elements.options.attributes.selectors.element,
		),
		state: utils.helpers.buildAttribute(
			Elements.options.attributes.selectors.state,
		),
		bind: utils.helpers.buildAttribute(
			Elements.options.attributes.selectors.bind,
		),
		handler: utils.helpers.buildAttribute(
			Elements.options.attributes.selectors.handler,
		),
	};

	const storeEles = document.querySelectorAll(`[${prefix.store}]`);

	for (const storeEle of storeEles) {
		const scopeValue = storeEle.getAttribute(prefix.store);
		if (!scopeValue) continue;

		//* create store map
		storeAttributes.set(scopeValue, {
			scope: scopeValue,
			state: new Map(),
			bindState: new Map(),
			bindActions: new Map(),
		});

		const storeMap = storeAttributes.get(scopeValue);
		if (!storeMap) continue;

		//* create state map - state can only be defined on the parent
		for (const attribute of storeEle.attributes) {
			const { name, value } = attribute;
			if (name.startsWith(prefix.state)) {
				const stateName = name.slice(prefix.state.length);
				storeMap.state.set(stateName, utils.helpers.parseStateString(value));
			}
		}

		//* process all of the stores attributes and childrens attributes recursively
		const allAttributes = utils.helpers.deepCollectAttr(storeEle);

		for (const attribute of allAttributes) {
			const { name, value } = attribute;

			//* handle binds
			if (name.startsWith(prefix.bind)) {
				const bindName = name.slice(prefix.bind.length);
				const bindValue = utils.helpers.parseBindValue(value);
				const attrScopeValue = scope.splitValue(bindValue.value)[0];

				//* skip if scope doesn't match current store
				if (!attrScopeValue || attrScopeValue !== scopeValue) continue;

				//* handle state bindings
				if (bindValue.type === "state") {
					if (!storeMap.bindState.has(bindValue.value)) {
						storeMap.bindState.set(bindValue.value, new Set());
					}
					storeMap.bindState.get(bindValue.value)?.add(bindName);
				}
				//* handle action bindings
				else {
					if (!storeMap.bindActions.has(bindValue.value)) {
						storeMap.bindActions.set(bindValue.value, new Set());
					}
					storeMap.bindActions.get(bindValue.value)?.add(bindName);
				}
			}
			//* handle handlers
			else if (name.startsWith(prefix.handler)) {
				const handlerParts = name
					.slice(prefix.handler.length)
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
	}

	return {
		elements: Array.from(storeEles).map((element) => [
			element,
			element.getAttribute(
				utils.helpers.buildAttribute(
					Elements.options.attributes.selectors.element,
				),
			),
		]),
		handlerAttributes,
		storeAttributes,
	};
};

export default parseAttributes;
