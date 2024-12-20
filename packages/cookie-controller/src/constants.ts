export default {
	key: "CookieController",
	ids: {
		details: "cookie-details",
		alert: "cookie-alert",
	},
	attributes: {
		details: "data-cookie-details",
		alert: "data-cookie-alert",
		cookieCategory: "data-cookie-category",
		action: {
			attribute: "data-cookie-action",
			value: {
				dismiss: "dismiss",
				accept: "accept",
				reject: "reject",
				details: "details",
				save: "save",
			},
		},
	},
};
