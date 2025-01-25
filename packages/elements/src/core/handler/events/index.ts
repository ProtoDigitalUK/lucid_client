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

let abortController: AbortController | null = null;
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
const registerEvents = (attributes: HandlerAttributes) => {
	for (const event of attributes) {
		const [eventName, actions] = event;

		for (const key of actions) {
			const action = store.findAction(key);
			if (!action) continue;

			const targets = document.querySelectorAll(
				utils.helpers.handlerSelector(namespace, eventName, key),
			);
			const eventKey = createEventKey(eventName, key);

			console.log(eventKey);

			if (!eventListenerMap.has(eventKey)) {
				eventListenerMap.set(eventKey, new Map());
			}
			const elementMap = eventListenerMap.get(eventKey);
			if (!elementMap) continue;

			for (const target of targets) {
				if (elementMap.has(target)) return;

				const handler = createEventHandler(action);
				target.addEventListener(eventName, handler, {
					signal: abortController?.signal,
				});
				elementMap.set(target, handler);
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
	initialise: (attributes) => {
		if (!abortController) abortController = new AbortController();
		registerEvents(attributes);
	},
	destroy: () => {
		abortController?.abort();
		abortController = null;
		eventListenerMap.clear();
	},
};

export default eventsHandler;
