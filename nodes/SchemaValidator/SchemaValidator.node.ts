import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { extractDataToValidate } from './lib/dataExtractor';
import { parseSchema } from './lib/schemaParser';
import {
	createValidator,
	formatValidationErrorMessage,
	isValidJsonSchema,
	validateData,
} from './lib/validator';
import type { DataSource } from './types';

export class SchemaValidator implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Schema Validator',
		name: 'schemaValidator',
		icon: 'file:SchemaValidator.svg',
		group: ['transform'],
		version: 1,
		description: 'Validates JSON data against a JSON Schema',
		defaults: {
			name: 'Schema Validator',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: 'JSON Schema',
				name: 'jsonSchema',
				type: 'json',
				default:
					'{\n  "type": "object",\n  "properties": {\n    "name": {\n      "type": "string"\n    }\n  },\n  "required": ["name"]\n}',
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
		const returnData: INodeExecutionData[] = [];

		const schemaJson = this.getNodeParameter('jsonSchema', 0) as string;
		const dataSource = this.getNodeParameter('dataSource', 0) as DataSource;

		let schema: object;
		try {
			schema = parseSchema(schemaJson);
			// Validate that it's a proper JSON Schema
			const validationResult = isValidJsonSchema(schema);
			if (!validationResult.isValid) {
				throw new Error(
					`Invalid JSON Schema Format: ${validationResult.error || 'Unknown schema validation error'}`,
				);
			}
		} catch (error) {
			throw new NodeOperationError(this.getNode(), error);
		}

		// Compile schema once for reuse across all items
		const validator = createValidator(schema);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const item = items[itemIndex];

			try {
				const customJsonParam =
					dataSource === 'customJson'
						? (this.getNodeParameter('customJson', itemIndex) as string)
						: undefined;

				const dataToValidate = extractDataToValidate(item, dataSource, customJsonParam);
				const { isValid, errors } = validateData(validator, dataToValidate);

				if (!isValid) {
					const errorMessage = formatValidationErrorMessage(errors);
					throw new NodeOperationError(
						this.getNode(),
						`JSON Schema validation failed: ${errorMessage}`,
						{
							itemIndex,
							description: JSON.stringify(errors),
						},
					);
				}

				returnData.push(item);
			} catch (error) {
				// Route to error output if "Continue on Fail" enabled, otherwise stop execution
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: itemIndex,
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
