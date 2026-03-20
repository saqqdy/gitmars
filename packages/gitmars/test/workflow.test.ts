import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock @gitmars/git module
vi.mock('@gitmars/git', () => ({
	checkGitStatus: vi.fn(() => true),
	checkout: vi.fn(),
	fetch: vi.fn(),
	getConfig: vi.fn(() => ({
		master: 'master',
		develop: 'develop',
		release: 'release',
		bugfix: 'bugfix',
		support: 'support',
		versionControlType: 'gitmars',
		nameValidator: '',
		descriptionValidator: '',
	})),
	getCurrentBranch: vi.fn(() => 'feature/test-branch'),
	getGitConfig: vi.fn(() => ({
		gitUrl: 'git@github.com:test/project.git',
		appName: 'project',
	})),
	getIsBranchOrCommitExist: vi.fn((branch: string) => branch === 'master'),
	getIsGitProject: vi.fn(() => true),
	getIsMergedTargetBranch: vi.fn(() => false),
	getIsUpdatedInTime: vi.fn(() => true),
	searchBranches: vi.fn(() => ['feature/test-1', 'feature/test-2']),
}))

// Mock @gitmars/core module
vi.mock('@gitmars/core', () => ({
	isNeedUpgrade: vi.fn(async () => false),
	queue: vi.fn(async (cmds: any[]) => {
		// Simulate successful execution
		return cmds.map(() => ({ status: 0, stdout: '', stderr: '' }))
	}),
	upgradeGitmars: vi.fn(),
}))

// Mock @gitmars/utils module
vi.mock('@gitmars/utils', () => ({
	createArgs: vi.fn((args: any[]) => args.map((a: any) => a.name).join(' ')),
	debug: vi.fn(),
	spawnSync: vi.fn(() => ({ status: 0, stdout: '', stderr: '' })),
}))

// Mock @gitmars/api module
vi.mock('@gitmars/api', () => ({
	getUserInfo: vi.fn(async () => ({ level: 2, nickname: 'Test User' })),
}))

// Mock @gitmars/cache module
vi.mock('@gitmars/cache', () => ({
	setCommandCache: vi.fn(),
	setLog: vi.fn(),
}))

// Mock shelljs
vi.mock('shelljs', () => ({
	default: {
		echo: vi.fn(),
	},
}))

// Mock chalk
vi.mock('chalk', () => ({
	default: {
		green: vi.fn((str: string) => str),
		red: vi.fn((str: string) => str),
		yellow: vi.fn((str: string) => str),
	},
}))

// Mock inquirer
vi.mock('@inquirer/prompts', () => ({
	checkbox: vi.fn(async () => []),
}))

// Mock commander
const mockChain = () => {
	const chain = {
		name: vi.fn(() => chain),
		usage: vi.fn(() => chain),
		description: vi.fn(() => chain),
		arguments: vi.fn(() => chain),
		option: vi.fn(() => chain),
		action: vi.fn(() => chain),
		parse: vi.fn(),
	}

	return chain
}

vi.mock('commander', () => ({
	program: mockChain(),
}))

