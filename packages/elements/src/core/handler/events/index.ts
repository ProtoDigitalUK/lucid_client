import type { Handler } from "../../../types/index.js";
import utils from "../../../utils/index.js";

const namespace = "events";

const eventsHandler: Handler = {
	namespace: namespace,
	initialise: (store) => {},
	destroy: (store) => {
		utils.log.debug(`Handler destroyed for namespace "${namespace}"`);
	},
};

export default eventsHandler;
