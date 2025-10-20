import { describe, expect, it } from 'bun:test';
import { parseSchema } from '../schemaParser';

describe('schemaParser', () => {
	describe('parseSchema', () => {
		it('should parse valid JSON string', () => {
			const schemaString = '{"type": "object"}';
			const result = parseSchema(schemaString);

			expect(result).toEqual({ type: 'object' });
		});

		it('should return object as-is when already parsed', () => {
			const schemaObject = { type: 'object', properties: { name: { type: 'string' } } };
			const result = parseSchema(schemaObject);

			expect(result).toEqual(schemaObject);
			expect(result).toBe(schemaObject);
		});

		it('should handle complex schema with nested properties', () => {
			const complexSchema = `{
				"type": "object",
				"properties": {
					"user": {
						"type": "object",
						"properties": {
							"name": { "type": "string" },
							"age": { "type": "number" }
						}
					}
				}
			}`;

			const result = parseSchema(complexSchema);

			expect(result).toEqual({
				type: 'object',
				properties: {
					user: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							age: { type: 'number' },
						},
					},
				},
			});
		});

		it('should throw error for invalid JSON string', () => {
			const invalidJson = '{"type": "object"';

			expect(() => parseSchema(invalidJson)).toThrow();
		});

		it('should throw error for malformed JSON', () => {
			const malformedJson = '{type: object}';

			expect(() => parseSchema(malformedJson)).toThrow();
		});
	});
});
