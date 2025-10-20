# SchemaValidator Helpers

This directory contains testable, single-responsibility helper functions for the SchemaValidator node.

## Structure

```
helpers/
├── __tests__/           # Unit tests
├── dataExtractor.ts     # Data extraction logic
├── schemaParser.ts      # Schema parsing logic
└── validator.ts         # Validation logic with AJV
```

## Modules

### schemaParser.ts
Handles JSON schema parsing with proper error handling.

**Functions:**
- `parseSchema(schemaJson)` - Parses JSON schema from string or object

### dataExtractor.ts
Extracts and prepares data for validation from different sources.

**Functions:**
- `extractCustomJsonData(customJsonParam)` - Parses custom JSON parameter
- `extractDataToValidate(item, dataSource, customJsonParam?)` - Determines what data to validate based on source

### validator.ts
Core validation logic using AJV library.

**Functions:**
- `createValidator(schema)` - Creates compiled AJV validator
- `validateData(validator, data)` - Validates data and returns structured result
- `transformValidationErrors(validator)` - Transforms AJV errors to normalized format
- `formatValidationErrorMessage(errors)` - Formats errors into human-readable message

## Testing

Run tests with:
```bash
bun test                  # Run all tests
bun test --watch          # Watch mode
bun test --coverage       # With coverage report
```

## Design Principles

1. **Single Responsibility**: Each function has one clear purpose
2. **Pure Functions**: No side effects, testable in isolation
3. **Type Safety**: Full TypeScript types with strict checking
4. **Error Handling**: Explicit error throwing with clear messages
5. **Testability**: 100% test coverage with comprehensive test cases
