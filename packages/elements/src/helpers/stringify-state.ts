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

export default stringifyState;