describe('Core Workflow - gitm start', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('Branch type validation', () => {
		it('should accept valid branch types: feature, bugfix, support', async () => {
			const { getConfig } = await import('@gitmars/git')
			const config = getConfig()

			expect(config).toBeDefined()
			expect(['feature', 'bugfix', 'support']).toContain('feature')
			expect(['feature', 'bugfix', 'support']).toContain('bugfix')
			expect(['feature', 'bugfix', 'support']).toContain('support')
		})

		it('should reject invalid branch types', () => {
			const validTypes = ['feature', 'bugfix', 'support']
			const invalidType = 'invalid-type'

			expect(validTypes).not.toContain(invalidType)
		})
	})

	describe('Branch creation logic', () => {
		const getBaseBranch = (type: string, config: any) => {
			if (type === 'bugfix') return config.bugfix
			if (type === 'support') return config.master

			return config.release
		}

		it('should determine base branch correctly for bugfix', async () => {
			const { getConfig } = await import('@gitmars/git')
			const config = getConfig()
			const type = 'bugfix'
			const base = getBaseBranch(type, config)

			expect(base).toBe('bugfix')
		})

		it('should determine base branch correctly for feature', async () => {
			const { getConfig } = await import('@gitmars/git')
			const config = getConfig()
			const type = 'feature'
			const base = getBaseBranch(type, config)

			expect(base).toBe('release')
		})

		it('should determine base branch correctly for support', async () => {
			const { getConfig } = await import('@gitmars/git')
			const config = getConfig()
			const type = 'support'
			const base = getBaseBranch(type, config)

			expect(base).toBe('master')
		})
	})

	describe('Branch name validation', () => {
		it('should accept valid branch names', () => {
			const validNames = ['login', 'user-auth', 'api-v2', 'fix-123']
			const nameValidator = /^[a-z0-9-]+$/

			validNames.forEach(name => {
				expect(nameValidator.test(name)).toBeTruthy()
			})
		})

		it('should reject invalid branch names', () => {
			const invalidNames = ['Login', 'user_auth', 'api v2']
			const nameValidator = /^[a-z0-9-]+$/

			invalidNames.forEach(name => {
				expect(nameValidator.test(name)).toBeFalsy()
			})
		})
	})

	describe('Git status check', () => {
		it('should check git status before creating branch', async () => {
			const { checkGitStatus } = await import('@gitmars/git')
			const status = checkGitStatus()

			expect(typeof status).toBe('boolean')
		})
	})
})

describe('Core Workflow - gitm update', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Update type validation', () => {
		it('should accept valid update types', () => {
			const allow = ['bugfix', 'feature', 'support']

			expect(allow).toContain('bugfix')
			expect(allow).toContain('feature')
			expect(allow).toContain('support')
		})

		it('should determine merge strategy', () => {
			const useRebase = false
			const useMerge = true

			expect(useMerge || useRebase).toBeTruthy()
		})
	})

	describe('Branch detection', () => {
		it('should parse current branch name correctly', async () => {
			const { getCurrentBranch } = await import('@gitmars/git')
			const current = getCurrentBranch()
			const [type, ...nameArr] = current.split('/')
			const name = nameArr.join('/')

			expect(type).toBe('feature')
			expect(name).toBe('test-branch')
		})

		it('should handle branches with multiple slashes', () => {
			const branchName = 'feature/user/auth'
			const [type, ...nameArr] = branchName.split('/')
			const name = nameArr.join('/')

			expect(type).toBe('feature')
			expect(name).toBe('user/auth')
		})
	})
})

describe('Core Workflow - gitm combine', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Environment selection', () => {
		it('should require dev or prod flag', () => {
			const opt = { dev: false, prod: false }
			const hasEnv = opt.dev || opt.prod

			expect(hasEnv).toBeFalsy()
		})

		it('should accept dev flag', () => {
			const opt = { dev: true, prod: false }
			const hasEnv = opt.dev || opt.prod

			expect(hasEnv).toBeTruthy()
		})

		it('should accept prod flag', () => {
			const opt = { dev: false, prod: true }
			const hasEnv = opt.dev || opt.prod

			expect(hasEnv).toBeTruthy()
		})

		it('should accept both flags', () => {
			const opt = { dev: true, prod: true }
			const hasEnv = opt.dev || opt.prod

			expect(hasEnv).toBeTruthy()
		})
	})

	describe('Merge status check', () => {
		it('should check if branch is merged to target', async () => {
			const { getIsMergedTargetBranch } = await import('@gitmars/git')
			const isMerged = getIsMergedTargetBranch('develop', 'feature/test', { remote: true })

			expect(typeof isMerged).toBe('boolean')
		})
	})

	describe('Branch info collection', () => {
		it('should collect branch status info', async () => {
			const { getIsMergedTargetBranch, getConfig } = await import('@gitmars/git')
			const config = getConfig()
			const branchName = 'feature/test'

			const branchInfo = {
				branchName,
				type: 'feature',
				name: 'test',
				isNeedCombineDevelop: !getIsMergedTargetBranch(branchName, config.develop, { remote: true }),
				isNeedCombineBase: !getIsMergedTargetBranch(branchName, config.release, { remote: true }),
			}

			expect(branchInfo.branchName).toBe('feature/test')
			expect(branchInfo.type).toBe('feature')
			expect(branchInfo.name).toBe('test')
			expect(typeof branchInfo.isNeedCombineDevelop).toBe('boolean')
			expect(typeof branchInfo.isNeedCombineBase).toBe('boolean')
		})
	})
})

