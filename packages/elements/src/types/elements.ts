import type {
	Store,
	StoreModule,
	StoreActions,
	StoreState,
	Handlers,
	HandlerDirectives,
	// StoreDirectives,
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
	handlerDirectives: HandlerDirectives;
	stores: Map<string, Store<StoreState, StoreActions>>;
	storeModules: Map<string, StoreModule<StoreState, StoreActions>>;
	// storeDirectives: StoreDirectives;
	syncedElements: Map<Element, () => void>;
};
