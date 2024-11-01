import type { HandlerAttributes } from "./index.js";

export type Handler = {
	/**
	 * A unique namespace for the handler
	 */
	namespace: string;
	/**
	 * Called once on the iniitalisation of Elements
	 */
	initialise: (attributes: HandlerAttributes) => void;
	/**
	 * Called when Elements.destroy() is called
	 */
	destroy?: (attributes: HandlerAttributes) => void;
};

export type Handlers = Map<string, Handler>;
