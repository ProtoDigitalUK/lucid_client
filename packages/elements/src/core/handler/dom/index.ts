import type { Handler } from "../../../types/index.js";
import utils from "../../../utils/index.js";
import store from "../../store/index.js";
import Elements from "../../elements.js";
import { createEffect } from "solid-js";

const namespace = "dom";

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
 * Returns the event specifier
 */
const specifierDeligate = (specifier: string) => {
	switch (specifier) {
		case "text":
			return textSpecifier;
		case "html":
			return htmlSpecifier;
		default:
			return textSpecifier;
	}
};

/**
 * Creates a selector for a handler
 */
const createSelector = (namespace: string, specifier: string, action: string) =>
	`[${Elements.options.attributes.prefix}${Elements.options.attributes.selectors.handler}${namespace}\\.${specifier}="${action}"]`;

/**
 * The DOM handler entry point
 */
const domHandler: Handler = {
	namespace: namespace,
	initialise: (attributes) => {
		for (const event of attributes) {
			const [eventName, actions] = event;
			for (const key of actions) {
				const action = store.findAction(key);
				if (!action) continue;

				const targets = document.querySelectorAll(
					createSelector(namespace, eventName, key),
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
	},
	// destroy: () => {
	// 	utils.log.debug(`Handler destroyed for namespace "${namespace}"`);
	// },
};

export default domHandler;
