import type { StoreActions, StoreModule, StoreState } from "../types/index.js";
import Elements from "./elements.js";
import { log } from "../helpers.js";

/**
 * Register store module for custom state and actions
 */
const storeModule = <S extends StoreState, A extends StoreActions>(
	key: string,
	storeModule: StoreModule<S, A>,
) => {
	if (Elements.storeModules.has(key)) {
		log.warn(`The store "${key}" already has a module registered for it.`);
		return;
	}

	// @ts-expect-error
	Elements.storeModules.set(key, storeModule);
};

export default storeModule;
