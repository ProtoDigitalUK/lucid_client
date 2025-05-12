import { createSignal } from "@lucidclient/elements-old";
import type { StoreModule } from "@lucidclient/elements-old/types";

type BindState = {
	storeState: number;
};
// biome-ignore lint/complexity/noBannedTypes: <explanation>
type BindActions = {};

const bindsStore: StoreModule<BindState, BindActions> = (store) => ({
	state: {
		storeState: createSignal(69),
	},
	actions: {
		incrementStoreState: () => {
			const [_, setStoreState] = store.state.storeState;
			setStoreState((prev) => prev + 1);
		},
	},
});

export default bindsStore;
