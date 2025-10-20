import { describe, expect, it } from 'bun:test';
import type { INodeExecutionData } from 'n8n-workflow';
import { extractCustomJsonData, extractDataToValidate } from '../dataExtractor';

describe('dataExtractor', () => {
	describe('extractCustomJsonData', () => {
		it('should parse JSON string', () => {
			const jsonString = '{"name": "John", "age": 30}';
			const result = extractCustomJsonData(jsonString);

			expect(result).toEqual({ name: 'John', age: 30 });
		});

		it('should return object as-is', () => {
			const jsonObject = { name: 'John', age: 30 };
			const result = extractCustomJsonData(jsonObject);

			expect(result).toEqual(jsonObject);
			expect(result).toBe(jsonObject);
		});

		it('should handle arrays', () => {
			const arrayString = '[1, 2, 3]';
			const result = extractCustomJsonData(arrayString);

			expect(result).toEqual([1, 2, 3]);
		});

		it('should throw error for invalid JSON', () => {
			const invalidJson = '{name: "John"}';

			expect(() => extractCustomJsonData(invalidJson)).toThrow();
		});
	});

	describe('extractDataToValidate', () => {
		const mockItem: INodeExecutionData = {
			json: { id: 1, name: 'Test' },
		};

		it('should extract data from item.json when dataSource is entireItem', () => {
			const result = extractDataToValidate(mockItem, 'entireItem');

			expect(result).toEqual({ id: 1, name: 'Test' });
		});

		it('should extract custom JSON when dataSource is customJson', () => {
			const customJson = '{"custom": "data"}';
			const result = extractDataToValidate(mockItem, 'customJson', customJson);

			expect(result).toEqual({ custom: 'data' });
		});

		it('should extract custom JSON object when already parsed', () => {
			const customJson = { custom: 'data' };
			const result = extractDataToValidate(mockItem, 'customJson', customJson);

			expect(result).toEqual({ custom: 'data' });
		});

		it('should throw error when customJson is required but not provided', () => {
			expect(() => extractDataToValidate(mockItem, 'customJson')).toThrow(
				'Custom JSON is required when Data Source is "Custom JSON"',
			);
		});

		it('should throw error when customJson is empty string', () => {
			expect(() => extractDataToValidate(mockItem, 'customJson', '')).toThrow(
				'Custom JSON is required when Data Source is "Custom JSON"',
			);
		});

		it('should handle complex nested data from item', () => {
			const complexItem: INodeExecutionData = {
				json: {
					user: {
						profile: {
							name: 'John',
							contacts: ['email@test.com'],
						},
					},
				},
			};

			const result = extractDataToValidate(complexItem, 'entireItem');

			expect(result).toEqual(complexItem.json);
		});
	});
});
