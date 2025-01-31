import Elements from "./elements.js";
import { log } from "../helpers.js";
import buildDirectives from "./build-directives.js";
import { createRoot } from "solid-js";
import store from "./store/index.js";

/**
 * Checks for new Elements attributes and initialises them
 * @todo Dont expose this, if youre not careful you can easily register duplicate effects
 */
const sync = (target: Element) => {
	const handler = () => {
		// if the target has been synced prior, dispose of it before re-initialsing
		const targetDispose = Elements.syncedElements.get(target);
		if (targetDispose) {
			targetDispose();
			Elements.syncedElements.delete(target);
		}

		const directives = buildDirectives(target);
		const storeDispose: Array<() => void> = [];

		// sync exisitng stores & and initialise new stores
		for (const [key, value] of directives.storeDirectives) {
			const storeElem = directives.elements.find((i) => i[1] === key);

			// if we found a store in the buildDirectives and it doesnt exist against Elements.stores
			if (storeElem && !Elements.stores.has(key)) {
				store.initialiseStore(storeElem[0], key, value);

				//* destroy store if the target is synced again. It's likley the store will be disposed of already via the storeObserver
				storeDispose.push(() => {
					const storeItem = Elements.stores.get(key);
					if (!storeItem) return;
					store.destroyStore(key, storeItem);
				});
				continue;
			}

			// existing store syncing
			createRoot((disposeFn) => {
				const storeDisposeCallback = store.syncStore(key, value);
				storeDispose.push(() => {
					disposeFn();
					storeDisposeCallback();
				});
			});
		}

		// register target and dispose against Elements
		Elements.syncedElements.set(target, () => {
			for (const storeDisposeCallbacks of storeDispose) {
				storeDisposeCallbacks();
			}
		});

		log.debug("Elements synced.");
	};

	typeof requestIdleCallback !== "undefined"
		? requestIdleCallback(handler)
		: setTimeout(handler, 0);
};

export default sync;
