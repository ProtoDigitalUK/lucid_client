import { log } from "../../helpers.js";
import type { ScopedMember } from "../../types/directives.js";
import sync from "../sync.js";

/**
 * Responsible for verifyig the target, building out the tempalte markup, inserting into the DOM and syncing
 */
const handleLoop = (
	target: Element,
	config: {
		loopValue: ScopedMember;
		loopLength: number;
	},
) => {
	// Find template and ensure it exists
	const template = target.querySelector("template");
	if (!template) {
		log.warn(
			`No template found in the loop with value "${config.loopValue}". A template element is required.`,
		);
		return;
	}

	// clean up any non-template children
	// biome-ignore lint/complexity/noForEach: <TODO: temp>
	Array.from(target.children).forEach((child) => {
		if (child !== template) child.remove();
	});

	const templateClone = template.content.cloneNode(true) as DocumentFragment;

	if (
		templateClone.children.length === 0 ||
		templateClone.children.length > 1
	) {
		log.warn(
			`The template for the loop with value "${config.loopValue}" must only have one child, found "${templateClone.children.length}".`,
		);
		return;
	}

	let loopResult = "";
	for (let i = 0; i < config.loopLength; i++) {
		loopResult += templateClone.children[0]?.outerHTML.replaceAll(
			"index",
			String(i),
		);
	}

	target.insertAdjacentHTML("beforeend", loopResult);

	console.log("reran", target);

	// sync(target);
};

export default handleLoop;
