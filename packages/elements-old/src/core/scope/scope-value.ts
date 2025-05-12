import Elements from "../elements.js";
import type { ScopedMember } from "../../types/directives.js";

/**
 * Scopes the given value with the stores provided scope
 */
const scopeAttribute = (scope: string, value: string): ScopedMember =>
	`${scope}${Elements.options.attributes.seperators.scope}${value}` as ScopedMember;

export default scopeAttribute;
