import type { HandlerSpecifiersMap } from "./index.js";

export type HandlerInitOptions = {
	partial: boolean;
	target?: Element;
};

export type Handler = {
	/**
	 * A unique namespace for the handler
	 */
	namespace: string;
	/**
	 * Called on initialisation of Elements, or on sync
	 */
	initialise: (
		attributes: HandlerSpecifiersMap,
		options: HandlerInitOptions,
	) => () => void;
};

export type Handlers = Map<
	string,
	{
		handler: Handler;
		dispose?: ReturnType<Handler["initialise"]>;
	}
>;
