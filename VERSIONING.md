# Custom Versioning Guide

This project uses a **custom versioning scheme** that differs from standard SemVer.

## Format

```
MAJOR.MINOR.PATCH[-prerelease]
```

### Components

- **MAJOR**: Epoch/milestone releases (significant major changes)
- **MINOR**: Breaking changes
- **PATCH**: Features, bug fixes, and performance improvements
- **Prerelease**: Pre-release identifier (e.g., `next.1`)

## Version Progression Examples

### Normal Development
```
v0.0.1  → Initial release
v0.0.2  → New feature added
v0.0.3  → Bug fix
v0.0.4  → Performance improvement
v0.1.0  → Breaking change introduced
v0.1.1  → New feature after breaking change
v0.2.0  → Another breaking change
v1.0.0  → Epoch release (major milestone)
v1.0.1  → New feature in new epoch
v1.1.0  → Breaking change in new epoch
v2.0.0  → Another epoch release
```

### Pre-releases (next branch)
```
v5.0.0        → Stable on main
v6.0.0-next.1 → Pre-release on next branch
v6.0.0-next.2 → Another pre-release
v6.0.0        → Released to stable
```

## Branching Strategy

### Main Branch (Stable)
- Releases: `X.Y.Z` (no prerelease suffix)
- Protected, requires PR and CI passing
- Automatically triggers releases via semantic-release

### Next Branch (Pre-release)
- Releases: `X.Y.Z-next.N`
- Used for testing upcoming features
- Automatically triggers pre-releases
- Can be merged to main when stable

## Triggering Releases

Releases are automated based on conventional commit messages:

### Patch Release (X.Y.Z → X.Y.Z+1)
```bash
git commit -m "feat: add support for custom error formats"
git commit -m "fix: resolve validation error handling"
git commit -m "perf: improve schema compilation speed"
```

### Minor Release (X.Y.Z → X.Y+1.0)
```bash
git commit -m "feat!: change validation output structure

BREAKING CHANGE: Validation errors are now returned in a
different format. Update your error handling code accordingly."
```

### Major Release (X.Y.Z → X+1.0.0)
```bash
git commit -m "epoch: complete rewrite with new architecture

This represents a major milestone and significant release
with fundamental improvements to the codebase."
```

### Major Release (X.Y.Z → X+1.0.0)
```bash
git commit -m "feat!: change validation output structure

BREAKING CHANGE: Validation errors are now returned in a
different format. Update your error handling code accordingly."
```

## Manual Release Testing

```bash
# Dry run to see what would be released
npm run release:dry

# Actual release (normally done by CI)
npm run release
```

## CI/CD

- **CI**: Runs on all PRs and pushes (lint, format, build, tests)
- **Release**: Automatic on push to `main` or `next` branches
- **NPM Publish**: Automatic on successful release

## Learn More

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
