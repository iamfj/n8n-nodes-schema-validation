import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import Ajv from 'ajv';

export class SchemaValidator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JSON Schema Validator',
		name: 'schemaValidator',
		icon: 'fa:check-circle',
		group: ['transform'],
		version: 1,
		description: 'Validates JSON data against a JSON Schema',
		defaults: {
			name: 'JSON Schema Validator',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [
			{
				type: NodeConnectionTypes.Main,
				displayName: 'Valid',
			},
			{
				type: NodeConnectionTypes.Main,
				displayName: 'Invalid',
			},
		],
		properties: [
			{
				displayName: 'JSON Schema',
				name: 'jsonSchema',
				type: 'json',
				default: '{\n  "type": "object",\n  "properties": {\n    "name": {\n      "type": "string"\n    }\n  },\n  "required": ["name"]\n}',
				description: 'The JSON Schema to validate against',
				required: true,
			},
			{
				displayName: 'Data Source',
				name: 'dataSource',
				type: 'options',
				options: [
					{
						name: 'Input Data',
						value: 'entireItem',
						description: 'Validate the JSON data from the input',
					},
					{
						name: 'Custom JSON',
						value: 'customJson',
						description: 'Validate custom JSON data (supports expressions)',
					},
				],
				default: 'entireItem',
				description: 'What data to validate',
			},
			{
				displayName: 'Custom JSON',
				name: 'customJson',
				type: 'json',
				default: '',
				placeholder: '={{ $json }}',
				description: 'Custom JSON data to validate (can use expressions)',
				displayOptions: {
					show: {
						dataSource: ['customJson'],
					},
				},
			},
		],
	};

	/**
	 * Executes the JSON Schema validation for each input item.
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const validItems: INodeExecutionData[] = [];
		const invalidItems: INodeExecutionData[] = [];

		// Get schema once (same for all items)
		const schemaJson = this.getNodeParameter('jsonSchema', 0) as string;
		const dataSource = this.getNodeParameter('dataSource', 0) as string;

		let schema: object;
		try {
			schema = typeof schemaJson === 'string' ? JSON.parse(schemaJson) : schemaJson;
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON Schema: ${error.message}`,
			);
		}

		// Initialize AJV validator
		const ajv = new Ajv({ allErrors: true });
		const validate = ajv.compile(schema);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const item = items[itemIndex];
			let dataToValidate: unknown;

			try {
				// Determine what data to validate
				if (dataSource === 'customJson') {
					const customJsonParam = this.getNodeParameter('customJson', itemIndex) as string;
					if (!customJsonParam) {
						throw new NodeOperationError(
							this.getNode(),
							'Custom JSON is required when Data Source is "Custom JSON"',
							{ itemIndex },
						);
					}
					// Parse if string, otherwise use as-is (in case it's already an object from expression)
					dataToValidate = typeof customJsonParam === 'string' 
						? JSON.parse(customJsonParam) 
						: customJsonParam;
				} else {
					dataToValidate = item.json;
				}

				// Validate the data
				const isValid = validate(dataToValidate);

				if (isValid) {
					validItems.push(item);
				} else {
					const invalidItem = {
						json: {
							validationErrors: validate.errors?.map((err) => ({
								field: err.instancePath || '/',
								message: err.message,
								keyword: err.keyword,
								params: err.params,
							})) || [],
						},
						pairedItem: itemIndex,
					};
					invalidItems.push(invalidItem);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					invalidItems.push({
						json: {
							...item.json,
							error: error.message,
						},
						pairedItem: itemIndex,
					});
				} else {
					throw new NodeOperationError(this.getNode(), error, { itemIndex });
				}
			}
		}

		return [validItems, invalidItems];
	}
}
