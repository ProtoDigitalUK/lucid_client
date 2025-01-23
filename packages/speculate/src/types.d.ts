export type SpeculationTriggers =
	| "visible"
	| "immediate"
	| "eager"
	| "moderate"
	| "conservative";

export type SpeculationActions = "prefetch" | "prerender";

export type PrefetchDataConfig<T> = {
	target: string;
	fetch: () => Promise<T>;
	onClick: (res: T) => void;
	staletime?: number;
};
