import state from "../state/index.js";
import ref from "../ref/index.js";
import Elements from "../elements.js";
import { buildAttribute, log } from "../../helpers.js";
import bind from "../bind/index.js";
import effect from "../effect/index.js";
import type { DirectiveMap } from "../../types/store.js";

const syncStore = (storeKey: string, directives: DirectiveMap) => {
	const store = Elements.stores.get(storeKey);
	if (!store) return () => {};

	const storeElement = document.querySelector(
		`[${buildAttribute(Elements.options.attributes.selectors.store)}="${storeKey}"]`,
	);
	if (!storeElement) return () => {};

	const syncStateObserver = state.stateObserver(
		storeElement,
		store,
		directives,
	);

	state.createState(store, directives);
	state.watchState(storeElement, store);
	ref.createRefs(storeElement, store);
	bind.registerActionEffects(store, directives);
	effect.registerEffects(store, directives);

	log.debug(
		`Store synced for element "${storeElement.id || storeElement.tagName}" with key "${storeKey}"`,
	);

	return () => {
		syncStateObserver.disconnect();
	};
};

export default syncStore;
