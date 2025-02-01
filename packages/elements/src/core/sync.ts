import Elements from "./elements.js";
import { log } from "../helpers.js";
import buildDirectives from "./build-directives.js";
import { createRoot } from "solid-js";
import store from "./store/index.js";
import handler from "./handler/index.js";

/**
 * Checks for new Elements directive attributes and initialises them for a given target. \
 *
 * Avoid running this on an element that was initialised on Elements.start(). This is intended to be used on elements that been added to the DOM after init. \
 * If you have called sync on an element before, you can safely call it on it again and the previous instance will get disposed of correctly.
 */
const sync = (target: Element, childrenOnly?: true) => {
	const syncHandler = () => {
		// if the target has been synced prior, dispose of it before re-initialsing
		const targetDispose = Elements.syncedElements.get(target);
		if (targetDispose) {
			targetDispose();
			Elements.syncedElements.delete(target);
		}

		const directives = buildDirectives(target, childrenOnly);
		const storesDispose: Array<() => void> = [];

		// sync exisitng stores & and initialise new stores
		for (const [key, value] of directives.storeDirectives) {
			const storeElem = directives.elements.find((i) => i[1] === key);

			// if we found a store in the buildDirectives and it doesnt exist against Elements.stores
			if (storeElem && !Elements.stores.has(key)) {
				store.initialiseStore(storeElem[0], key, value);

				//* destroy store if the target is synced again. It's likley the store will be disposed of already via the storeObserver
				storesDispose.push(() => {
					const storeItem = Elements.stores.get(key);
					if (!storeItem) return;
					store.destroyStore(key, storeItem);
				});
				continue;
			}

			// existing store syncing
			createRoot((disposeFn) => {
				const storeDisposeCallback = store.syncStore(key, value);
				storesDispose.push(() => {
					disposeFn();
					storeDisposeCallback();
				});
			});
		}

		// initialise any new handler directives
		const handlersDispose = handler.initialiseHandlers(
			directives.handlerDirectives,
			{ partial: true, target: target },
		);

		// register target and dispose against Elements
		Elements.syncedElements.set(target, () => {
			for (const storeDisposeCallbacks of storesDispose) {
				storeDisposeCallbacks();
			}
			for (const handlerDisposesCallbacks of handlersDispose) {
				handlerDisposesCallbacks();
			}
		});

		log.debug("Elements synced.");
	};

	typeof requestIdleCallback !== "undefined"
		? requestIdleCallback(syncHandler)
		: setTimeout(syncHandler, 0);
};

export default sync;
