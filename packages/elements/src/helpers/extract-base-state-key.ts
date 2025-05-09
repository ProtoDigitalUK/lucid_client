/**
 * Extracts the base key from a value that may contain dot or bracket notation
 * e.g., "state.path[0]" -> "state"
 */
const extractBaseStateKey = <R extends string>(value: string): R => {
	const dotIndex = value.indexOf(".");
	const bracketIndex = value.indexOf("[");

	// no dot or bracket notation
	if (dotIndex === -1 && bracketIndex === -1) {
		return value as R;
	}

	// dot notation first or only present
	if (bracketIndex === -1 || (dotIndex !== -1 && dotIndex < bracketIndex)) {
		return (value.split(".")[0] ?? value) as R;
	}

	// bracket notation first / only present. key[0].test, key[0]
	return (value.split("[")[0] ?? value) as R;
};

export default extractBaseStateKey;
