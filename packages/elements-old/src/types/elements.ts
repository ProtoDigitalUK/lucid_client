import type {
	Store,
	StoreModule,
	StoreActions,
	StoreState,
	Handlers,
} from "./index.js";

export type ElementsInstance = {
	options: {
		debug: boolean;
		attributes: {
			prefix: string;
			selectors: {
				store: string;
				state: string;
				bind: string;
				effect: string;
				loop: string;
				handler: string;
				ref: string;
			};
			seperators: {
				scope: string;
				handler: string;
			};
		};
	};
	started: boolean;
	handlers: Handlers;
	stores: Map<string, Store<StoreState, StoreActions>>;
	storeModules: Map<string, StoreModule<StoreState, StoreActions>>;
	syncedElements: Map<Element, () => void>;
};
