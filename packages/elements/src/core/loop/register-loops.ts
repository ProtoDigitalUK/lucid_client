import { createEffect } from "solid-js";
import type {
	Store,
	StoreState,
	StoreActions,
	DirectiveMap,
} from "../../types/index.js";
import {
	findStoreMember,
	buildAttribute,
	resolveMember,
	log,
} from "../../helpers.js";
import Elements from "../elements.js";
import loop from "./index.js";

/**
 * Responsible for registering the loop directive effects
 */
const registerLoops = (
	store: Store<StoreState, StoreActions>,
	directives: DirectiveMap | undefined,
) => {
	if (!directives?.loops) return;

	const attributeName = buildAttribute(
		Elements.options.attributes.selectors.loop,
	);

	for (const loopValue of directives.loops) {
		const member = findStoreMember(loopValue, store);
		if (!member) continue;

		//* supports multiple attributes with the exact same attribute value. Dont need to worry about this running multiple times due to directives.loops being a Set.
		const selector = `[${attributeName}="${loopValue}"]`;
		const targets = document.querySelectorAll(selector);

		if (!targets.length) return;

		createEffect(async () => {
			const value = await resolveMember(member);

			//* only support arrays
			if (!Array.isArray(value)) {
				log.warn(
					`"${attributeName}" directives only support arrays, recieved "${typeof value}" for "${loopValue}".`,
				);
				return;
			}

			const loopLength = value.length || 0;

			for (const target of targets) {
				loop.renderLoop(target, {
					loopValue: loopValue,
					loopLength: loopLength,
				});
			}
		});
	}
};

export default registerLoops;
