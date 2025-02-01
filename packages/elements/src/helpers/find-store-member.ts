import Elements from "../core/elements.js";
import { inferMemberValue, log } from "../helpers.js";
import type { StoreMember } from "../types/store.js";
import type { Store, StoreState, StoreActions } from "../types/index.js";

/**
 * Find store member (state or action) based on the member value
 * Expects format "scope:@action" or "scope:$state"
 */
const findStoreMember = (
	memberValue: string,
	store?: Store<StoreState, StoreActions>,
): StoreMember | null => {
	const memberDetails = inferMemberValue(memberValue);
	if (memberDetails === null) return null;

	const searchStore = (
		targetStore: Store<StoreState, StoreActions>,
	): StoreMember | null => {
		if (targetStore[0].key === memberDetails.scope) {
			if (memberDetails.type === "action") {
				const action = targetStore[0].actions[memberDetails.key];
				if (action === undefined) {
					log.warn(
						`Cannot find an action with the key of "${memberDetails.key}" on store "${memberDetails.scope}".`,
					);
					return null;
				}
				return { type: memberDetails.type, member: action, key: memberValue };
			}
			if (memberDetails.type === "state") {
				const state = targetStore[0].state[memberDetails.key];
				if (state === undefined) {
					log.warn(
						`Cannot find state with the key of "${memberDetails.key}" on store "${memberDetails.scope}".`,
					);
					return null;
				}
				return { type: memberDetails.type, member: state, key: memberValue };
			}
		}
		return null;
	};

	if (store) return searchStore(store);

	for (const currentStore of Elements.stores.values()) {
		const result = searchStore(currentStore);
		if (result !== null) {
			return result;
		}
	}

	return null;
};

export default findStoreMember;
