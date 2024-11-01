import Elements from "../elements.js";
import scope from "../scope/index.js";
import type { Action } from "../../types/index.js";

/**
 * Find the store action based on the scoped key
 */
const findAction = (action: string): Action | null => {
	const [key, value] = scope.splitValue(action);
	if (!key || !value) return null;

	for (const store of Elements.stores.values()) {
		if (store[0].attributeMaps?.scope === key) {
			return store[0].actions[value] ?? null;
		}
	}

	return null;
};

export default findAction;
