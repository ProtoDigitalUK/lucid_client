import C from "../constants.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * Sets the details modal state - open/close
 */
const setDetailsState = (modalState: boolean) => {
	if (lib.alertState.get()) lib.alertState.set(false);
	S.elements?.details?.setAttribute(
		C.attributes.details,
		modalState ? "true" : "false",
	);
	lib.setAttributes("dynamic");
};

/**
 * Returns the details modal state - open/close
 */
const getDetailsState = () =>
	S.elements?.details?.getAttribute(C.attributes.details) === "true";

export default {
	get: getDetailsState,
	set: setDetailsState,
};
