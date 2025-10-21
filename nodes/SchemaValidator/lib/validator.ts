import Ajv, { type ValidateFunction } from 'ajv';
import type { ValidationError, ValidationResult } from '../types';

const ajv = new Ajv({ allErrors: true, strict: true, verbose: true });

/**
 * Validates if a schema is a valid JSON Schema.
 * @param schema Schema object to validate
 * @returns True if valid JSON Schema
 */
export function isValidJsonSchema(schema: object): boolean {
	try {
		ajv.compile(schema);
		return true;
	} catch {
		return false;
	}
}

/**
 * Creates AJV validator instance for a schema.
 * @param schema JSON schema object
 * @returns Compiled validator function
 */
export function createValidator(schema: object): ValidateFunction {
	return ajv.compile(schema);
}

/**
 * Transforms AJV errors to validation error format.
 * @param validator AJV validator with errors
 * @returns Array of validation errors
 */
export function transformValidationErrors(validator: ValidateFunction): ValidationError[] {
	return (
		validator.errors?.map((err) => ({
			field: err.instancePath || '/',
			message: err.message || 'Validation failed',
			keyword: err.keyword,
			params: err.params || {},
		})) || []
	);
}

/**
 * Validates data against compiled validator.
 * @param validator Compiled AJV validator
 * @param data Data to validate
 * @returns Validation result with errors if any
 */
export function validateData(validator: ValidateFunction, data: unknown): ValidationResult {
	const isValid = validator(data);
	const errors = isValid ? [] : transformValidationErrors(validator);
	return { isValid, errors };
}

/**
 * Formats validation errors into error message.
 * @param errors Validation errors
 * @returns Formatted error message
 */
export function formatValidationErrorMessage(errors: ValidationError[]): string {
	return errors.map((err) => `${err.field}: ${err.message}`).join(', ');
}
