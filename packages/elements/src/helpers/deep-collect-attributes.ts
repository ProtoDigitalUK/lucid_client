/**
 * From a given element, get all of its and its childrens attributes recursively
 */
const deepCollectAttributes = (element: Element): Attr[] => {
	const result: Attr[] = [];

	function traverse(el: Element) {
		for (const attr of el.attributes) result.push(attr);
		for (const child of el.children) traverse(child);
	}
	traverse(element);

	return result;
};

export default deepCollectAttributes;
