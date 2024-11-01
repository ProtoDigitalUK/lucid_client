import type { Handler, HandlerAttributes } from "../../../types/index.js";
import Elements from "../../elements.js";
import store from "../../store/index.js";

/**
 * The namespace for the event handler
 */
const namespace = "event";

/**
 * Creates a selector for a handler
 */
const createSelector = (namespace: string, event: string, action: string) =>
	`[${Elements.options.attributes.prefix}${Elements.options.attributes.selectors.handler}${namespace}\\.${event}="${action}"]`;

/**
 * Handles registering and unregistering event listeners
 */
const registerEvents = (attributes: HandlerAttributes, register: boolean) => {
	for (const event of attributes) {
		const [eventName, actions] = event;
		for (const key of actions) {
			const action = store.findAction(key);
			if (!action) continue;

			const targets = document.querySelectorAll(
				createSelector(namespace, eventName, key),
			);

			for (const target of targets) {
				if (register) {
					target.addEventListener(eventName, (e) => {
						action(e);
					});
				} else {
					target.removeEventListener(eventName, (e) => {
						action(e);
					});
				}
			}
		}
	}
};

/**
 * The event handler entry point
 */
const eventsHandler: Handler = {
	namespace: namespace,
	initialise: (attributes) => registerEvents(attributes, true),
	destroy: (attributes) => registerEvents(attributes, false),
};

export default eventsHandler;
