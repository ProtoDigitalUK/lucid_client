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

export default evaluatePathValue;
