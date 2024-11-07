import type { ConsentChange } from "./types.js";

const cookieController: {
	onConsentChange?: (data: ConsentChange) => void;
	versioning?: {
		current: string;
		onNewVersion?: (oldVersion: string, newVersion: string) => void;
	};
} = {
	onConsentChange: undefined,
	versioning: undefined,
};

export default cookieController;
