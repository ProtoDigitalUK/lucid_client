export type TrapState = {
	element: HTMLElement;
	previousActiveElement: HTMLElement | null;
	siblingElements: HTMLElement[];
};

export type TrapConfig = {
	trapBothWays: boolean;
};
