import { log } from "../../helpers.js";
import type { ScopedMember } from "../../types/directives.js";
import sync from "../sync.js";
import C from "../constants.js";

/**
 * Replaces all :index: and :indexOne: occurances in the markup
 */
const replaceLoopIndexes = (element: Element, index: number): string => {
	// if no nested templates (indicating loop directive based on template exisitng)
	if (!element.getElementsByTagName("template").length) {
		return element.outerHTML
			.replaceAll(C.defaults.attributes.denote.index, String(index))
			.replaceAll(C.defaults.attributes.denote.index1, String(index + 1));
	}

	// create temp container, place template contents in it, replaces indexes and then restore templates based on comment

	const tempDiv = document.createElement("div");
	tempDiv.appendChild(element.cloneNode(true));

	const nestedTemplates = tempDiv.getElementsByTagName("template");
	const templateContents = new Map();

	for (let i = 0; i < nestedTemplates.length; i++) {
		const target = nestedTemplates[i];
		templateContents.set(i, target?.innerHTML);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		target!.innerHTML = `<!--template-${i}-->`;
	}

	let html = tempDiv.innerHTML
		.replaceAll(C.defaults.attributes.denote.index, String(index))
		.replaceAll(C.defaults.attributes.denote.index1, String(index + 1));

	templateContents.forEach((content, i) => {
		html = html.replace(`<!--template-${i}-->`, content);
	});

	return html;
};

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
	// find template and ensure it exists
	const template = target.querySelector("template");
	if (!template) {
		log.warn(
			`No template found in the loop with value "${config.loopValue}". A template element is required.`,
		);
		return;
	}

	const templateClone = template.content.cloneNode(true) as DocumentFragment;

	// ensure the template has 1 child only
	if (
		templateClone.children.length === 0 ||
		templateClone.children.length > 1
	) {
		log.warn(
			`The template for the loop with value "${config.loopValue}" must only have one child, found "${templateClone.children.length}".`,
		);
		return;
	}

	// generate loop items
	let loopResult = "";
	for (let i = 0; i < config.loopLength; i++) {
		loopResult += replaceLoopIndexes(templateClone.children[0] as Element, i);
	}

	// replace and sync result
	requestAnimationFrame(() => {
		target.innerHTML = template.outerHTML + loopResult;
		sync(target, true);
	});
};

export default handleLoop;
