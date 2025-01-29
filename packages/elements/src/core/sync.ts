import Elements from "./elements.js";
import handler from "./handler/index.js";
import store from "./store/index.js";
import { log } from "../helpers.js";
import buildDirectives from "./build-directives.js";

/**
 * Checks for new Elements attributes and initialises them
 */
const sync = (target?: Element) => {
	// build out directives based on target element (if no element, defaults to the document.body)
	const { elements, handlerDirectives, storeDirectives } =
		buildDirectives(target);

	// compare directives to those against ELements and stores already
	// filter out new ones and initialsie only them

	console.log(storeDirectives);

	log.debug("Elements synced.");
};

export default sync;
