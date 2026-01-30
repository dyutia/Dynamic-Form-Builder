import FormRenderer from "./FormRenderer";

export default {
	title: "Dynamic Form/FormRenderer",
	component: FormRenderer,
};

export const Default = () => {
	localStorage.removeItem("dynamic-form-data");
	return <FormRenderer />;
};

export const PreFilled = () => {
	localStorage.setItem(
		"dynamic-form-data",
		JSON.stringify({
			name: "John Doe",
			email: "john@gmail.com",
			age: 25,
			country: "USA",
			phones: [{ phone: "1234567890" }],
		}),
	);
	return <FormRenderer />;
};

export const RepeatableGroup = () => {
	localStorage.setItem(
		"dynamic-form-data",
		JSON.stringify({
			name: "Alice Smith",
			email: "alice@example.com",
			phones: [
				{ phone: "1111111111" },
				{ phone: "2222222222" },
				{ phone: "3333333333" },
			],
		}),
	);
	return <FormRenderer />;
};

export const ConditionalFields = () => {
	localStorage.setItem(
		"dynamic-form-data",
		JSON.stringify({
			name: "Bob Brown",
			email: "bob@example.com",
			age: 30,
			phones: [{ phone: "9876543210" }],
		}),
	);
	return <FormRenderer />;
};

export const AsyncSelect = () => {
	localStorage.setItem(
		"dynamic-form-data",
		JSON.stringify({
			name: "Eve White",
			email: "eve@example.com",
			country: "",
			phones: [{ phone: "5555555555" }],
		}),
	);
	return <FormRenderer />;
};
