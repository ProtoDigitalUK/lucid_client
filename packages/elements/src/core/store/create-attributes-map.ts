import type {
	BindActionAttributeMap,
	BindStateAttributesMap,
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
	bind: BindStateAttributesMap;
	bindActions: BindActionAttributeMap;
} => {
	const scope =
		element.getAttribute(
			utils.helpers.buildAttribute(
				Elements.options.attributes.selectors.element,
			),
		) ?? null;
	const stateAttributes: StateAttribtuesMap = new Map();
	const bindAttributes: BindStateAttributesMap = new Map();
	const bindActionsAttributes: BindActionAttributeMap = new Map();

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
			bindActions: bindActionsAttributes,
		};
	}

	const statePrefix = utils.helpers.buildAttribute(
		Elements.options.attributes.selectors.state,
	); //* 'data-state--'
	const bindPrefix = utils.helpers.buildAttribute(
		Elements.options.attributes.selectors.bind,
	); //* 'data-bind--'

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
			const bindValue = utils.helpers.parseBindValue(value);

			if (bindValue.type === "state") {
				if (!bindAttributes.has(bindValue.value))
					bindAttributes.set(bindValue.value, new Set());
				bindAttributes.get(bindValue.value)?.add(bindName);
			} else {
				if (!bindActionsAttributes.has(bindValue.value))
					bindActionsAttributes.set(bindValue.value, new Set());
				bindActionsAttributes.get(bindValue.value)?.add(bindName);
			}
		}
	}

	return {
		scope: scope,
		state: stateAttributes,
		bind: bindAttributes,
		bindActions: bindActionsAttributes,
	};
};

export default createAttributesMap;
