import { describe, expect, it } from 'bun:test';
import type { ValidationError } from '../../types';
import {
	createValidator,
	formatValidationErrorMessage,
	isValidJsonSchema,
	transformValidationErrors,
	validateData,
} from '../validator';

describe('validator', () => {
	describe('isValidJsonSchema', () => {
		it('should return true for valid JSON Schema', () => {
			const schema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
				},
			};

			expect(isValidJsonSchema(schema)).toBe(true);
		});

		it('should return true for complex valid schema', () => {
			const schema = {
				type: 'object',
				properties: {
					user: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							age: { type: 'number' },
						},
						required: ['name'],
					},
				},
			};

			expect(isValidJsonSchema(schema)).toBe(true);
		});

		it('should return false for invalid schema with wrong type reference', () => {
			const schema = {
				type: 'invalid-type',
			};

			expect(isValidJsonSchema(schema)).toBe(false);
		});

		it('should return false for schema with invalid structure', () => {
			const schema = {
				type: 'object',
				properties: 'not-an-object',
			};

			expect(isValidJsonSchema(schema)).toBe(false);
		});

		it('should return true for empty schema', () => {
			const schema = {};

			expect(isValidJsonSchema(schema)).toBe(true);
		});
	});

	describe('createValidator', () => {
		it('should create validator for simple schema', () => {
			const schema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
				},
			};

			const validator = createValidator(schema);

			expect(validator).toBeDefined();
			expect(typeof validator).toBe('function');
		});

		it('should create validator for complex schema', () => {
			const schema = {
				type: 'object',
				properties: {
					user: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							age: { type: 'number' },
						},
						required: ['name'],
					},
				},
			};

			const validator = createValidator(schema);

			expect(validator).toBeDefined();
		});
	});

	describe('validateData', () => {
		it('should validate valid data successfully', () => {
			const schema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
				},
				required: ['name'],
			};

			const validator = createValidator(schema);
			const result = validateData(validator, { name: 'John' });

			expect(result.isValid).toBe(true);
			expect(result.errors).toEqual([]);
		});

		it('should return validation errors for invalid data', () => {
			const schema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
				},
				required: ['name'],
			};

			const validator = createValidator(schema);
			const result = validateData(validator, {});

			expect(result.isValid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].keyword).toBe('required');
		});

		it('should validate type mismatches', () => {
			const schema = {
				type: 'object',
				properties: {
					age: { type: 'number' },
				},
			};

			const validator = createValidator(schema);
			const result = validateData(validator, { age: 'not a number' });

			expect(result.isValid).toBe(false);
			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].keyword).toBe('type');
			expect(result.errors[0].field).toBe('/age');
		});

		it('should return multiple errors when allErrors is enabled', () => {
			const schema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
					age: { type: 'number' },
				},
				required: ['name', 'age'],
			};

			const validator = createValidator(schema);
			const result = validateData(validator, {});

			expect(result.isValid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(0);
		});

		it('should validate nested objects', () => {
			const schema = {
				type: 'object',
				properties: {
					user: {
						type: 'object',
						properties: {
							name: { type: 'string' },
						},
						required: ['name'],
					},
				},
			};

			const validator = createValidator(schema);
			const result = validateData(validator, { user: {} });

			expect(result.isValid).toBe(false);
			expect(result.errors[0].field).toContain('/user');
		});
	});

	describe('transformValidationErrors', () => {
		it('should transform AJV errors correctly', () => {
			const schema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
				},
				required: ['name'],
			};

			const validator = createValidator(schema);
			validator({}); // Trigger validation to populate errors

			const errors = transformValidationErrors(validator);

			expect(errors).toHaveLength(1);
			expect(errors[0]).toHaveProperty('field');
			expect(errors[0]).toHaveProperty('message');
			expect(errors[0]).toHaveProperty('keyword');
			expect(errors[0]).toHaveProperty('params');
		});

		it('should use "/" as default field for root errors', () => {
			const schema = { type: 'string' };

			const validator = createValidator(schema);
			validator(123); // Invalid type

			const errors = transformValidationErrors(validator);

			expect(errors[0].field).toBe('/');
		});

		it('should return empty array when no errors', () => {
			const schema = { type: 'object' };

			const validator = createValidator(schema);
			validator({}); // Valid

			const errors = transformValidationErrors(validator);

			expect(errors).toEqual([]);
		});
	});

	describe('formatValidationErrorMessage', () => {
		it('should format single error', () => {
			const errors: ValidationError[] = [
				{
					field: '/name',
					message: 'must be string',
					keyword: 'type',
					params: { type: 'string' },
				},
			];

			const result = formatValidationErrorMessage(errors);

			expect(result).toBe('/name: must be string');
		});

		it('should format multiple errors with comma separation', () => {
			const errors: ValidationError[] = [
				{
					field: '/name',
					message: 'must be string',
					keyword: 'type',
					params: { type: 'string' },
				},
				{
					field: '/age',
					message: 'must be number',
					keyword: 'type',
					params: { type: 'number' },
				},
			];

			const result = formatValidationErrorMessage(errors);

			expect(result).toBe('/name: must be string, /age: must be number');
		});

		it('should return empty string for empty errors array', () => {
			const result = formatValidationErrorMessage([]);

			expect(result).toBe('');
		});

		it('should handle nested field paths', () => {
			const errors: ValidationError[] = [
				{
					field: '/user/profile/name',
					message: 'is required',
					keyword: 'required',
					params: { missingProperty: 'name' },
				},
			];

			const result = formatValidationErrorMessage(errors);

			expect(result).toBe('/user/profile/name: is required');
		});
	});
});
