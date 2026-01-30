import React, { useState, useEffect } from "react";
import { formSchema } from "../form-engine/schema";
import type { FieldSchema } from "../form-engine/schema";
import { validateForm } from "../form-engine/validator";

const FormRenderer: React.FC = () => {
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, any>>({});
	const [options, setOptions] = useState<Record<string, string[]>>({});

	// Handle normal fields
	const handleChange = async (id: string, value: any) => {
		const updatedData = { ...formData, [id]: value };
		setFormData(updatedData);
		const validationErrors = await validateForm(formSchema, updatedData);
		setErrors(validationErrors);
	};

	// Handle repeatable group changes
	const handleGroupChange = async (
		groupId: string,
		index: number,
		fieldId: string,
		value: any,
	) => {
		const updatedGroup = (formData[groupId] || []).map(
			(item: any, i: number) =>
				i === index ? { ...item, [fieldId]: value } : item,
		);
		const updatedData = { ...formData, [groupId]: updatedGroup };
		setFormData(updatedData);
		const validationErrors = await validateForm(formSchema, updatedData);
		setErrors(validationErrors);
	};

	// Add new item to repeatable group
	const addGroupItem = (groupId: string, fields: FieldSchema[]) => {
		const newItem: Record<string, any> = {};
		fields.forEach((f) => (newItem[f.id] = ""));
		const updatedGroup = [...(formData[groupId] || []), newItem];
		setFormData({ ...formData, [groupId]: updatedGroup });

		// Focus new input
		setTimeout(() => {
			const inputs = document.querySelectorAll<HTMLInputElement>(
				`input[name="${groupId}-${fields[0].id}"]`,
			);
			inputs[inputs.length - 1]?.focus();
		}, 0);
	};

	// Remove item from repeatable group
	const removeGroupItem = (groupId: string, index: number) => {
		const updatedGroup = (formData[groupId] || []).filter(
			(_: any, i: number) => i !== index,
		);
		setFormData({ ...formData, [groupId]: updatedGroup });
	};

	// Load async select options
	useEffect(() => {
		formSchema.fields.forEach((field) => {
			if (field.type === "select" && field.asyncOptions) {
				setTimeout(() => {
					setOptions((prev) => ({
						...prev,
						[field.id]: ["India", "USA", "Germany", "Japan"],
					}));
				}, 1000);
			}
		});
	}, []);

	// Load saved form data
	useEffect(() => {
		const savedData = localStorage.getItem("dynamic-form-data");
		if (savedData) {
			const parsed = JSON.parse(savedData);
			setFormData(parsed);
			validateForm(formSchema, parsed).then(setErrors);
		}
	}, []);

	// Autosave form data
	useEffect(() => {
		localStorage.setItem("dynamic-form-data", JSON.stringify(formData));
	}, [formData]);

	// Handle autosave conflicts across tabs
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "dynamic-form-data" && event.newValue) {
				const externalData = JSON.parse(event.newValue);
				if (JSON.stringify(formData) !== JSON.stringify(externalData)) {
					if (
						confirm(
							"Form data changed elsewhere. Do you want to load latest data?",
						)
					) {
						setFormData(externalData);
					}
				}
			}
		};
		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [formData]);

	return (
		<form className="max-w-xl w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-semibold mb-6 text-gray-800">
				{formSchema.title}
			</h2>

			{formSchema.fields.map((field) => {
				// Conditional logic
				if (field.showIf) {
					const dependentValue = formData[field.showIf.field];
					if (field.showIf.exists && !dependentValue) return null;
					if (
						field.showIf.equals !== undefined &&
						dependentValue !== field.showIf.equals
					)
						return null;
				}

				// Repeatable group
				if (field.type === "group" && field.repeatable && field.fields) {
					const groupData: any[] = formData[field.id] || [];
					return (
						<div
							key={field.id}
							className="mb-6"
							role="group"
							aria-label={field.label}
						>
							<label className="block text-gray-700 font-medium mb-2">
								{field.label}
							</label>

							{groupData.map((item, index) => (
								<div
									key={index}
									className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 bg-gray-50 p-2 rounded border border-gray-200"
								>
									{field.fields!.map((subField) => (
										<div key={subField.id} className="flex-1 w-full">
											<input
												type={subField.type === "number" ? "number" : "text"}
												id={`${field.id}-${subField.id}-${index}`}
												name={`${field.id}-${subField.id}`}
												value={item[subField.id] || ""}
												onChange={(e) =>
													handleGroupChange(
														field.id,
														index,
														subField.id,
														e.target.value,
													)
												}
												placeholder={subField.label}
												aria-label={`${subField.label} ${index + 1}`}
												aria-describedby={
													errors[field.id]?.[index]?.[subField.id]
														? `${field.id}-${subField.id}-${index}-error`
														: undefined
												}
												className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
											/>
											{errors[field.id]?.[index]?.[subField.id] && (
												<p
													id={`${field.id}-${subField.id}-${index}-error`}
													className="text-red-500 text-sm mt-1"
												>
													{errors[field.id][index][subField.id]}
												</p>
											)}
										</div>
									))}

									<button
										type="button"
										onClick={() => removeGroupItem(field.id, index)}
										className="px-3 py-1 mt-2 sm:mt-0 bg-red-500 text-white rounded hover:bg-red-600"
									>
										Remove
									</button>
								</div>
							))}

							<button
								type="button"
								onClick={() => addGroupItem(field.id, field.fields!)}
								className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Add {field.label}
							</button>
						</div>
					);
				}

				// Regular fields
				return (
					<div key={field.id} className="mb-4 w-full">
						<label
							className="block text-gray-700 font-medium mb-1"
							htmlFor={field.id}
						>
							{field.label} {field.required && "*"}
						</label>

						{field.type === "text" ||
						field.type === "email" ||
						field.type === "number" ? (
							<input
								id={field.id}
								type={field.type === "number" ? "number" : field.type}
								value={formData[field.id] || ""}
								onChange={(e) => handleChange(field.id, e.target.value)}
								aria-describedby={
									errors[field.id] ? `${field.id}-error` : undefined
								}
								className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
							/>
						) : null}

						{field.type === "select" && (
							<select
								id={field.id}
								value={formData[field.id] || ""}
								onChange={(e) => handleChange(field.id, e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
							>
								<option value="">
									{options[field.id] ? "Select..." : "Loading..."}
								</option>
								{options[field.id]?.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
						)}

						{errors[field.id] && (
							<p id={`${field.id}-error`} className="text-red-500 text-sm mt-1">
								{errors[field.id]}
							</p>
						)}
					</div>
				);
			})}
		</form>
	);
};

export default FormRenderer;
