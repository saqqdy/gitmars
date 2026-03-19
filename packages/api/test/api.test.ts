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
	spawnSync: vi.fn(() => ({ stdout: '' })),
}))

vi.mock('@gitmars/git', () => ({
	getConfig: vi.fn(() => ({
		api: 'https://api.example.com/user',
		gitHost: 'https://git.example.com',
		gitID: '123',
		apis: {
			userInfo: {
				url: 'https://api.example.com/user',
			},
		},
		token: 'test-token',
	})),
	getGitUser: vi.fn(() => 'testuser'),
	getGitToken: vi.fn(() => 'test-token'),
	getGitRevParse: vi.fn(() => ({
		gitDir: '/tmp/.git',
		root: '/tmp/project',
	})),
	getGitConfig: vi.fn(() => ({
		gitUrl: 'git@github.com:test/project.git',
		appName: 'project',
	})),
}))

vi.mock('@jssj/request', () => ({
	default: {
		get: vi.fn().mockResolvedValue({
			data: {
				level: 1,
				name: 'testuser',
			},
		}),
		post: vi.fn().mockResolvedValue({
			data: {},
		}),
		setConfig: vi.fn(),
	},
}))

vi.mock('shelljs', () => ({
	default: {
		echo: vi.fn(),
	},
}))

describe('getUserInfo', () => {
	it('should be exported', async () => {
		const { getUserInfo } = await import('../src/index.js')

		expect(getUserInfo).toBeDefined()
		expect(typeof getUserInfo).toBe('function')
	})
})

describe('module exports', () => {
	it('should export getUserInfo', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getUserInfo).toBeDefined()
		expect(typeof mod.getUserInfo).toBe('function')
	})

	it('should export mergeRequest functions', async () => {
		const mod = await import('../src/index.js')

		expect(mod.createMergeRequest).toBeDefined()
		expect(mod.acceptMergeRequest).toBeDefined()
		expect(mod.updateMergeRequest).toBeDefined()
		expect(mod.deleteMergeRequest).toBeDefined()
		expect(mod.getMergeRequestList).toBeDefined()
		expect(mod.getMergeRequestCommits).toBeDefined()
	})

	it('should export mergeRequestNotes functions', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getMergeRequestNotesList).toBeDefined()
		expect(mod.createMergeRequestNotes).toBeDefined()
		expect(mod.getMergeRequestNotesDetail).toBeDefined()
		expect(mod.updateMergeRequestNotes).toBeDefined()
		expect(mod.deleteMergeRequestNotes).toBeDefined()
	})

	it('should export miniprogram functions', async () => {
		const mod = await import('../src/index.js')

		// Check for exports from miniprogram module - functions are exported individually
		expect(mod.getAuthorizerListWithAllDetail).toBeDefined()
	})
})
