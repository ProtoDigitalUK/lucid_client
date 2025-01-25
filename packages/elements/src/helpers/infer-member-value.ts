import scope from "../core/scope/index.js";
import C from "../core/constants.js";
import { extractBaseStateKey } from "../helpers.js";

/**
 * Infers a member values type and splits it into its segments.
 * A member is the attribute value within a bind or handler, ie:
 * - data-bind--aria-label="scope:$state-member"
 * - data-handler--event.click="scope:@action-member"
 */
const inferMemberValue = (
	memberValue: string,
): {
	type: "action" | "state";
	scope: string;
	key: string;
} | null => {
	const [storeScope, value] = scope.splitValue(memberValue);
	if (!storeScope || !value) return null;

	if (value.includes(C.defaults.attributes.denote.action)) {
		return {
			type: "action",
			scope: storeScope,
			key: value.replace(C.defaults.attributes.denote.action, ""),
		};
	}

	if (value.includes(C.defaults.attributes.denote.state)) {
		const cleanValue = value.replace(C.defaults.attributes.denote.state, "");
		return {
			type: "state",
			scope: storeScope,
			key: extractBaseStateKey(cleanValue),
		};
	}

	return null;
};

export default inferMemberValue;
