/**
 * Semantic Release Configuration with Custom Versioning
 *
 * Format: MAJOR.MINOR.PATCH
 * - MAJOR: Epoch releases (significant milestones)
 * - MINOR: Breaking changes
 * - PATCH: Features, fixes, and performance improvements
 *
 * Examples:
 * - v0.0.1 -> v0.0.2 (feature/fix)
 * - v0.0.2 -> v0.1.0 (breaking change)
 * - v0.1.0 -> v1.0.0 (epoch release)
 *
 * Branches:
 * - main: Stable releases (MAJOR.MINOR.PATCH)
 * - next: Pre-releases (MAJOR.MINOR.PATCH-next.X)
 */

export default {
	branches: [
		// Stable releases on main branch
		'+([0-9])?(.{+([0-9]),x}).x',
		'main',
		// Pre-releases on next branch
		{
			name: 'next',
			prerelease: true,
		},
	],
	plugins: [
		// Analyze commits using conventional commits
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'conventionalcommits',
				releaseRules: [
					// Epoch releases (major milestones)
					{ type: 'epoch', release: 'major' },
					// Breaking changes
					{ breaking: true, release: 'minor' },
					// Features, fixes and performance
					{ type: 'feat', release: 'patch' },
					{ type: 'fix', release: 'patch' },
					{ type: 'perf', release: 'patch' },
					// Documentation and other changes don't trigger releases
					{ type: 'docs', release: false },
					{ type: 'style', release: false },
					{ type: 'refactor', release: false },
					{ type: 'test', release: false },
					{ type: 'build', release: false },
					{ type: 'ci', release: false },
					{ type: 'chore', release: false },
				],
			},
		],
		// Generate release notes
		[
			'@semantic-release/release-notes-generator',
			{
				preset: 'conventionalcommits',
				presetConfig: {
					types: [
						{ type: 'epoch', section: '🗿 Epoch Releases', hidden: false },
						{ type: 'feat', section: '✨ Features', hidden: false },
						{ type: 'fix', section: '🐛 Bug Fixes', hidden: false },
						{ type: 'perf', section: '⚡ Performance', hidden: false },
						{ type: 'revert', section: '⏪ Reverts', hidden: false },
						{ type: 'docs', section: '📚 Documentation', hidden: true },
						{ type: 'style', section: '💄 Styles', hidden: true },
						{ type: 'refactor', section: '♻️ Refactoring', hidden: true },
						{ type: 'test', section: '✅ Tests', hidden: true },
						{ type: 'build', section: '📦 Build', hidden: true },
						{ type: 'ci', section: '🔧 CI', hidden: true },
						{ type: 'chore', section: '🏗️ Chores', hidden: true },
					],
				},
			},
		],
		// Update CHANGELOG.md
		[
			'@semantic-release/changelog',
			{
				changelogFile: 'CHANGELOG.md',
			},
		],
		// Update package.json version and publish to npm
		[
			'@semantic-release/npm',
			{
				npmPublish: true,
				pkgRoot: '.',
			},
		],
		// Commit updated files back to repository
		[
			'@semantic-release/git',
			{
				assets: ['CHANGELOG.md', 'package.json'],
				message:
					// biome-ignore lint/suspicious/noTemplateCurlyInString: This is a semantic-release template variable
					'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
			},
		],
		// Create GitHub release
		'@semantic-release/github',
	],
};
