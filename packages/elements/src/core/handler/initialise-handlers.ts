import Elements from "../elements.js";

/**
 * For each used handler, initialise it.
 */
const initialiseHandlers = () => {
	Elements.handlerDirectives.forEach((attributes, namespace) => {
		const handler = Elements.handlers.get(namespace);
		if (handler) handler.initialise(attributes);
	});
};

export default initialiseHandlers;
