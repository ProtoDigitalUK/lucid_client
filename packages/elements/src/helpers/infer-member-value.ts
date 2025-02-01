import scope from "../core/scope/index.js";
import C from "../core/constants.js";
import { extractBaseStateKey } from "../helpers.js";

/**
 * Infers a member values type and splits it into its segments.
 *
 * - data-bind--aria-label="scope:$state-member"
 * - data-handler--event.click="scope:@action-member"
 * - data-effect="scope:effect"
 */
const inferMemberValue = (
	memberValue: string,
	attribute?: string,
): {
	type: "action" | "state" | "basic";
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

	return {
		type: "basic",
		scope: storeScope,
		key: value,
	};
};

export default inferMemberValue;
