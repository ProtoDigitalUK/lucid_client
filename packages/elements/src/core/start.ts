import utils from "../utils/index.js";
import C from "./constants.js";
import Elements from "./elements.js";
import store from "./store/index.js";
import handler from "./handler/index.js";
import parseAttributes from "./parse-attributes.js";

/**
 * Sets up and starts the Elements library
 */
const start = (options?: {
	debug?: boolean;
	attributes?: {
		prefix?: string;
		selectors?: {
			store?: string;
			state?: string;
			bind?: string;
			handler?: string;
			ref?: string;
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
				store:
					options?.attributes?.selectors?.store ??
					C.defaults.attributes.selectors.store,
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

	// parse attributes
	const { elements, handlerAttributes, storeAttributes } = parseAttributes();

	Elements.handlerAttributes = handlerAttributes;

	// initialise elements stores
	for (const item of elements) {
		if (!item[1]) {
			utils.log.warn(
				"Please ensure all 'data-store' attributes have a value. This is needed to scope state, binds and handler actions.",
			);
			continue;
		}

		store.initialiseStore(item[0], item[1], storeAttributes.get(item[1]));
	}

	handler.initialiseHandlers();
	store.registerStoreObserver();

	Elements.started = true;
	utils.log.debug("library started.");
};

export default start;
