import type { HandlerDirectives } from "../../types/directives.js";
import type { HandlerInitOptions } from "../../types/handlers.js";
import Elements from "../elements.js";

/**
 * For each used handler, initialise it.
 * - If its a partial initialisation triggered via Elements.sync, then return an array of disposes for sync to clean up.
 * - If its a full initialisation (triggered on start, refresh), then store the dispose callback against the handler item.
 */
const initialiseHandlers = (
	handlerDirectives: HandlerDirectives,
	initOptions: HandlerInitOptions,
) => {
	const disposes: Array<() => void> = [];
	handlerDirectives.forEach((attributes, namespace) => {
		const handlerItem = Elements.handlers.get(namespace);
		if (handlerItem) {
			const dispose = handlerItem.handler.initialise(attributes, initOptions);
			if (initOptions.partial) disposes.push(dispose);
			else {
				if (handlerItem.dispose) handlerItem.dispose();
				handlerItem.dispose = dispose;
			}
		}
	});

	return disposes;
};

export default initialiseHandlers;
