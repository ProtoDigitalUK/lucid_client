import Elements from "./elements.js";
import s from "./store/index.js";

/**
 * Destroys the library
 * - Calls destroy on all handlers - depending on implementation this removes event listeners, etc.
 * - Removes the stores and destroys the SolidJS createRoot
 * - Removes the observer
 */
const destroy = () => {
	//* destroy handlers
	Elements.handlerAttributes.forEach((attributes, namespace) => {
		const handler = Elements.handlers.get(namespace);
		if (handler) handler.destroy?.(attributes);
	});

	//* remove stores
	Elements.stores.forEach((store, key) => s.destroyStore(key, store));
};

export default destroy;
