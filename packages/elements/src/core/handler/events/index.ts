import type { Handler } from "../../../types/index.js";
import utils from "../../../utils/index.js";

const namespace = "event";

const eventsHandler: Handler = {
	namespace: namespace,
	initialise: (store) => {
		const events = store[0].attributeMaps?.handler.get(namespace);
		if (!events) return;

		for (const event of events) {
			const [eventName, actions] = event;
			// check actions exist on store
			// query select all the element the action and handler name data-handler--event.scroll="example:handleScroll"
			// track that the event name and action have been ran already - needed for if other elements further down have the same event and action
			// add the event listener to the element
			console.log(eventName, actions);
		}
	},
	destroy: (store) => {
		utils.log.debug(`Handler destroyed for namespace "${namespace}"`);
	},
};

export default eventsHandler;
