import type { INodeExecutionData } from 'n8n-workflow';
import type { DataSource } from '../types';

/**
 * Extracts data to validate from custom JSON parameter.
 * @param customJsonParam Custom JSON string or object
 * @returns Parsed data
 * @throws Error if JSON is invalid
 */
export function extractCustomJsonData(customJsonParam: string | object): unknown {
	if (typeof customJsonParam === 'string') {
		return JSON.parse(customJsonParam);
	}
	return customJsonParam;
}

/**
 * Determines what data to validate based on data source.
 * @param item Input item
 * @param dataSource Data source type
 * @param customJsonParam Custom JSON parameter (required if dataSource is 'customJson')
 * @returns Data to validate
 */
export function extractDataToValidate(
	item: INodeExecutionData,
	dataSource: DataSource,
	customJsonParam?: string | object,
): unknown {
	if (dataSource === 'customJson') {
		if (!customJsonParam) {
			throw new Error('Custom JSON is required when Data Source is "Custom JSON"');
		}
		return extractCustomJsonData(customJsonParam);
	}
	return item.json;
}
