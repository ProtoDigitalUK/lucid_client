/**
 * Determines if the clients connection is appropriate
 */
const validConnection = (): boolean => {
	if (!navigator.onLine) {
		console.warn("The device is offline, speculate library not initialised.");
		return false;
	}
	if ("connection" in navigator) {
		const connection = navigator.connection;
		// @ts-expect-error
		if (connection?.saveData) {
			console.warn("Save-Data is enabled, speculate library not initialised.");
			return false;
		}
		// @ts-expect-error
		if (/(2|3)g/.test(connection?.effectiveType)) {
			console.warn(
				"2G or 3G connection is detected, speculate library not initialised.",
			);
			return false;
		}
	}

	return true;
};

export default validConnection;
