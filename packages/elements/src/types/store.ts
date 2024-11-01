import type { SetStoreFunction } from "solid-js/store";
import type { Signal } from "solid-js";
import type { BindStateAttributesMap, StateAttribtuesMap } from "./index.js";

export type AttributeMaps = {
	scope: string | null;
	state: StateAttribtuesMap;
	bindState: BindStateAttributesMap;
	bindActions: BindStateAttributesMap;
};

export type Refs = Map<string, Element | Element[]>;

export type StoreState = Record<string, unknown>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Action = (...args: any[]) => unknown;
export type StoreActions = Record<string, Action>;

export type StoreData<S extends StoreState, A extends StoreActions> = {
	initialised: boolean;
	dispose: () => void;
	attributeMaps?: AttributeMaps;
	stateObserver?: MutationObserver;
	state: { [K in keyof S]: Signal<S[K]> };
	actions: A;
	refs: Refs;
};

export type Store<S extends StoreState, A extends StoreActions> = [
	get: StoreData<S, A>,
	set: SetStoreFunction<StoreData<S, A>>,
];

export type StoreInterface<S extends StoreState, A extends StoreActions> = {
	state: { [K in keyof S]: Signal<S[K]> };
	actions: A;
	refs: Refs;
};

export type StoreModule<S extends StoreState, A extends StoreActions> = (
	store: StoreInterface<S, A>,
) => {
	state?: Partial<{ [K in keyof S]: Signal<S[K]> }>;
	actions: A;
};
