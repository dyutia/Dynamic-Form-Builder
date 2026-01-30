Dynamic Form Builder

This is a schema-driven dynamic form builder built with React 18 + TypeScript (strict mode) and styled using Tailwind CSS. The form supports:

Nested fields and repeatable groups

Conditional logic (showIf)

Async dropdown options

Validation pipelines (sync + async)

Autosave and resume

Full keyboard navigation and accessibility compliance

All components are demonstrated via Storybook.

Tech Stack

React 18+

TypeScript (strict mode enabled)

Vite

Tailwind CSS

Storybook

Folder Structure:

DynamicFormAssignment/
├─ src/ # Form components & schema
├─ storybook-static/ # Built Storybook files
├─ SchemaDocumentation.md  
└─ README.md # This file

How to Run Locally

1.Install dependencies:
npm install

2.Start Storybook:
npm run storybook

3.Build Storybook (for deployment/public link):
npm run build-storybook

4.Start the React app:
npm run dev

Storybook

Public URL: https://dynamic-form-builder-9vct.vercel.app

Includes stories for: Default, PreFilled, RepeatableGroup, ConditionalFields, AsyncSelect.
