import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['test/**/*.test.ts', 'packages/*/test/**/*.test.ts'],
		exclude: [
			'node_modules',
			'packages/*/node_modules',
			'packages/*/dist',
			'packages/*/lib',
			'**/*_bak/**',
			'**/*.bak',
		],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/**',
				'packages/*/node_modules/**',
				'packages/*/dist/**',
				'packages/*/lib/**',
				'packages/docs/**',
				'**/*.d.ts',
				'**/*.test.ts',
				'**/*.spec.ts',
				'scripts/**',
				'build/**',
				'packages/*/test/**',
				'**/*_bak/**',
				'**/*.bak',
			],
		},
		testTimeout: 30000,
		hookTimeout: 30000,
	},
})
