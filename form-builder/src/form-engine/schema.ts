export type FieldType =
	| "text"
	| "email"
	| "number"
	| "select"
	| "checkbox"
	| "group";

export interface FieldSchema {
	id: string;
	
	label: string;
	type: FieldType;
	required?: boolean;
	showIf?: {
		field: string;
		exists?: boolean;
		equals?: any;
	};
	fields?: FieldSchema[];
	repeatable?: boolean;
	asyncOptions?: boolean;
}

export interface FormSchema {
	id: string;
	title: string;
	fields: FieldSchema[];
}

export const formSchema: FormSchema = {
	id: "userForm",
	title: "User Information Form",
	fields: [
		{
			id: "name",
			label: "Full Name",
			type: "text",
			required: true,
		},
		{
			id: "email",
			label: "Email Address",
			type: "email",
			required: true,
		},
		{
			id: "age",
			label: "Age",
			type: "number",
			required: false,
			showIf: {
				field: "email",
				exists: true,
			},
		},
		{
			id: "country",
			label: "Country",
			type: "select",
			required: true,
			asyncOptions: true,
		},
		{
			id: "phones",
			label: "Phone Numbers",
			type: "group",
			repeatable: true,
			fields: [
				{
					id: "phone",
					label: "Phone",
					type: "text",
					required: true,
				},
			],
		},
	],
};
