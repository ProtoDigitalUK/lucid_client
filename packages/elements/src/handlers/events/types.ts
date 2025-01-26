export type EventConfig = {
	target: "element" | "document" | "body" | "head" | "window";
	eventName: string | undefined;
};
