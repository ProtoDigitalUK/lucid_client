import type {
	Handler,
	HandlerAttributes,
	Action,
} from "../../../types/index.js";
import store from "../../store/index.js";
import utils from "../../../utils/index.js";

/**
 * The namespace for the event handler
 */
const namespace = "event";

const eventListenerMap = new Map<string, Map<Element, Action>>();

/**
 * Create an event handler function that can be stored and removed later
 */
const createEventHandler = (action: (e: Event) => void): Action => {
	return (e: Event) => action(e);
};

/**
 * Create a unique key for storing event listeners
 */
const createEventKey = (eventName: string, actionKey: string): string => {
	return `${eventName}:${actionKey}`;
};

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
			const eventKey = createEventKey(eventName, key);

			if (!eventListenerMap.has(eventKey)) {
				eventListenerMap.set(eventKey, new Map());
			}
			const elementMap = eventListenerMap.get(eventKey);
			if (!elementMap) continue;

			if (register) {
				for (const target of targets) {
					if (elementMap.has(target)) return;

					const handler = createEventHandler(action);
					target.addEventListener(eventName, handler);
					elementMap.set(target, handler);
				}
			} else {
				elementMap.forEach((handler, element) => {
					element.removeEventListener(eventName, handler);
				});
				elementMap.clear();
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
