/**
 * Recursively collects attributes from an element and its children
 * with flexible filtering options
 */
const deepCollectAttributes = (
	element: Element,
	attributePrefixes: string[],
): Attr[] => {
	const result: Attr[] = [];

	const shouldIncludeAttr = (attr: Attr): boolean => {
		if (attributePrefixes.length === 0) return true;
		return attributePrefixes.some((prefix) => attr.name.startsWith(prefix));
	};

	function traverse(el: Element) {
		for (const attr of el.attributes) {
			if (shouldIncludeAttr(attr)) {
				result.push(attr);
			}
		}

		for (const child of el.children) {
			traverse(child);
		}
	}
	traverse(element);

	return result;
};

export default deepCollectAttributes;
