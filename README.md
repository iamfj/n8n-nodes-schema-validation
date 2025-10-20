# @iamfj/n8n-nodes-schema-validation

[![npm version](https://badge.fury.io/js/@iamfj%2Fn8n-nodes-schema-validation.svg)](https://www.npmjs.com/package/@iamfj/n8n-nodes-schema-validation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JSON Schema validation node for [n8n](https://n8n.io/) workflows. Validate your data against JSON Schema standards with error output routing.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

> **✅ n8n Cloud Compatible**
> 
> This package has all dependencies bundled and is fully compatible with n8n Cloud.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes Installation

1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `@iamfj/n8n-nodes-schema-validation` in the search field
4. Click **Install**

### Manual Installation

For self-hosted n8n instances, you can install via npm:

```bash
npm install @iamfj/n8n-nodes-schema-validation
```

Then restart your n8n instance.

## Features

Validates JSON data against a JSON Schema using n8n's "Continue on Fail" error handling pattern.

**Features:**
- ✅ Validate incoming data against JSON Schema standards
- ⚠️ Error output routing with "Continue on Fail" mode
- 🎯 Support for custom JSON input via expressions
- 📊 Detailed validation error messages with field paths
- ⚡ Built on [AJV](https://ajv.js.org/) - fast and reliable JSON Schema validator
- 🧪 100% test coverage with comprehensive unit tests
- 📦 All dependencies bundled for n8n Cloud compatibility

**Use Cases:**
- Data quality checks before processing
- API response validation
- Form data validation
- ETL pipeline data verification
- Contract testing between workflows

**Configuration:**
- **JSON Schema**: Define your validation schema (JSON Schema Draft 7 format)
- **Data Source**: Choose between "Input Data" or "Custom JSON"
- **Custom JSON**: Optional field for n8n expressions (e.g., `{{ $json.data }}`)

**Example:**
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number", "minimum": 0 },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["name", "email"]
}
```

**Output:**
- **Default Output**: Items that pass validation
- **Error Output**: Items that fail validation (when "Continue on Fail" is enabled)

Enable "On Error -> Continue (using error output)" in node settings to route failed validations to the error branch instead of stopping execution.

## Architecture

The node is built following clean code principles with testable units:

```
SchemaValidator/
├── SchemaValidator.node.ts    # Main node implementation
├── types.ts                    # TypeScript interfaces
└── helpers/
    ├── schemaParser.ts         # Schema parsing logic
    ├── dataExtractor.ts        # Data extraction logic
    ├── validator.ts            # Validation logic with AJV
    └── __tests__/              # Comprehensive unit tests
```

See [helpers/README.md](./nodes/SchemaValidator/helpers/README.md) for detailed documentation.

## Credentials

None of the current nodes require credentials. All operations are performed locally within your n8n instance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

```bash
# Install dependencies
bun install

# Build the project
bun run build

# Run in development mode
bun run dev

# Run linting
bun run lint

# Format code
bun run format

# Run unit tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/#community-nodes)
- [JSON Schema Documentation](https://json-schema.org/)
- [AJV JSON Schema Validator](https://ajv.js.org/)

## License

MIT © [Fabian Jocks](https://github.com/iamfj)

## Issues & Support

If you encounter any issues or have questions:
- [Report a bug](https://github.com/iamfj/n8n-nodes-schema-validation/issues/new?template=bug-report.md)
- [Request a feature](https://github.com/iamfj/n8n-nodes-schema-validation/issues/new?template=feature-request.md)
- [Ask a question](https://github.com/iamfj/n8n-nodes-schema-validation/discussions)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

---

Made with ❤️ in Ruhrgebiet for the n8n community
