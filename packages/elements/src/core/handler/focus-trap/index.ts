import type { Handler } from "../../../types/index.js";
import utils from "../../../utils/index.js";

const namespace = "focus-trap";

const focusTrapHandler: Handler = {
	namespace: namespace,
	initialise: (attributes) => {},
	// destroy: () => {
	// 	utils.log.debug(`Handler destroyed for namespace "${namespace}"`);
	// },
};

export default focusTrapHandler;
