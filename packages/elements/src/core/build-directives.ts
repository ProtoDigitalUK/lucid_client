import type {
	HandlerDirectives,
	StoreDirectives,
	ScopedMember,
	DirectiveMap,
} from "../types/index.js";
import {
	deepCollectAttributes,
	parseStateString,
	buildAttribute,
	inferMemberValue,
} from "../helpers.js";
import Elements from "./elements.js";
import scope from "./scope/index.js";
import C from "./constants.js";

const buildDirectives = (
	target: Element = document.body,
): {
	elements: Array<[Element, string | null]>;
	handlerDirectives: HandlerDirectives;
	storeDirectives: StoreDirectives;
} => {
	const handlerDirectives: HandlerDirectives = new Map();
	const storeDirectives: StoreDirectives = new Map();
	const storeElements: Array<[Element, string]> = [];

	const prefix = {
		store: buildAttribute(Elements.options.attributes.selectors.store),
		state: buildAttribute(Elements.options.attributes.selectors.state),
		bind: buildAttribute(Elements.options.attributes.selectors.bind),
		handler: buildAttribute(Elements.options.attributes.selectors.handler),
		effect: buildAttribute(Elements.options.attributes.selectors.effect),
	};

	// helper to ensure store exists and is initialised
	const ensureStore = (storeName: string) => {
		if (!storeDirectives.has(storeName)) {
			storeDirectives.set(storeName, {
				scope: storeName,
				state: new Map(),
				bindState: new Map(),
				bindActions: new Map(),
				effects: new Set(),
			});
		}
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return storeDirectives.get(storeName)!;
	};

	// helper to ensure state exists in store
	const ensureState = (
		storeDirectives: DirectiveMap,
		stateName: string,
		value?: string,
	) => {
		if (!storeDirectives.state.has(stateName)) {
			storeDirectives.state.set(
				stateName,
				value !== undefined ? parseStateString(value) : undefined,
			);
		}
	};

	// --------------------------------------------
	// Initialise child and taget stores and their state
	const storeEles = target.querySelectorAll(`[${prefix.store}]`);
	const targetStore = target.getAttribute(prefix.store);

	if (targetStore) {
		storeElements.push([target, targetStore]);
		const store = ensureStore(targetStore);

		for (const attr of target.attributes) {
			if (attr.name.startsWith(prefix.state)) {
				const stateName = attr.name.slice(prefix.state.length);
				ensureState(store, stateName, attr.value);
			}
		}
	}
	for (const element of storeEles) {
		const storeValue = element.getAttribute(prefix.store);
		if (!storeValue) continue;

		storeElements.push([element, storeValue]);
		const store = ensureStore(storeValue);

		// Process state attributes
		for (const attr of element.attributes) {
			if (attr.name.startsWith(prefix.state)) {
				const stateName = attr.name.slice(prefix.state.length);
				ensureState(store, stateName, attr.value);
			}
		}
	}

	// --------------------------------------------
	// Collect and process all attribute directives (bind, handler, and effect)
	const attributes = deepCollectAttributes(target, [
		prefix.bind,
		prefix.handler,
		prefix.effect,
	]);

	for (const attribute of attributes) {
		const { name, value } = attribute;

		if (!scope.valueHasScope(value)) continue;
		const memberValue = value as ScopedMember;

		//* add state to directives if it hasnt been already, with the value undefined
		const parsedMember = inferMemberValue(memberValue);
		if (parsedMember && parsedMember.type === "state") {
			const store = ensureStore(parsedMember.scope);
			ensureState(store, parsedMember.key);
		}

		// Handle binds
		if (name.startsWith(prefix.bind)) {
			const bindName = name.slice(prefix.bind.length);
			if (!parsedMember) continue;

			const store = ensureStore(parsedMember.scope);

			if (parsedMember.type === "state") {
				if (!store.bindState.has(parsedMember.key)) {
					store.bindState.set(parsedMember.key, new Set());
				}
				store.bindState.get(parsedMember.key)?.add(bindName);
			} else if (parsedMember.type === "action") {
				if (!store.bindActions.has(parsedMember.key)) {
					store.bindActions.set(parsedMember.key, new Set());
				}
				store.bindActions.get(parsedMember.key)?.add(bindName);
			}
		}
		// Handle handlers
		else if (name.startsWith(prefix.handler)) {
			const handlerParts = name
				.slice(prefix.handler.length)
				.split(Elements.options.attributes.seperators.handler);

			if (handlerParts.length >= 1) {
				const namespace = handlerParts[0];
				const specifier =
					handlerParts.length >= 2
						? handlerParts
								.slice(1)
								.join(Elements.options.attributes.seperators.handler)
						: C.defaults.specifier;

				if (!namespace) continue;

				const [storeScope, member] = scope.splitValue(value);
				if (!storeScope || !member) continue;

				if (!handlerDirectives.has(namespace)) {
					handlerDirectives.set(namespace, new Map());
				}

				const namespaceMap = handlerDirectives.get(namespace);
				if (namespaceMap) {
					if (!namespaceMap.has(specifier)) {
						namespaceMap.set(specifier, new Set());
					}
					namespaceMap.get(specifier)?.add(memberValue);
				}
			}
		}
		// Handle effects
		else if (name.startsWith(prefix.effect)) {
			const [storeScope, member] = scope.splitValue(value);
			if (!storeScope || !member) continue;

			const store = ensureStore(storeScope);
			store.effects.add(value);
		}
	}

	return {
		elements: storeElements,
		handlerDirectives: handlerDirectives,
		storeDirectives: storeDirectives,
	};
};

export default buildDirectives;
