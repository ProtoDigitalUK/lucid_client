import { Speculator } from "@lucidclient/speculate";

const speculator = new Speculator({
	elements: document.querySelectorAll("[data-page]"),
	optimistic: {
		elements: document.querySelectorAll("[data-page='2']"),
		condition: () => true,
	},
	fetch: async (element) => {
		const page = element.getAttribute("data-page");

		await new Promise((resolve) => setTimeout(resolve, 1000));
		// console.log(page);

		if (page === "1") {
			return {
				data: undefined,
				error: {
					message: "WE DONT ALLOW PAGE 1!!" as const,
					details: {
						helloWOrld: true,
					},
				},
			};
		}

		return {
			data: {
				page: Number(page),
			},
			error: undefined,
		};
	},
	getCacheKey: (element) => {
		return element.getAttribute("data-page");
	},
	onClick: async (e, data) => {
		e.preventDefault();
		if (data.error) {
			console.log("error", data.error);
			return;
		}

		console.log("clicked", data.data);
	},
	cache: {
		maxSize: 2,
	},
});

const page3 = document.querySelector("[data-page='3']");
if (page3) speculator.prefetch(page3);
