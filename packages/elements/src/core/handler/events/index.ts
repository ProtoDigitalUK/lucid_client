import type { Handler, HandlerAttributes } from "../../../types/index.js";
import store from "../../store/index.js";
import utils from "../../../utils/index.js";

/**
 * The namespace for the event handler
 */
const namespace = "event";

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
				utils.helpers.handlerSelector(namespace, eventName, key),
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
 * Registers the event handler which supports all event listeners. These can be used like so:
 * - data-handler--event.click
 * - data-handler--event.scroll
 * - data-handler--event.keydown
 * - data-handler--event.keyup
 *
 * Any actions assigned to these events will have the Event as the first argument.
 */
const eventsHandler: Handler = {
	namespace: namespace,
	initialise: (attributes) => registerEvents(attributes, true),
	destroy: (attributes) => registerEvents(attributes, false),
};

export default eventsHandler;
