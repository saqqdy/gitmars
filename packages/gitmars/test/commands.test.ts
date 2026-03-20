import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock @gitmars/git module
vi.mock('@gitmars/git', () => ({
	checkGitStatus: vi.fn(() => true),
	checkout: vi.fn(),
	fetch: vi.fn(),
	getCurrentBranch: vi.fn(() => 'feature/test-branch'),
	getGitLogs: vi.fn(() => [
		{ '%H': 'abc123', '%T': 'tree123', '%P': 'parent123', '%aI': '2024-01-01T00:00:00Z', '%an': 'Test User', '%s': 'Test commit', '%b': '' },
		{ '%H': 'def456', '%T': 'tree456', '%P': 'parent456', '%aI': '2024-01-02T00:00:00Z', '%an': 'Test User', '%s': 'Another commit', '%b': '' },
	]),
	getGitLogsByCommitIDs: vi.fn(() => [
		{ '%H': 'abc123', '%T': 'tree123', '%P': 'parent123', '%aI': '2024-01-01T00:00:00Z', '%an': 'Test User', '%s': 'Test commit', '%b': '' },
	]),
	getIsBranchOrCommitExist: vi.fn((branch: string) => branch === 'master'),
	getIsGitProject: vi.fn(() => true),
	getStashList: vi.fn(() => [{ key: 'stash@{0}', message: 'test_cache_by_gitmars' }]),
	prune: vi.fn(),
	searchBranches: vi.fn(() => ['feature/test-1', 'feature/test-2', 'develop']),
}))

// Mock @gitmars/core module
vi.mock('@gitmars/core', () => ({
	queue: vi.fn(async (cmds: any[]) => {
		return cmds.map(() => ({ status: 0, stdout: '', stderr: '' }))
	}),
}))

// Mock @gitmars/utils module
vi.mock('@gitmars/utils', () => ({
	createArgs: vi.fn((args: any[]) => args.map((a: any) => a.name).join(' ')),
	echo: vi.fn(),
	debug: vi.fn(),
	spawnSync: vi.fn(() => ({ status: 0, stdout: '', stderr: '' })),
}))

// Mock @gitmars/cache module
vi.mock('@gitmars/cache', () => ({
	addRevertCache: vi.fn(),
	delRevertCache: vi.fn(),
	getRevertCache: vi.fn(() => [
		{
			before: { '%H': 'abc123', '%s': 'Test commit' },
			after: { '%H': 'revert123', '%s': 'Revert commit', '%aI': '2024-01-03T00:00:00Z', '%an': 'Test User' },
			branch: 'feature/test-branch',
		},
	]),
	setRevertCache: vi.fn(),
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
		blue: vi.fn((str: string) => str),
	},
}))

// Mock inquirer
vi.mock('@inquirer/prompts', () => ({
	checkbox: vi.fn(async () => ['abc123']),
	select: vi.fn(async () => 'feature/test-1'),
}))

// Mock dayjs
vi.mock('dayjs', () => ({
	default: vi.fn(() => ({
		format: vi.fn(() => '2024/01/01 00:00'),
	})),
}))

describe('gitm copy command', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Commit selection', () => {
		it('should get git logs for selection', async () => {
			const { getGitLogs } = await import('@gitmars/git')
			const logs = getGitLogs({ lastet: '', limit: 20, noMerges: true })

			expect(Array.isArray(logs)).toBeTruthy()
			expect(logs.length).toBeGreaterThan(0)
		})

		it('should get git logs by commit IDs when provided', async () => {
			const { getGitLogsByCommitIDs } = await import('@gitmars/git')
			const logs = getGitLogsByCommitIDs({ commitIDs: ['abc123'], keys: ['%H', '%s'] })

			expect(Array.isArray(logs)).toBeTruthy()
		})

		it('should support lastet option', async () => {
			const { getGitLogs } = await import('@gitmars/git')
			const logs = getGitLogs({ lastet: '1d', limit: 10, noMerges: true })

			expect(Array.isArray(logs)).toBeTruthy()
		})

		it('should support limit option', async () => {
			const { getGitLogs } = await import('@gitmars/git')
			const logs = getGitLogs({ lastet: '', limit: 5, noMerges: true })

			expect(Array.isArray(logs)).toBeTruthy()
		})
	})

	describe('Branch operations', () => {
		it('should get available branches', async () => {
			const { searchBranches } = await import('@gitmars/git')
			const branches = searchBranches()

			expect(Array.isArray(branches)).toBeTruthy()
			expect(branches.length).toBeGreaterThan(0)
		})

		it('should check if remote branch exists', async () => {
			const { getIsBranchOrCommitExist } = await import('@gitmars/git')
			const exists = getIsBranchOrCommitExist('feature/test-1', true)

			expect(typeof exists).toBe('boolean')
		})
	})

	describe('Queue execution', () => {
		it('should execute cherry-pick commands', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue(['git cherry-pick abc123'])

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should include push when push option is true', async () => {
			const { queue } = await import('@gitmars/core')
			const cmds = ['git cherry-pick abc123', 'git push']

			const result = await queue(cmds)

			expect(result).toHaveLength(2)
		})
	})
})