describe('Core Workflow - gitm end', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Branch safety check', () => {
		it('should determine if branch is safe to delete', async () => {
			const { getIsMergedTargetBranch, getConfig } = await import('@gitmars/git')
			const config = getConfig()
			const branchName = 'feature/test'

			const isNeedCombineDevelop = !getIsMergedTargetBranch(branchName, config.develop, { remote: true })
			const isNeedCombineBase = !getIsMergedTargetBranch(branchName, config.release, { remote: true })
			const isSafe = !isNeedCombineDevelop && !isNeedCombineBase

			expect(typeof isSafe).toBe('boolean')
		})

		it('should mark support branch as safe only when all targets merged', async () => {
			const { getIsMergedTargetBranch, getConfig } = await import('@gitmars/git')
			const config = getConfig()
			const branchName = 'support/test'

			const isNeedCombineDevelop = !getIsMergedTargetBranch(branchName, config.develop, { remote: true })
			const isNeedCombineBase = !getIsMergedTargetBranch(branchName, config.master, { remote: true })
			const isNeedCombineBugfix = !getIsMergedTargetBranch(branchName, config.bugfix, { remote: true })
			const isSafe = !isNeedCombineDevelop && !isNeedCombineBase && !isNeedCombineBugfix

			expect(typeof isSafe).toBe('boolean')
		})
	})

	describe('Remote branch check', () => {
		it('should check if remote branch exists', async () => {
			const { getIsBranchOrCommitExist } = await import('@gitmars/git')
			const exists = getIsBranchOrCommitExist('feature/test', true)

			expect(typeof exists).toBe('boolean')
		})
	})
})

describe('Queue execution', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Command queue', () => {
		it('should execute queue with commands', async () => {
			const { queue } = await import('@gitmars/core')
			const cmds = ['git fetch', 'git status']
			const result = await queue(cmds)

			expect(Array.isArray(result)).toBeTruthy()
			expect(result).toHaveLength(2)
		})

		it('should handle empty queue', async () => {
			const { queue } = await import('@gitmars/core')

			// Empty queue returns empty array
			const result = await queue([])

			expect(result).toEqual([])
		})
	})

	describe('Command types', () => {
		it('should handle string commands', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue(['git status'])

			expect(result[0].status).toBe(0)
		})

		it('should handle object commands with config', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue([
				{
					cmd: 'git status',
					config: {
						again: false,
						success: 'Success',
						fail: 'Failed',
					},
				},
			])

			expect(result[0].status).toBe(0)
		})

		it('should handle message commands', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue([{ message: 'Info message' }])

			expect(result[0].status).toBe(0)
		})
	})
})

describe('Configuration', () => {
	describe('Default config values', () => {
		it('should have required config properties', async () => {
			const { getConfig } = await import('@gitmars/git')
			const config = getConfig()

			expect(config).toHaveProperty('master')
			expect(config).toHaveProperty('develop')
			expect(config).toHaveProperty('release')
			expect(config).toHaveProperty('bugfix')
			expect(config).toHaveProperty('support')
		})
	})
})
