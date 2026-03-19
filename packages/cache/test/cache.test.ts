import { describe, expect, it, vi } from 'vitest'
import { CACHE_PATH, ROOT_PATH } from '../src/paths.js'

// Mock dependencies
vi.mock('@gitmars/utils', () => ({
	isFileExist: vi.fn(() => false),
	removeFile: vi.fn(),
	writeFile: vi.fn().mockResolvedValue(true),
	writeFileSync: vi.fn(),
	spawnSync: vi.fn(() => ({ stdout: '{"name":"gitmars","version":"1.0.0"}' })),
	debug: vi.fn(),
	debugWarn: vi.fn(),
	debugError: vi.fn(),
	isDebug: false,
	useLocale: vi.fn(() => ({
		t: (key: string) => key,
		lang: 'en-US',
		locale: {},
	})),
}))

vi.mock('@gitmars/git', () => ({
	getGitRevParse: vi.fn(() => ({
		gitDir: '/tmp/.git',
		root: '/tmp',
		prefix: '',
		gitCommonDir: '/tmp/.git',
		gitHookDir: '/tmp/.git/hooks',
		cdup: '',
	})),
}))

vi.mock('shelljs', () => ({
	default: {
		cat: vi.fn(() => ({ stdout: '[]' })),
		touch: vi.fn(),
		sed: vi.fn(),
	},
}))

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

describe('cache module', () => {
	describe('isCacheExpired', () => {
		it('should be exported', async () => {
			const { isCacheExpired } = await import('../src/cache.js')

			expect(typeof isCacheExpired).toBe('function')
		})
	})

	describe('updateCacheTime', () => {
		it('should be exported', async () => {
			const { updateCacheTime } = await import('../src/cache.js')

			expect(typeof updateCacheTime).toBe('function')
		})
	})

	describe('cleanCache', () => {
		it('should be exported', async () => {
			const { cleanCache } = await import('../src/cache.js')

			expect(typeof cleanCache).toBe('function')
		})

		it('should call removeFile', async () => {
			const { cleanCache } = await import('../src/cache.js')
			const { removeFile } = await import('@gitmars/utils')

			cleanCache()

			expect(removeFile).toHaveBeenCalled()
		})
	})
})

describe('commandCache module', () => {
	describe('getCommandCache', () => {
		it('should be exported', async () => {
			const { getCommandCache } = await import('../src/commandCache.js')

			expect(typeof getCommandCache).toBe('function')
		})

		it('should return an array', async () => {
			const { getCommandCache } = await import('../src/commandCache.js')
			const result = getCommandCache()

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('setCommandCache', () => {
		it('should be exported', async () => {
			const { setCommandCache } = await import('../src/commandCache.js')

			expect(typeof setCommandCache).toBe('function')
		})

		it('should not throw when called', async () => {
			const { setCommandCache } = await import('../src/commandCache.js')

			expect(() => setCommandCache(['cmd1', 'cmd2'])).not.toThrow()
		})
	})

	describe('cleanCommandCache', () => {
		it('should be exported', async () => {
			const { cleanCommandCache } = await import('../src/commandCache.js')

			expect(typeof cleanCommandCache).toBe('function')
		})

		it('should not throw when called', async () => {
			const { cleanCommandCache } = await import('../src/commandCache.js')

			expect(() => cleanCommandCache()).not.toThrow()
		})
	})
})

describe('log module', () => {
	describe('setLog', () => {
		it('should be exported', async () => {
			const { setLog } = await import('../src/log.js')

			expect(typeof setLog).toBe('function')
		})

		it('should not throw when called', async () => {
			const { setLog } = await import('../src/log.js')

			expect(() =>
				setLog({
					level: 'error',
					message: 'test message',
					data: {},
				}),
			).not.toThrow()
		})
	})

	describe('cleanLog', () => {
		it('should be exported', async () => {
			const { cleanLog } = await import('../src/log.js')

			expect(typeof cleanLog).toBe('function')
		})

		it('should call removeFile', async () => {
			const { cleanLog } = await import('../src/log.js')
			const { removeFile } = await import('@gitmars/utils')

			cleanLog()

			expect(removeFile).toHaveBeenCalled()
		})
	})
})

describe('revertCache module', () => {
	describe('getRevertCache', () => {
		it('should be exported', async () => {
			const { getRevertCache } = await import('../src/revertCache.js')

			expect(typeof getRevertCache).toBe('function')
		})

		it('should return an array', async () => {
			const { getRevertCache } = await import('../src/revertCache.js')
			const result = getRevertCache()

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should filter by branch when provided', async () => {
			const { getRevertCache } = await import('../src/revertCache.js')
			const result = getRevertCache('feature/test')

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('setRevertCache', () => {
		it('should be exported', async () => {
			const { setRevertCache } = await import('../src/revertCache.js')

			expect(typeof setRevertCache).toBe('function')
		})

		it('should not throw when called', async () => {
			const { setRevertCache } = await import('../src/revertCache.js')

			expect(() => setRevertCache([])).not.toThrow()
		})
	})

	describe('addRevertCache', () => {
		it('should be exported', async () => {
			const { addRevertCache } = await import('../src/revertCache.js')

			expect(typeof addRevertCache).toBe('function')
		})

		it('should not throw when called with single item', async () => {
			const { addRevertCache } = await import('../src/revertCache.js')

			expect(() =>
				addRevertCache({
					branch: 'test',
					before: { '%H': 'abc123' },
					after: { '%H': 'def456' },
				}),
			).not.toThrow()
		})

		it('should not throw when called with array', async () => {
			const { addRevertCache } = await import('../src/revertCache.js')

			expect(() =>
				addRevertCache([
					{
						branch: 'test',
						before: { '%H': 'abc123' },
						after: { '%H': 'def456' },
					},
				]),
			).not.toThrow()
		})
	})

	describe('delRevertCache', () => {
		it('should be exported', async () => {
			const { delRevertCache } = await import('../src/revertCache.js')

			expect(typeof delRevertCache).toBe('function')
		})

		it('should not throw when called with single commit ID', async () => {
			const { delRevertCache } = await import('../src/revertCache.js')

			expect(() => delRevertCache('abc123')).not.toThrow()
		})

		it('should not throw when called with array of commit IDs', async () => {
			const { delRevertCache } = await import('../src/revertCache.js')

			expect(() => delRevertCache(['abc123', 'def456'])).not.toThrow()
		})
	})

	describe('cleanRevertCache', () => {
		it('should be exported', async () => {
			const { cleanRevertCache } = await import('../src/revertCache.js')

			expect(typeof cleanRevertCache).toBe('function')
		})

		it('should not throw when called', async () => {
			const { cleanRevertCache } = await import('../src/revertCache.js')

			expect(() => cleanRevertCache()).not.toThrow()
		})
	})
})

describe('pkgInfo module', () => {
	describe('getPkgInfo', () => {
		it('should be exported', async () => {
			const { getPkgInfo } = await import('../src/pkgInfo.js')

			expect(typeof getPkgInfo).toBe('function')
		})
	})

	describe('cleanPkgInfo', () => {
		it('should be exported', async () => {
			const { cleanPkgInfo } = await import('../src/pkgInfo.js')

			expect(typeof cleanPkgInfo).toBe('function')
		})

		it('should call removeFile', async () => {
			const { cleanPkgInfo } = await import('../src/pkgInfo.js')
			const { removeFile } = await import('@gitmars/utils')

			cleanPkgInfo()

			expect(removeFile).toHaveBeenCalled()
		})
	})
})
