import Elements from "../core/elements.js";
import { inferMemberValue, log } from "../helpers.js";
import type { StoreMember } from "../types/store.js";

/**
 * Find store member (state or action) based on the member value
 * Expects format "scope:@action" or "scope:$state"
 */
const findStoreMember = (memberValue: string): StoreMember | null => {
	const memberDetails = inferMemberValue(memberValue);
	if (memberDetails === null) return null;

	for (const store of Elements.stores.values()) {
		if (store[0].directives?.scope === memberDetails.scope) {
			if (memberDetails.type === "action") {
				const action = store[0].actions[memberDetails.key];
				if (action === undefined) {
					log.warn(
						`Cannot find an action with the key of "${memberDetails.key}" on store "${memberDetails.scope}".`,
					);
					return null;
				}
				return { type: memberDetails.type, member: action, key: memberValue };
			}

			const state = store[0].state[memberDetails.key];
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

export default findStoreMember;
