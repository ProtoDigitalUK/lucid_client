import utils from "../../utils/index.js";
import Elements from "../elements.js";

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
		utils.helpers.buildAttribute(Elements.options.attributes.selectors.element),
	);
	if (!storeKey) return;

	const store = Elements.stores.get(storeKey);
	if (!store) return;

	// for (const handler of Elements.handlers.values()) handler.destroy?.(store);
	store[0].stateObserver?.disconnect();
	store[0].dispose();
	Elements.stores.delete(storeKey);

	utils.log.debug(
		`Store removed for element "${element.id || element.tagName}" with key "${storeKey}"`,
	);
};

export default registerStoreObserver;
