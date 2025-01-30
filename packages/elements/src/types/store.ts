import type { SetStoreFunction } from "solid-js/store";
import type { Signal } from "solid-js";
import type {
	BindStateDirectives,
	StateDirectives,
	EffectDirectives,
} from "./index.js";

export type DirectiveMap = {
	scope: string;
	state: StateDirectives;
	effects: EffectDirectives;
	bindState: BindStateDirectives;
	bindActions: BindStateDirectives;
};
export type StoreDirectives = Map<string, DirectiveMap>;

export type Refs = Map<string, Element | Element[]>;

export type StoreState = Record<string, unknown>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Action = (...args: any[]) => unknown;
export type StoreActions = Record<string, Action>;

export type Effect = (context: {
	isInitial: boolean;
}) => void;
export type StoreEffects = Record<string, Effect>;

export type StoreData<S extends StoreState, A extends StoreActions> = {
	key: string;
	initialised: boolean;
	dispose: () => void;
	stateObserver?: MutationObserver;
	state: { [K in keyof S]: Signal<S[K]> };
	actions: A;
	effects: {
		global: StoreEffects;
		manual: StoreEffects;
	};
	refs: Refs;
	cleanup?: () => void;
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
	effects?: {
		global?: StoreEffects;
		manual?: StoreEffects;
	};
	cleanup?: () => void;
};

export type StoreMember =
	| { type: "action"; key: string; member: Action }
	| { type: "state"; key: string; member: Signal<unknown> };
