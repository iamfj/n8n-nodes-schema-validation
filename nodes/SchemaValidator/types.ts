/**
 * Validation error details from AJV.
 */
export interface ValidationError {
	field: string;
	message: string;
	keyword: string;
	params: Record<string, unknown>;
}

/**
 * Result of schema validation.
 */
export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
}

/**
 * Data source options for validation.
 */
export type DataSource = 'entireItem' | 'customJson';