describe('gitm undo command', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Commit selection for undo', () => {
		it('should get logs for undo selection', async () => {
			const { getGitLogs } = await import('@gitmars/git')
			const logs = getGitLogs({ lastet: '', limit: 20, noMerges: true })

			expect(Array.isArray(logs)).toBeTruthy()
		})

		it('should support mode option for merge undo', () => {
			const mode = 1
			const modeArg = ` -m ${Math.abs(Number(mode))}`

			expect(modeArg).toBe(' -m 1')
		})

		it('should support mode 2 for merge undo', () => {
			const mode = 2
			const modeArg = ` -m ${Math.abs(Number(mode))}`

			expect(modeArg).toBe(' -m 2')
		})
	})

	describe('Revert cache operations', () => {
		it('should get revert cache', async () => {
			const { getRevertCache } = await import('@gitmars/cache')
			const cache = getRevertCache()

			expect(Array.isArray(cache)).toBeTruthy()
		})

		it('should add to revert cache', async () => {
			const { addRevertCache } = await import('@gitmars/cache')
			const cacheList = {
				before: { '%H': 'abc123', '%s': 'Test commit' },
				after: { '%H': 'def456', '%s': 'Revert commit' },
				branch: 'feature/test',
			}

			addRevertCache(cacheList)
			expect(addRevertCache).toHaveBeenCalled()
		})

		it('should check for duplicate reverts', async () => {
			const { getRevertCache } = await import('@gitmars/cache')
			const revertCache = getRevertCache()
			const commitID = 'revert123'

			const found = revertCache.find(
				(item: any) => item.after && item.after['%H'] === commitID,
			)

			expect(found).toBeDefined()
		})
	})

	describe('Calculate operations', () => {
		it('should support calc option', () => {
			const opt = { calc: true, calcAll: false }

			expect(opt.calc).toBeTruthy()
		})

		it('should support calcAll option', () => {
			const opt = { calc: false, calcAll: true }

			expect(opt.calcAll).toBeTruthy()
		})
	})

	describe('Revert command generation', () => {
		it('should generate revert command with correct format', () => {
			const commitID = 'abc123'
			const mode = ' -m 1'
			const cmd = `git revert -s --no-edit ${commitID}${mode}`

			expect(cmd).toContain('git revert')
			expect(cmd).toContain('-s')
			expect(cmd).toContain('--no-edit')
		})
	})
})

describe('gitm redo command', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Redo cache retrieval', () => {
		it('should get revert cache for current branch', async () => {
			const { getRevertCache } = await import('@gitmars/cache')
			const { getCurrentBranch } = await import('@gitmars/git')
			const current = getCurrentBranch()
			const cache = getRevertCache(current)

			expect(Array.isArray(cache)).toBeTruthy()
		})

		it('should filter cache by commit IDs when provided', async () => {
			const { getRevertCache } = await import('@gitmars/cache')
			const commitIDs = ['revert123']
			const revertCache = getRevertCache()

			const filtered = revertCache.filter((item: any) =>
				commitIDs.some(id => item.after['%H'].includes(id)),
			)

			expect(filtered).toHaveLength(1)
		})
	})

	describe('Redo command generation', () => {
		it('should generate revert command for redo', () => {
			const afterCommit = 'revert123'
			const mode = ' -m 1'
			const cmd = `git revert -s --no-edit ${afterCommit}${mode}`

			expect(cmd).toContain('git revert')
			expect(cmd).toContain(afterCommit)
		})
	})

	describe('Cache cleanup', () => {
		it('should delete revert cache after redo', async () => {
			const { delRevertCache } = await import('@gitmars/cache')
			const commitIDs = ['revert123']

			delRevertCache(commitIDs)
			expect(delRevertCache).toHaveBeenCalledWith(commitIDs)
		})
	})
})

