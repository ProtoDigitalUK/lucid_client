import { createSignal } from "@lucidclient/elements-old";
import type { StoreModule } from "@lucidclient/elements-old/types";

const exampleStore: StoreModule<
	{
		boolean: boolean;
		number: number;
		string: string;
		// object: Record<string, string>;
		// array: Array<string>;
		customState: string;
	},
	{
		init: () => void;
		handleClick: () => void;
	}
> = (store) => ({
	state: {
		customState: createSignal("hello world"),
	},
	actions: {
		init() {
			store.actions.handleClick(); // or this.handleClick()
		},
		contentCopy: () => {
			const [getBoolean] = store.state.boolean;
			if (getBoolean()) return "yea im open";
			return "no imma closed";
		},
		handleClick: () => {
			const [_, setBoolean] = store.state.boolean;
			// const [getNumber] = store.state.number;
			// const [getString] = store.state.string;
			// const [getObject] = store.state.object;
			// const [getArray] = store.state.array;
			// const [getCustomState] = store.state.customState;

			// setInterval(() => {
			// 	console.log(getDisabled());
			// }, 1000);

			// console.log(getBoolean());
			// console.log(getNumber());
			// console.log(getString());
			// console.log(getObject());
			// console.log(getArray());
			// console.log(getCustomState());

			// console.log(store.refs.get('button'))
			setBoolean((prev) => !prev);
		},
	},
	effects: {
		manual: {
			elementEffect: (context) => {
				console.log("element effect", context);
			},
		},
	},
});

export default exampleStore;
