const C = {
	prefix: "[Elements]",
	defaults: {
		debug: false,
		attributes: {
			prefix: "data-",
			selectors: {
				store: "store",
				ref: "ref",
				state: "state--",
				bind: "bind--",
				effect: "effect",
				handler: "handler--",
				loop: "loop",
			},
			seperators: {
				scope: ":",
				handler: ".",
			},
			denote: {
				action: "@",
				state: "$",
			},
		},
		specifier: "",
	},
};

export default C;
