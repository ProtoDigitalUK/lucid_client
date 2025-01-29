import Elements from "../elements.js";

/**
 * For each used handler, destroy it.
 */
const destroyHandlers = () => {
	Elements.handlerDirectives.forEach((attributes, namespace) => {
		const handler = Elements.handlers.get(namespace);
		if (handler) handler.destroy?.(attributes);
	});
};

export default destroyHandlers;