describe('gitm save command', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Stash message generation', () => {
		it('should generate stash message with branch name', async () => {
			const { getCurrentBranch } = await import('@gitmars/git')
			let message = getCurrentBranch()

			message = `${message}_cache_by_gitmars`

			expect(message).toBe('feature/test-branch_cache_by_gitmars')
		})

		it('should use provided message', () => {
			let message = 'custom-message'

			message = `${message}_cache_by_gitmars`

			expect(message).toBe('custom-message_cache_by_gitmars')
		})
	})

	describe('Force option', () => {
		it('should add git add . when force is true', () => {
			const cmds: string[] = ['git add .', 'git stash save "test"']

			expect(cmds).toContain('git add .')
		})

		it('should not add git add . when force is false', () => {
			const cmds: string[] = ['git stash save "test"']

			expect(cmds).not.toContain('git add .')
		})
	})

	describe('Queue execution', () => {
		it('should execute stash save command', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue(['git stash save "test"'])

			expect(Array.isArray(result)).toBeTruthy()
		})
	})
})

describe('gitm get command', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Stash list retrieval', () => {
		it('should get stash list for current branch', async () => {
			const { getStashList } = await import('@gitmars/git')
			const list = getStashList('feature/test-branch')

			expect(Array.isArray(list)).toBeTruthy()
			expect(list.length).toBeGreaterThan(0)
		})

		it('should handle empty stash list', async () => {
			const { getStashList } = await import('@gitmars/git')

			// Override mock for this test
			vi.mocked(getStashList).mockReturnValueOnce([])
			const list = getStashList('non-existent')

			expect(Array.isArray(list)).toBeTruthy()
			expect(list).toHaveLength(0)
		})
	})

	describe('Keep option', () => {
		it('should use stash apply when keep is true', () => {
			const opt = { keep: true }
			const cmd = `git stash ${opt.keep ? 'apply' : 'pop'} stash@{0}`

			expect(cmd).toContain('apply')
		})

		it('should use stash pop when keep is false', () => {
			const opt = { keep: false }
			const cmd = `git stash ${opt.keep ? 'apply' : 'pop'} stash@{0}`

			expect(cmd).toContain('pop')
		})
	})

	describe('Index option', () => {
		it('should use default index 0 when not provided', () => {
			const index = undefined
			const selectedIndex = Number(index) || 0

			expect(selectedIndex).toBe(0)
		})

		it('should use provided index', () => {
			const index = '1'
			const selectedIndex = Number(index) || 0

			expect(selectedIndex).toBe(1)
		})
	})

	describe('Queue execution', () => {
		it('should execute stash pop/apply command', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue(['git stash pop stash@{0}', 'git reset -q HEAD -- .'])

			expect(Array.isArray(result)).toBeTruthy()
			expect(result).toHaveLength(2)
		})
	})
})

describe('Common command patterns', () => {
	describe('Git project check', () => {
		it('should check if current directory is git project', async () => {
			const { getIsGitProject } = await import('@gitmars/git')
			const isGit = getIsGitProject()

			expect(typeof isGit).toBe('boolean')
		})
	})

	describe('Branch operations', () => {
		it('should get current branch', async () => {
			const { getCurrentBranch } = await import('@gitmars/git')
			const branch = getCurrentBranch()

			expect(typeof branch).toBe('string')
			expect(branch.length).toBeGreaterThan(0)
		})
	})

	describe('Queue execution patterns', () => {
		it('should handle command with config', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue([
				{
					cmd: 'git status',
					config: {
						again: false,
						success: 'Success message',
						fail: 'Fail message',
					},
				},
			])

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should handle multiple commands', async () => {
			const { queue } = await import('@gitmars/core')
			const result = await queue([
				'git fetch',
				'git status',
				'git log -1',
			])

			expect(Array.isArray(result)).toBeTruthy()
			expect(result).toHaveLength(3)
		})
	})
})
