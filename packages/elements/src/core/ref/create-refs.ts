import type {
	Store,
	StoreState,
	StoreActions,
	Refs,
} from "../../types/index.js";
import s from "../scope/index.js";
import Elements from "../elements.js";
import utils from "../../utils/index.js";

/**
 * Selects all of the data-ref elements and creates Map of key to element / elements
 * - If the data-ref attribute is suffixed with [], it will create an array of elements
 * - Otherwise it will create a single element
 */
const createRefs = (
	element: HTMLElement,
	store: Store<StoreState, StoreActions>,
) => {
	const refPrefix = utils.helpers.buildAttribute(
		Elements.options.attributes.selectors.ref,
	);
	const scope = store[0].attributeMaps?.scope;
	const refElements = element.querySelectorAll(`[${refPrefix}]`);

	const refs: Refs = new Map();

	for (const ref of refElements) {
		const refName = ref.getAttribute(refPrefix);
		if (!refName) continue;

		if (scope && !s.valueIsScoped(scope, refName)) continue;
		const name = scope ? refName.split(":")[1] : refName;
		if (!name) continue;

		if (name.endsWith("[]")) {
			const refNameWithoutSuffix = name.slice(0, -2);
			if (!refs.has(refNameWithoutSuffix)) {
				refs.set(refNameWithoutSuffix, []);
			}
			(refs.get(refNameWithoutSuffix) as Element[]).push(ref);
		} else {
			if (!refs.has(name)) {
				refs.set(name, ref);
			}
		}
	}

	store[1]("refs", refs);
};

export default createRefs;
