import Elements from "../core/elements.js";

/**
 * Prepends the attribute prefix to the given attribute
 */
const buildAttribute = (attribute: string) =>
	`${Elements.options.attributes.prefix}${attribute}`;

/**
 * Parses a state attribute value and returns an inferred type
 */
const parseStateString = (value: string | null) => {
	if (!value) return null;

	if (value === "true") return true;
	if (value === "false") return false;

	if (value === "null") return null;
	if (value === "undefined") return undefined;

	if (!Number.isNaN(Number(value))) return Number(value);

	if (value.trim().match(/^[{\[]/)) {
		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	}

	return value;
};

/**
 * Stringifies the given state value so it can be re-attached to an attribute
 * - if the value is an object, use the bind attribute value to select the correct key's value and stringify that
 * - if the value is an array, use the bind attribute value to select the correct index's value and stringify that
 */
const stringifyState = (value: unknown): string => {
	try {
		if (typeof value === "string") return value;
		if (value === null) return "null";
		if (value === undefined) return "undefined";
		if (typeof value === "object") {
			return JSON.stringify(value);
		}
		return String(value);
	} catch (e) {
		return String(value);
	}
};

/**
 * Returns the inferred type of the given value
 */
const valueType = (value: unknown) => {
	if (typeof value === "string") return "string";
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (typeof value === "object") {
		if (Array.isArray(value)) return "array";
		return "object";
	}
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	return "unknown";
};

/**
 * Determines if the value is an action or state and returns the value
 * - If the attribute value is a dot notation, return the first part
 * - If the attribute value is a bracket notation, return the first part
 * - If the value contains @, its action
 *
 * These are returned with the scope still attached
 */
const parseBindValue = (
	value: string,
): {
	type: "state" | "action";
	value: string;
} => {
	if (value.includes("@")) {
		return { type: "action", value: value };
	}

	const dotIndex = value.indexOf(".");
	const bracketIndex = value.indexOf("[");

	if (dotIndex === -1 && bracketIndex === -1) {
		return { type: "state", value: value };
	}

	// dot notation first - or only present. key.test[0], key.test
	if (bracketIndex === -1 || (dotIndex !== -1 && dotIndex < bracketIndex)) {
		return {
			type: "state",
			value: value.split(".")[0] ?? value,
		};
	}

	// bracket notation first / only present. key[0].test, key[0]
	return {
		type: "state",
		value: value.split("[")[0] ?? value,
	};
};

/**
 * Evaluates a path value from an object or array
 */
const evaluatePathValue = (
	value: Record<string, unknown> | Array<unknown>,
	path: string,
) => {
	if (!value || !path) {
		return undefined;
	}

	const parts = path
		.split(".")
		.reduce((acc: string[], part: string) => {
			const matches = part.match(/([^\[\]]+)|\[(\d+)\]/g);
			if (matches) {
				acc.push(...matches.map((m) => m.replace(/[\[\]]/g, "")));
			}
			return acc;
		}, [])
		.slice(1);

	return parts.reduce<unknown>((currentValue, part) => {
		if (currentValue === null || currentValue === undefined) {
			return undefined;
		}

		if (typeof currentValue === "object") {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return (currentValue as any)[part];
		}

		return undefined;
	}, value);
};

/**
 * From a given element, get all of its and its childrens attributes recursively
 */
const deepCollectAttr = (element: Element): Attr[] => {
	const result: Attr[] = [];

	function traverse(el: Element) {
		for (const attr of el.attributes) result.push(attr);
		for (const child of el.children) traverse(child);
	}
	traverse(element);

	return result;
};

/**
 * Helpers
 */
const helpers = {
	buildAttribute,
	parseStateString,
	stringifyState,
	valueType,
	parseBindValue,
	evaluatePathValue,
	deepCollectAttr,
};

export default helpers;
