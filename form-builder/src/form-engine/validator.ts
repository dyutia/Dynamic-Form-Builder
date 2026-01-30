import type { FormSchema } from "./schema";

export async function validateForm(
	schema: FormSchema,
	formData: Record<string, any>,
) {
	const errors: Record<string, any> = {};

	for (const field of schema.fields) {
		const value = formData[field.id];

		// REPEATABLE GROUP VALIDATION
		if (field.type === "group" && field.repeatable && field.fields) {
			if (!value || value.length === 0) {
				if (field.required) errors[field.id] = "At least one entry is required";
			} else {
				const groupErrors: any[] = [];
				value.forEach((item: any) => {
					const itemErrors: Record<string, string> = {};
					field.fields!.forEach((subField) => {
						const subValue = item[subField.id];

						if (subField.required && !subValue)
							itemErrors[subField.id] = `${subField.label} is required`;

						if (
							subField.id === "phone" &&
							subValue &&
							!/^\d{10}$/.test(subValue)
						)
							itemErrors[subField.id] = "Phone number must be 10 digits";

						if (
							subField.type === "email" &&
							subValue &&
							!subValue.includes("@")
						)
							itemErrors[subField.id] = "Invalid email address";
					});
					groupErrors.push(itemErrors);
				});
				if (groupErrors.some((e) => Object.keys(e).length > 0))
					errors[field.id] = groupErrors;
			}
			continue;
		}

		// REGULAR FIELD VALIDATION
		if (field.required && !value)
			errors[field.id] = `${field.label} is required`;

		if (field.type === "email" && value) {
			if (!value.includes("@")) {
				errors[field.id] = "Invalid email address";
			} else {
				// Simulated async check for email uniqueness
				const takenEmails = ["test@gmail.com", "demo@gmail.com"];
				await new Promise((res) => setTimeout(res, 500));
				if (takenEmails.includes(value))
					errors[field.id] = "Email already registered";
			}
		}

		if (field.type === "number" && value && isNaN(Number(value)))
			errors[field.id] = "Must be a number";
	}

	return errors;
}
