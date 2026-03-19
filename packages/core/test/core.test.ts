import { describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('@gitmars/utils', () => ({
	debug: vi.fn(),
	debugWarn: vi.fn(),
	debugError: vi.fn(),
	isDebug: false,
	useLocale: vi.fn(() => ({
		t: (key: string) => key,
		lang: 'en-US',
		locale: {},
	})),
	spawnSync: vi.fn(() => ({ stdout: '', status: 0 })),
}))

vi.mock('@gitmars/git', () => ({
	getGitRevParse: vi.fn(() => ({
		gitDir: '/tmp/.git',
		root: '/tmp/project',
		prefix: '',
		gitCommonDir: '/tmp/.git',
		gitHookDir: '/tmp/.git/hooks',
		cdup: '',
	})),
	getGitConfig: vi.fn(() => ({
		gitUrl: 'git@github.com:test/project.git',
		appName: 'project',
	})),
	getConfig: vi.fn(() => ({
		user: 'testuser',
		msgTemplate: '',
		skipCI: false,
	})),
	getCommandMessage: vi.fn(() => ({
		processing: 'Processing...',
		success: 'Success',
		fail: 'Failed',
	})),
}))

vi.mock('@gitmars/cache', () => ({
	setCommandCache: vi.fn(),
	setLog: vi.fn(),
}))

vi.mock('shelljs', () => ({
	default: {
		echo: vi.fn(),
	},
}))

vi.mock('ora', () => ({
	default: vi.fn(() => ({
		start: vi.fn().mockReturnThis(),
		succeed: vi.fn().mockReturnThis(),
		fail: vi.fn().mockReturnThis(),
		warn: vi.fn().mockReturnThis(),
		stop: vi.fn().mockReturnThis(),
	})),
}))

describe('queue module', () => {
	describe('wait', () => {
		it('should be exported', async () => {
			const { wait } = await import('../src/queue.js')

			expect(wait).toBeDefined()
			expect(typeof wait).toBe('function')
		})

		it('should call function when list is empty', async () => {
			const { wait } = await import('../src/queue.js')
			const mockFn = vi.fn()

			wait([], mockFn)

			expect(mockFn).toHaveBeenCalled()
		})
	})

	describe('queue', () => {
		it('should be exported', async () => {
			const { queue } = await import('../src/queue.js')

			expect(queue).toBeDefined()
			expect(typeof queue).toBe('function')
		})

		it('should reject when list is empty', async () => {
			const { queue } = await import('../src/queue.js')

			await expect(queue([])).rejects.toThrow()
		})
	})
})

describe('message module', () => {
	describe('getMessage', () => {
		it('should be exported', async () => {
			const { getMessage } = await import('../src/message.js')

			expect(getMessage).toBeDefined()
			expect(typeof getMessage).toBe('function')
		})

		it('should return time string for time type', async () => {
			const { getMessage } = await import('../src/message.js')
			const result = getMessage('time')

			expect(typeof result).toBe('string')
		})

		it('should return time number for timeNum type', async () => {
			const { getMessage } = await import('../src/message.js')
			const result = getMessage('timeNum')

			expect(typeof result).toBe('string')
			expect(/^\d+$/.test(result)).toBeTruthy()
		})

		it('should return project path for pwd type', async () => {
			const { getMessage } = await import('../src/message.js')
			const result = getMessage('pwd')

			expect(typeof result).toBe('string')
		})

		it('should return app name for project type', async () => {
			const { getMessage } = await import('../src/message.js')
			const result = getMessage('project')

			expect(typeof result).toBe('string')
		})

		it('should return empty string for unknown type', async () => {
			const { getMessage } = await import('../src/message.js')
			const result = getMessage('unknown')

			expect(result).toBe('')
		})
	})

	describe('postMessage', () => {
		it('should be exported', async () => {
			const { postMessage } = await import('../src/message.js')

			expect(postMessage).toBeDefined()
			expect(typeof postMessage).toBe('function')
		})

		it('should not throw when called', async () => {
			const { postMessage } = await import('../src/message.js')

			await expect(postMessage('test message')).resolves.toBeUndefined()
		})
	})
})

describe('module exports', () => {
	it('should export getCurlOfMergeRequest', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getCurlOfMergeRequest).toBeDefined()
	})

	it('should export getMessage', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getMessage).toBeDefined()
		expect(typeof mod.getMessage).toBe('function')
	})

	it('should export postMessage', async () => {
		const mod = await import('../src/index.js')

		expect(mod.postMessage).toBeDefined()
		expect(typeof mod.postMessage).toBe('function')
	})

	it('should export wait', async () => {
		const mod = await import('../src/index.js')

		expect(mod.wait).toBeDefined()
		expect(typeof mod.wait).toBe('function')
	})

	it('should export queue', async () => {
		const mod = await import('../src/index.js')

		expect(mod.queue).toBeDefined()
		expect(typeof mod.queue).toBe('function')
	})

	it('should export sendGroupMessage', async () => {
		const mod = await import('../src/index.js')

		expect(mod.sendGroupMessage).toBeDefined()
	})

	it('should export isNeedUpgrade', async () => {
		const mod = await import('../src/index.js')

		expect(mod.isNeedUpgrade).toBeDefined()
		expect(typeof mod.isNeedUpgrade).toBe('function')
	})

	it('should export upgradeGitmars', async () => {
		const mod = await import('../src/index.js')

		expect(mod.upgradeGitmars).toBeDefined()
		expect(typeof mod.upgradeGitmars).toBe('function')
	})
})
