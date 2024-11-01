import utils from "../../utils/index.js";
import Elements from "../elements.js";
import s from "./index.js";

/**
 * Sets up a mutation observer on the body element
 * - Handles removal of elements from the DOM by removing their store and disposing the SolidJS createRoot
 */
const registerStoreObserver = () => {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.removedNodes) {
				if (node instanceof HTMLElement) removeElement(node);
			}
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	return observer;
};

/**
 * Removes the store and disposes the SolidJS createRoot for the given element
 */
const removeElement = (element: HTMLElement) => {
	const storeKey = element.getAttribute(
		utils.helpers.buildAttribute(Elements.options.attributes.selectors.store),
	);
	if (!storeKey) return;

	const store = Elements.stores.get(storeKey);
	if (!store) return;

	s.destroyStore(storeKey, store);
	Elements.trackedElements.delete(element);
};

export default registerStoreObserver;
