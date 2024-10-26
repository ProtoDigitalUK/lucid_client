import C from "../core/constants.js";
import Elements from "../core/elements.js";

/**
 * Debug logging - this is only enabled if the library is started with debug: true
 */
const debug = (msg: string, force?: boolean) =>
	Elements.options.debug || force
		? console.debug(`${C.prefix} ${msg}`)
		: undefined;

/**
 * Warn logging
 */
const warn = (msg: string) => console.warn(`${C.prefix} ${msg}`);

/**
 * Logging object
 */
const log = {
	debug,
	warn,
};

export default log;
