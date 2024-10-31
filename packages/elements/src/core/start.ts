import utils from "../utils/index.js";
import C from "./constants.js";
import Elements from "./elements.js";
import store from "./store/index.js";
import handler from "./handler/index.js";

/**
 * Sets up and starts the Elements library
 */
const start = (options?: {
	debug?: boolean;
	attributes?: {
		prefix?: string;
		selectors?: {
			element?: string;
			state?: string;
			bind?: string;
			handler?: string;
			ref?: string;
			scope?: string;
		};
		seperators?: {
			scope?: string;
			handler?: string;
		};
	};
}) => {
	if (Elements.started) {
		utils.log.warn(
			"The library has already been started. Please don't call start() more than once.",
		);
		return;
	}

	// set options
	Elements.options = {
		debug: options?.debug ?? C.defaults.debug,
		attributes: {
			prefix: options?.attributes?.prefix ?? C.defaults.attributes.prefix,
			selectors: {
				element:
					options?.attributes?.selectors?.element ??
					C.defaults.attributes.selectors.element,
				state:
					options?.attributes?.selectors?.state ??
					C.defaults.attributes.selectors.state,
				bind:
					options?.attributes?.selectors?.bind ??
					C.defaults.attributes.selectors.bind,
				handler:
					options?.attributes?.selectors?.handler ??
					C.defaults.attributes.selectors.handler,
				ref:
					options?.attributes?.selectors?.ref ??
					C.defaults.attributes.selectors.ref,
				scope:
					options?.attributes?.selectors?.scope ??
					C.defaults.attributes.selectors.scope,
			},
			seperators: {
				scope:
					options?.attributes?.seperators?.scope ??
					C.defaults.attributes.seperators.scope,
				handler:
					options?.attributes?.seperators?.handler ??
					C.defaults.attributes.seperators.handler,
			},
		},
	};
	Elements.handlerAttributes = handler.createAttributeMap();
	Elements.started = true;

	// initialise elements stores
	const elements = utils.elementSelectors.getAllElements();
	for (const item of elements) store.initialiseStore(item[0], item[1]);

	handler.initialiseHandlers();
	store.registerStoreObserver();

	utils.log.debug("library started.");
};

export default start;
