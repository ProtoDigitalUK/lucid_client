import type { StoreMember } from "../types/store.js";
import { evaluatePathValue, inferValueType } from "../helpers.js";

/**
 * Resolves the store memeber.
 * If its an action, it calls it and returns the result.
 * If its state, it calls it and returns the result.
 *
 * If the member.key is state and referencing an object or array value, resolve that as well.
 *
 * If the raw param is true, it wont evaluate the value based on the members key path
 */
const resolveMember = async (member: StoreMember, raw?: boolean) => {
	if (member.type === "action") {
		const response = member.member();
		return await Promise.resolve(response);
	}

	const [state] = member.member;
	const value = state();

	if (raw) return value;

	const valueType = inferValueType(value);

	if (valueType === "object" || valueType === "array") {
		return evaluatePathValue(
			value as Record<string, unknown> | Array<unknown>,
			member.key,
		);
	}
	return value;
};

export default resolveMember;
