import type {
	Handler,
	Store,
	StoreState,
	StoreActions,
} from "../../../types/index.js";
import Elements from "../../elements.js";
import utils from "../../../utils/index.js";
import scope from "../../scope/index.js";

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
const registerEvents = (
	store: Store<StoreState, StoreActions>,
	register: boolean,
) => {
	const events = store[0].attributeMaps?.handler.get(namespace);
	if (!events) return;

	for (const event of events) {
		const [eventName, actions] = event;

		for (const key of actions) {
			const actionKey = scope.removeScope(key);

			const action = store[0].actions[actionKey];
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
	initialise: (store) => registerEvents(store, true),
	destroy: (store) => {
		registerEvents(store, false);
		utils.log.debug(`Handler destroyed for namespace "${namespace}"`);
	},
};

export default eventsHandler;
