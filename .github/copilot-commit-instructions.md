# Commit Message Instructions

When creating commit messages for this repository, follow the **Conventional Commits** specification strictly:

## Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Rules

### Header (Required)
- **Type**: Must be one of: `epoch`, `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Scope**: Optional, can be anything specifying the place of the commit change (e.g., `schema-validator`, `ci`, `deps`)
- **Description**: Short summary in present tense, lowercase, no period at the end
- **Max length**: 72 characters for the entire header

### Body (Optional)
- Use imperative, present tense: "change" not "changed" nor "changes"
- Explain **what** and **why** vs. **how**
- Wrap at 72 characters per line
- Separate from header with a blank line

### Footer (Optional)
- **Breaking Changes**: Must start with `BREAKING CHANGE:` followed by description
- **References**: Reference issues/PRs with format `Refs: #123` or `Closes: #123`
- Separate from body with a blank line

## Examples

### Simple commit
```
feat: add json schema validation node
```

### With scope
```
fix(schema-validator): handle null values in custom json
```

### With body
```
feat: add biome formatter and lefthook

Replace prettier with biome for faster formatting.
Add lefthook for git hooks management with pre-commit
checks for formatting and conventional commit messages.
```

### Breaking change
```
feat!: change error output format

BREAKING CHANGE: Error output now only includes validationErrors
array instead of merging with original item data. This improves
clarity and reduces payload size.

Refs: #123
```

### Epoch release (major milestone)
```
epoch: complete rewrite with new architecture

This represents a significant milestone and major release.
Complete redesign of the API with improved performance.

Refs: #456
```

## Custom Versioning Scheme

This project uses a **custom versioning scheme** with MAJOR.MINOR.PATCH:

- **epoch**: Epoch/milestone releases, triggers MAJOR bump (v0.5.2 → v1.0.0)
- **Breaking changes** (with `BREAKING CHANGE:` or `!`): Triggers MINOR bump (v1.0.0 → v1.1.0)
- **feat**: New features, triggers PATCH bump (v1.0.0 → v1.0.1)
- **fix**, **perf**: Bug fixes and performance, triggers PATCH bump (v1.0.0 → v1.0.1)

Examples of version progression:
- `v0.0.1` → `v0.0.2` (feature added)
- `v0.0.2` → `v0.0.3` (bug fix)
- `v0.0.3` → `v0.1.0` (breaking change)
- `v0.1.0` → `v1.0.0` (epoch release)

**Note**: Use `epoch:` type only for major milestones and significant releases.

## Key Points
- Use lowercase for type and description
- No period at end of header
- Present tense, imperative mood
- Break lines at 72 characters
- Always include type
- Use `!` after type/scope for breaking changes OR use footer
- Be specific and concise
