import Elements from "./elements.js";
import { log } from "../helpers.js";
import buildDirectives from "./build-directives.js";
import { createRoot } from "solid-js";

/**
 * Checks for new Elements attributes and initialises them
 * @todo Dont expose this, if youre not careful you can easily register duplicate effects
 */
const sync = (target: Element) => {
	createRoot((dispose) => {
		// if the target has been synced prior, dispose of it before re-initialsing
		const targetDispose = Elements.syncedElements.get(target);
		if (targetDispose) {
			targetDispose();
			Elements.syncedElements.delete(target);
		}

		const directives = buildDirectives(target);

		console.log(directives.storeDirectives);
		console.log(directives.handlerDirectives);

		log.debug("Elements synced.");

		// register target and dispose against Elements
		Elements.syncedElements.set(target, dispose);
	});
};

export default sync;
