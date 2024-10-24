import type { Store, StoreModule, StoreActions, StoreState } from "./index.js";

export type ElementsInstance = {
	options: {
		debug: boolean;
		attributes: {
			prefix: string;
			selectors: {
				element: string;
				state: string;
				bind: string;
				handler: string;
				ref: string;
				scope: string;
			};
			seperators: {
				scope: string;
				handler: string;
			};
		};
	};
	started: boolean;
	plugins: string[];
	storeModules: Map<string, StoreModule<StoreState, StoreActions>>;
	stores: Map<string, Store<StoreState, StoreActions>>;
	trackedElements: WeakSet<HTMLElement>;
};
