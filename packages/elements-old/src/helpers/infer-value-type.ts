/**
 * Returns the inferred type of the given value
 */
const inferValueType = (value: unknown) => {
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

export default inferValueType;
