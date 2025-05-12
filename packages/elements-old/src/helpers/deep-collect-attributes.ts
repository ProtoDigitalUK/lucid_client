/**
 * Recursively collects attributes from an element and its children
 * with flexible filtering options
 */
const deepCollectAttributes = (
	element: Element,
	attributePrefixes: string[],
	ignoreSelf?: true,
): Attr[] => {
	const result: Attr[] = [];

	const shouldIncludeAttr = (attr: Attr): boolean => {
		if (attributePrefixes.length === 0) return true;
		return attributePrefixes.some((prefix) => attr.name.startsWith(prefix));
	};

	function traverse(el: Element, ignoreSelf?: true) {
		if (ignoreSelf !== true) {
			for (const attr of el.attributes) {
				if (shouldIncludeAttr(attr)) {
					result.push(attr);
				}
			}
		}

		for (const child of el.children) {
			traverse(child);
		}
	}
	traverse(element, ignoreSelf);

	return result;
};

export default deepCollectAttributes;
