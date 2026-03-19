import { describe, expect, it } from 'vitest'
import { CACHE_PATH, ROOT_PATH } from '../src/paths.js'

describe('paths', () => {
	describe('ROOT_PATH', () => {
		it('should be a valid path', () => {
			expect(ROOT_PATH).toBeDefined()
			expect(typeof ROOT_PATH).toBe('string')
		})

		it('should point to a packages directory', () => {
			expect(ROOT_PATH).toContain('packages')
		})
	})

	describe('CACHE_PATH', () => {
		it('should be a valid path', () => {
			expect(CACHE_PATH).toBeDefined()
			expect(typeof CACHE_PATH).toBe('string')
		})

		it('should be a subdirectory of ROOT_PATH', () => {
			expect(CACHE_PATH).toContain(ROOT_PATH)
		})
	})
})
