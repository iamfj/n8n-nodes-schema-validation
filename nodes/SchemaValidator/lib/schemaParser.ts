/**
 * Parses JSON schema from string or object.
 * @param schemaJson Schema as string or object
 * @returns Parsed schema object
 * @throws Error if JSON is invalid
 */
export function parseSchema(schemaJson: string | object): object {
	if (typeof schemaJson === 'string') {
		return JSON.parse(schemaJson);
	}
	return schemaJson;
}
