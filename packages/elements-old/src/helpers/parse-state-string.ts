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

export default parseStateString;
