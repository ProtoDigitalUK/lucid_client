const C = {
	prefix: "[Elements]",
	defaults: {
		debug: false,
		attributes: {
			prefix: "data-",
			selectors: {
				element: "element",
				state: "state--",
				bind: "bind--",
				handler: "handler--",
				ref: "ref",
			},
			seperators: {
				scope: ":",
				handler: ".",
			},
			denote: {
				action: "@",
			},
		},
	},
};

export default C;
