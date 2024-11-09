import C from "../constants.js";
import S from "../state.js";
import lib from "./index.js";

/**
 * Sets the alert modal state - open/close
 */
const setAlertState = (modalState: boolean) => {
	S.elements?.alert?.setAttribute(
		C.attributes.alert,
		modalState ? "true" : "false",
	);
	lib.setAttributes("dynamic");
};

/**
 * Returns the alert modal state - open/close
 */
const getAlertState = () =>
	S.elements?.alert?.getAttribute(C.attributes.alert) === "true";

export default {
	get: getAlertState,
	set: setAlertState,
};
