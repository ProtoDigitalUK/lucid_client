import type { StorageOptions } from "../types.js";

/**
 *  Formats a cookie string
 */
const formatCookieString = (
	key: string,
	value: string,
	options: StorageOptions,
): string => {
	const parts = [`${key}=${value}`];

	if (options.path) {
		parts.push(`path=${options.path}`);
	}

	if (options.domain) {
		parts.push(`domain=${options.domain}`);
	}

	if (options.sameSite) {
		parts.push(`SameSite=${options.sameSite}`);
	}

	if (options.secure) {
		parts.push("Secure");
	}

	if (options.expires) {
		const date =
			options.expires instanceof Date
				? options.expires
				: new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000);
		parts.push(`expires=${date.toUTCString()}`);
	}

	return parts.join(";");
};

export default formatCookieString;
