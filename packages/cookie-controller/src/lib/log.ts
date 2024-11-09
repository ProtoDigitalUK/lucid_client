/**
 * A util for logging
 */
const log = (type: "warn", msg: string) => {
	if (type === "warn") console.warn(`[Cookie Controller] ${msg}`);
};

export default log;
