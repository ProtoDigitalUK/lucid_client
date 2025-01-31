import state from "../state/index.js";
import ref from "../ref/index.js";
import Elements from "../elements.js";
import { buildAttribute } from "../../helpers.js";
import { handleMutation } from "../state/state-observer.js";
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

	// TODO: check refs, registerActionEffects and registerEffects works with syncStore
	ref.createRefs(storeElement, store);
	// bind.registerActionEffects(store);
	// effect.registerEffects(store);

	return () => {
		syncStateObserver.disconnect();
	};
};

export default syncStore;
