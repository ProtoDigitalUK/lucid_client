import type { StoreModule } from "@lucidclient/elements/types";

const loopsStore: StoreModule<
	{
		items: Array<{
			title: string;
		}>;
	},
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{}
> = (store) => ({
	actions: {
		init: () => {
			console.log("store", store);
		},
		childOnClick: () => {
			const [getItems, setItems] = store.state.items;
			const items = getItems();
			items.push({ title: "A new title?" });
			setItems([...items]);
		},
		getItems: () => {
			const [getItems] = store.state.items;
			return getItems();
		},
	},
});

export default loopsStore;
