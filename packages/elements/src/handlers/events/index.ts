import Elements from "../../core/elements.js";
import { buildHandlerSelector, findStoreMember } from "../../helpers.js";
import type { EventConfig } from "./types.js";
import type {
	Handler,
	HandlerSpecifiersMap,
	Action,
	StoreMember,
} from "../../types/index.js";

/**
 * The namespace for the event handler
 */
const namespace = "event";

let abortController: AbortController | null = null;
const eventListenerMap = new Map<
	string,
	Map<Element | Document | Window, Action>
>();

/**
 * Create an event handler function that can be stored and removed later
 */
const createEventHandler = (member: StoreMember): Action => {
	if (member.type === "action") return (e: Event) => member.member(e);
	return (e: Event) => console.log(member.member);
};

/**
 * Create a unique key for storing event listeners
 */
const createEventKey = (eventName: string, actionKey: string): string => {
	return `${eventName}:${actionKey}`;
};

/**
 * Parses the event specifier and determins the target and event type
 */
const parseEventSpecifier = (specifier: string): EventConfig => {
	const parts = specifier.split(Elements.options.attributes.seperators.handler);

	const config: EventConfig = {
		target: "element",
		eventName: parts[0],
	};

	if (parts[0] && parts.length > 1) {
		const possibleTargets = ["document", "body", "head", "window"];

		if (possibleTargets.includes(parts[0])) {
			config.target = parts[0] as EventConfig["target"];
			config.eventName = parts[1];
		}
	}

	return config;
};

/**
 * Returns the correct target based
 */
const getTargetElement = (
	config: EventConfig,
): HTMLElement | Document | Window => {
	switch (config.target) {
		case "document":
			return document;
		case "body":
			return document.body;
		case "head":
			return document.head;
		case "window":
			return window;
		default:
			return document;
	}
};

/**
 * Handles registering event listeners
 */
const registerEvents = (attributes: HandlerSpecifiersMap) => {
	for (const event of attributes) {
		const [eventSpecifier, actions] = event;
		const config = parseEventSpecifier(eventSpecifier);
		if (!config.eventName) continue;

		for (const key of actions) {
			const member = findStoreMember(key);
			if (!member) continue;

			const eventKey = createEventKey(eventSpecifier, key);

			if (!eventListenerMap.has(eventKey)) {
				eventListenerMap.set(eventKey, new Map());
			}
			const elementMap = eventListenerMap.get(eventKey);
			if (!elementMap) continue;

			if (config.target === "element") {
				const targets = document.querySelectorAll(
					buildHandlerSelector(namespace, eventSpecifier, key),
				);

				for (const target of targets) {
					if (elementMap.has(target)) continue;

					const handler = createEventHandler(member);
					target.addEventListener(config.eventName, handler, {
						signal: abortController?.signal,
					});
					elementMap.set(target, handler);
				}
			} else {
				const target = getTargetElement(config);
				if (elementMap.has(target)) continue;

				const handler = createEventHandler(member);
				target.addEventListener(config.eventName, handler, {
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
