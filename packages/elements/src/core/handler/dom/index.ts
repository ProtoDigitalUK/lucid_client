import type { Handler } from "../../../types/index.js";
import utils from "../../../utils/index.js";
import store from "../../store/index.js";
import { createEffect, createRoot } from "solid-js";

const namespace = "dom";
let disposeHandler: () => void;

/**
 * Text specifier
 * - Loops through the targets and sets the innerText of the target to the stringified action response
 */
const textSpecifier = (
	targets: NodeListOf<Element>,
	actionResponse: unknown,
) => {
	const stringify = utils.helpers.stringifyState(actionResponse);
	for (const target of targets) {
		if (target instanceof HTMLElement) {
			target.innerText = stringify;
		}
	}
};

/**
 * HTML specifier
 * - Loops through the targets and sets the innerHTML of the target to the stringified action response
 */
const htmlSpecifier = (
	targets: NodeListOf<Element>,
	actionResponse: unknown,
) => {
	const stringify = utils.helpers.stringifyState(actionResponse);
	for (const target of targets) {
		if (target instanceof HTMLElement) {
			target.innerHTML = stringify;
		}
	}
};

/**
 * Value specifier
 * - Loops through the targets and sets the value of the target to the stringified action response
 */
const valueSpecifier = (
	targets: NodeListOf<Element>,
	actionResponse: unknown,
) => {
	const stringify = utils.helpers.stringifyState(actionResponse);
	for (const target of targets) {
		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement
		) {
			target.value = stringify;
		}
	}
};

/**
 * Focus specifier
 * - Loops through the targets and focuses the first focusable element when action returns true
 */
const focusSpecifier = (
	targets: NodeListOf<Element>,
	actionResponse: unknown,
) => {
	for (const target of targets) {
		if (target instanceof HTMLElement && actionResponse === true) {
			target.focus();
			break; // Only focus the first target
		}
	}
};

/**
 * Blur specifier
 * - Loops through the targets and removes focus from them when action returns true
 */
const blurSpecifier = (
	targets: NodeListOf<Element>,
	actionResponse: unknown,
) => {
	for (const target of targets) {
		if (target instanceof HTMLElement && actionResponse === true) {
			target.blur();
		}
	}
};

/**
 * ScrollIntoView specifier
 * - Scrolls target into view when action returns true
 */
const scrollIntoViewSpecifier = (
	targets: NodeListOf<Element>,
	actionResponse: unknown,
) => {
	for (const target of targets) {
		if (target instanceof HTMLElement && actionResponse === true) {
			target.scrollIntoView({ behavior: "smooth" });
			break; //* only scroll to the first target
		}
	}
};

/**
 * Returns the event specifier
 */
const specifierDeligate = (specifier: string) => {
	switch (specifier) {
		case "text":
			return textSpecifier;
		case "html":
			return htmlSpecifier;
		case "value":
			return valueSpecifier;
		case "focus":
			return focusSpecifier;
		case "blur":
			return blurSpecifier;
		case "scrollto":
			return scrollIntoViewSpecifier;
		default:
			return textSpecifier;
	}
};

/**
 * Registeres the DOM handler whcih supports the following attributes/features:
 * - data-handler--dom.text
 * - data-handler--dom.html
 * - data-handler--dom.value
 * - data-handler--dom.focus
 * - data-handler--dom.blur
 * - data-handler--dom.scrollto
 */
const domHandler: Handler = {
	namespace: namespace,
	initialise: (attributes) => {
		createRoot((dispose) => {
			disposeHandler = dispose;

			for (const event of attributes) {
				const [eventName, actions] = event;
				for (const key of actions) {
					const action = store.findAction(key);
					if (!action) continue;

					const targets = document.querySelectorAll(
						utils.helpers.handlerSelector(namespace, eventName, key),
					);
					const specifier = specifierDeligate(eventName);

					createEffect(async () => {
						try {
							const reponse = action();
							const data = await Promise.resolve(reponse);
							specifier(targets, data);
						} catch (error) {
							console.error(error);
						}
					});
				}
			}
		});
	},
	destroy: () => disposeHandler(),
};

export default domHandler;
