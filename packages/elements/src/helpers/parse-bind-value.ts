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

export default parseBindValue;
