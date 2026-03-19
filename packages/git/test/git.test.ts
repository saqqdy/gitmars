import { describe, expect, it } from 'vitest'
import getCurrentBranch from '../src/getCurrentBranch.js'
import getGitVersion from '../src/getGitVersion.js'
import getIsGitProject from '../src/getIsGitProject.js'

describe('git functions', () => {
	describe('getGitVersion', () => {
		it('should return a version string', () => {
			const version = getGitVersion()

			expect(version).toBeDefined()
			expect(typeof version).toBe('string')
		})

		it('should return a valid semver format', () => {
			const version = getGitVersion()

			expect(version).toMatch(/^\d+\.\d+\.\d+/)
		})
	})

	describe('getIsGitProject', () => {
		it('should return true when in a git repository', () => {
			// This test runs in the gitmars repo which is a git project
			const result = getIsGitProject()

			expect(result).toBeTruthy()
		})
	})

	describe('getCurrentBranch', () => {
		it('should return the current branch name', () => {
			const branch = getCurrentBranch()

			expect(branch).toBeDefined()
			expect(typeof branch).toBe('string')
			expect(branch.length).toBeGreaterThan(0)
		})

		it('should return a valid branch name', () => {
			const branch = getCurrentBranch()

			// Branch names should not contain spaces
			expect(branch).not.toMatch(/\s/)
		})
	})
})
