import { describe, expect, it, vi } from 'vitest'
import getCurrentBranch from '../src/getCurrentBranch.js'
import getGitConfig from '../src/getGitConfig.js'
import getGitRevParse from '../src/getGitRevParse.js'
import getGitStatus from '../src/getGitStatus.js'
import { getGitEmail, getGitUser } from '../src/getGitUser.js'
import getGitVersion from '../src/getGitVersion.js'
import getIsBranchOrCommitExist from '../src/getIsBranchOrCommitExist.js'
import getIsGitProject from '../src/getIsGitProject.js'

// Mock @gitmars/utils
vi.mock('@gitmars/utils', () => ({
	spawnSync: vi.fn((cmd: string, args: string[]) => {
		// Simulate git commands
		if (cmd === 'git') {
			if (args[0] === 'symbolic-ref') {
				return { stdout: 'master' }
			}
			if (args[0] === '--version') {
				return { stdout: 'git version 2.39.0' }
			}
			if (args[0] === 'rev-parse' && args[1] === '--is-inside-work-tree') {
				return { stdout: 'true' }
			}
			if (args[0] === 'rev-parse') {
				return {
					stdout: '/Users/test/project\n\n/tmp/.git\n/tmp/.git\n',
				}
			}
			if (args[0] === 'config') {
				if (args[1] === 'user.name') {
					return { stdout: 'Test User' }
				}
				if (args[1] === 'user.email') {
					return { stdout: 'test@example.com' }
				}
				if (args[1] === '--local' && args[2] === '--get') {
					return { stdout: 'git@github.com:test/project.git' }
				}

				return { stdout: '' }
			}
			if (args[0] === 'status') {
				return { stdout: 'M file1.ts\nA file2.ts\n?? file3.ts' }
			}
			if (args[0] === 'branch') {
				return { stdout: 'master' }
			}
			if (args[0] === 'cat-file') {
				return { stdout: '' }
			}
			if (args[0] === 'log') {
				return { stdout: 'abc123 def456\nghi789 jkl012' }
			}
			if (args[0] === 'ls-remote') {
				return { stdout: 'abc123\trefs/heads/master\ndef456\trefs/heads/develop' }
			}
			if (args[0] === 'stash') {
				return { stdout: 'stash@{0}: On master: test stash' }
			}
			if (args[0] === 'switch' || args[0] === 'remote' || args[0] === 'fetch') {
				return { stdout: '' }
			}
			if (args[0] === 'show') {
				return { stdout: 'abc123|Test commit|Author|2023-01-01' }
			}
		}

		return { stdout: '' }
	}),
	debug: vi.fn(),
	debugWarn: vi.fn(),
	debugError: vi.fn(),
	getSeconds: vi.fn(() => Math.floor(Date.now() / 1000 - 86400)),
	isDebug: false,
	useLocale: vi.fn(() => ({
		t: (key: string) => key,
		lang: 'en-US',
		locale: {},
	})),
}))

vi.mock('shelljs', () => ({
	default: {
		echo: vi.fn(),
	},
}))

vi.mock('slash', () => ({
	default: (str: string) => str,
}))

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

	describe('getGitUser', () => {
		it('should return git user name', () => {
			const user = getGitUser()

			expect(user).toBeDefined()
			expect(typeof user).toBe('string')
		})
	})

	describe('getGitEmail', () => {
		it('should return git user email', () => {
			const email = getGitEmail()

			expect(email).toBeDefined()
			expect(typeof email).toBe('string')
		})
	})

	describe('getGitRevParse', () => {
		it('should return git project info', () => {
			const result = getGitRevParse()

			expect(result).toHaveProperty('root')
			expect(result).toHaveProperty('gitDir')
			expect(result).toHaveProperty('gitHookDir')
			expect(result).toHaveProperty('prefix')
			expect(result).toHaveProperty('gitCommonDir')
			expect(result).toHaveProperty('cdup')
		})

		it('should return string values for all properties', () => {
			const result = getGitRevParse()

			expect(typeof result.root).toBe('string')
			expect(typeof result.gitDir).toBe('string')
			expect(typeof result.gitHookDir).toBe('string')
		})
	})

	describe('getGitConfig', () => {
		it('should return git config info', () => {
			const result = getGitConfig()

			expect(result).toHaveProperty('gitUrl')
			expect(result).toHaveProperty('appName')
		})

		it('should return string values', () => {
			const result = getGitConfig()

			expect(typeof result.gitUrl).toBe('string')
			expect(typeof result.appName).toBe('string')
		})
	})

	describe('getGitStatus', () => {
		it('should return git status object', () => {
			const result = getGitStatus()

			expect(result).toHaveProperty('A')
			expect(result).toHaveProperty('D')
			expect(result).toHaveProperty('M')
			expect(result).toHaveProperty('UU')
			expect(result).toHaveProperty('??')
		})

		it('should return arrays for all status types', () => {
			const result = getGitStatus()

			expect(Array.isArray(result.A)).toBeTruthy()
			expect(Array.isArray(result.D)).toBeTruthy()
			expect(Array.isArray(result.M)).toBeTruthy()
			expect(Array.isArray(result.UU)).toBeTruthy()
			expect(Array.isArray(result['??'])).toBeTruthy()
		})
	})

	describe('getIsBranchOrCommitExist', () => {
		it('should return a boolean', () => {
			const result = getIsBranchOrCommitExist('master')

			expect(typeof result).toBe('boolean')
		})
	})
})

describe('additional git functions', () => {
	describe('getConfig', () => {
		it('should return config object', async () => {
			const getConfig = (await import('../src/getConfig.js')).default
			// Use current working directory which is a git project
			const result = getConfig(process.cwd())

			expect(result).toBeDefined()
			expect(typeof result).toBe('object')
		})

		it('should have default values', async () => {
			const getConfig = (await import('../src/getConfig.js')).default
			const result = getConfig(process.cwd())

			expect(result).toHaveProperty('master')
			expect(result).toHaveProperty('develop')
			expect(result).toHaveProperty('release')
		})
	})

	describe('readPkg', () => {
		it('should return package.json content', async () => {
			const readPkg = (await import('../src/readPkg.js')).default
			// Use current working directory which has package.json
			const result = readPkg(process.cwd())

			expect(result).toBeDefined()
			expect(result).toHaveProperty('name')
		})
	})

	describe('searchBranches', () => {
		it('should return array of branches', async () => {
			const searchBranches = (await import('../src/searchBranches.js')).default
			const result = searchBranches()

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should filter by key', async () => {
			const searchBranches = (await import('../src/searchBranches.js')).default
			const result = searchBranches({ key: 'test' })

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should filter by type', async () => {
			const searchBranches = (await import('../src/searchBranches.js')).default
			const result = searchBranches({ type: 'feature' })

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('getAheadLogs', () => {
		it('should return array of ahead logs', async () => {
			const getAheadLogs = (await import('../src/getAheadLogs.js')).default
			const result = getAheadLogs()

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('getBehindLogs', () => {
		it('should return array of behind logs', async () => {
			const getBehindLogs = (await import('../src/getBehindLogs.js')).default
			const result = getBehindLogs()

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('getBranchesFromID', () => {
		it('should return array of branches', async () => {
			const getBranchesFromID = (await import('../src/getBranchesFromID.js')).default
			const result = getBranchesFromID('abc123')

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should support remote flag', async () => {
			const getBranchesFromID = (await import('../src/getBranchesFromID.js')).default
			const result = getBranchesFromID('abc123', true)

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('getGitLogs', () => {
		it('should return array of logs', async () => {
			const getGitLogs = (await import('../src/getGitLogs.js')).default
			const result = getGitLogs()

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should support limit parameter', async () => {
			const getGitLogs = (await import('../src/getGitLogs.js')).default
			const result = getGitLogs({ limit: 10 })

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should support noMerges parameter', async () => {
			const getGitLogs = (await import('../src/getGitLogs.js')).default
			const result = getGitLogs({ noMerges: true })

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('checkout', () => {
		it('should not throw when switching branch', async () => {
			const checkout = (await import('../src/checkout.js')).default

			expect(() => checkout('master')).not.toThrow()
		})
	})

	describe('fetch', () => {
		it('should not throw when fetching', async () => {
			const fetch = (await import('../src/fetch.js')).default

			expect(() => fetch()).not.toThrow()
		})
	})

	describe('prune', () => {
		it('should not throw when pruning', async () => {
			const prune = (await import('../src/prune.js')).default

			expect(() => prune()).not.toThrow()
		})
	})

	describe('checkGitStatus', () => {
		it('should return boolean', async () => {
			const checkGitStatus = (await import('../src/checkGitStatus.js')).default
			const result = checkGitStatus()

			expect(typeof result).toBe('boolean')
		})
	})

	describe('getStashList', () => {
		it('should return array of stash entries', async () => {
			const getStashList = (await import('../src/getStashList.js')).default
			const result = getStashList('')

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should filter by key', async () => {
			const getStashList = (await import('../src/getStashList.js')).default
			const result = getStashList('test')

			expect(Array.isArray(result)).toBeTruthy()
		})
	})

	describe('getCommandMessage', () => {
		it('should return messages object', async () => {
			const getCommandMessage = (await import('../src/getCommandMessage.js')).default
			const result = getCommandMessage('start')

			expect(result).toBeDefined()
		})
	})

	describe('getIsMergeAction', () => {
		it('should return boolean', async () => {
			const getIsMergeAction = (await import('../src/getIsMergeAction.js')).default
			const result = getIsMergeAction()

			expect(typeof result).toBe('boolean')
		})
	})

	describe('getIsMergedTargetBranch', () => {
		it('should return boolean', async () => {
			const getIsMergedTargetBranch = (await import('../src/getIsMergedTargetBranch.js')).default
			const result = getIsMergedTargetBranch('master', 'dev', { remote: false })

			expect(typeof result).toBe('boolean')
		})

		it('should support remote option', async () => {
			const getIsMergedTargetBranch = (await import('../src/getIsMergedTargetBranch.js')).default
			const result = getIsMergedTargetBranch('master', 'dev', { remote: true })

			expect(typeof result).toBe('boolean')
		})

		it('should support noMerges option', async () => {
			const getIsMergedTargetBranch = (await import('../src/getIsMergedTargetBranch.js')).default
			const result = getIsMergedTargetBranch('master', 'dev', { noMerges: false })

			expect(typeof result).toBe('boolean')
		})
	})

	describe('getIsUpdatedInTime', () => {
		it('should return boolean', async () => {
			const getIsUpdatedInTime = (await import('../src/getIsUpdatedInTime.js')).default
			const result = getIsUpdatedInTime({ lastet: '1w', branch: 'master' })

			expect(typeof result).toBe('boolean')
		})

		it('should support limit option', async () => {
			const getIsUpdatedInTime = (await import('../src/getIsUpdatedInTime.js')).default
			const result = getIsUpdatedInTime({ lastet: '1d', limit: 10, branch: 'master' })

			expect(typeof result).toBe('boolean')
		})
	})

	describe('getGitLogsByCommitIDs', () => {
		it('should return array of logs', async () => {
			const getGitLogsByCommitIDs = (await import('../src/getGitLogsByCommitIDs.js')).default
			const result = getGitLogsByCommitIDs({ commitIDs: ['abc123'], keys: ['%H', '%s'] })

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should support string commitID', async () => {
			const getGitLogsByCommitIDs = (await import('../src/getGitLogsByCommitIDs.js')).default
			const result = getGitLogsByCommitIDs({ commitIDs: 'abc123', keys: ['%H'] })

			expect(Array.isArray(result)).toBeTruthy()
		})

		it('should support params option', async () => {
			const getGitLogsByCommitIDs = (await import('../src/getGitLogsByCommitIDs.js')).default
			const result = getGitLogsByCommitIDs({ commitIDs: ['abc123'], keys: ['%H'], params: '--no-patch' })

			expect(Array.isArray(result)).toBeTruthy()
		})
	})
})

describe('module exports', () => {
	it('should export getCurrentBranch', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getCurrentBranch).toBeDefined()
		expect(typeof mod.getCurrentBranch).toBe('function')
	})

	it('should export getGitVersion', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitVersion).toBeDefined()
		expect(typeof mod.getGitVersion).toBe('function')
	})

	it('should export getIsGitProject', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getIsGitProject).toBeDefined()
		expect(typeof mod.getIsGitProject).toBe('function')
	})

	it('should export getGitRevParse', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitRevParse).toBeDefined()
		expect(typeof mod.getGitRevParse).toBe('function')
	})

	it('should export getGitConfig', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitConfig).toBeDefined()
		expect(typeof mod.getGitConfig).toBe('function')
	})

	it('should export getGitUser', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitUser).toBeDefined()
		expect(typeof mod.getGitUser).toBe('function')
	})

	it('should export getGitEmail', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitEmail).toBeDefined()
		expect(typeof mod.getGitEmail).toBe('function')
	})

	it('should export getGitStatus', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitStatus).toBeDefined()
		expect(typeof mod.getGitStatus).toBe('function')
	})

	it('should export getIsBranchOrCommitExist', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getIsBranchOrCommitExist).toBeDefined()
		expect(typeof mod.getIsBranchOrCommitExist).toBe('function')
	})

	it('should export getConfig', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getConfig).toBeDefined()
		expect(typeof mod.getConfig).toBe('function')
	})

	it('should export readPkg', async () => {
		const mod = await import('../src/index.js')

		expect(mod.readPkg).toBeDefined()
		expect(typeof mod.readPkg).toBe('function')
	})

	it('should export searchBranches', async () => {
		const mod = await import('../src/index.js')

		expect(mod.searchBranches).toBeDefined()
		expect(typeof mod.searchBranches).toBe('function')
	})

	it('should export getAheadLogs', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getAheadLogs).toBeDefined()
		expect(typeof mod.getAheadLogs).toBe('function')
	})

	it('should export getBehindLogs', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getBehindLogs).toBeDefined()
		expect(typeof mod.getBehindLogs).toBe('function')
	})

	it('should export getBranchesFromID', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getBranchesFromID).toBeDefined()
		expect(typeof mod.getBranchesFromID).toBe('function')
	})

	it('should export getGitLogs', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitLogs).toBeDefined()
		expect(typeof mod.getGitLogs).toBe('function')
	})

	it('should export checkout', async () => {
		const mod = await import('../src/index.js')

		expect(mod.checkout).toBeDefined()
		expect(typeof mod.checkout).toBe('function')
	})

	it('should export fetch', async () => {
		const mod = await import('../src/index.js')

		expect(mod.fetch).toBeDefined()
		expect(typeof mod.fetch).toBe('function')
	})

	it('should export prune', async () => {
		const mod = await import('../src/index.js')

		expect(mod.prune).toBeDefined()
		expect(typeof mod.prune).toBe('function')
	})

	it('should export checkGitStatus', async () => {
		const mod = await import('../src/index.js')

		expect(mod.checkGitStatus).toBeDefined()
		expect(typeof mod.checkGitStatus).toBe('function')
	})

	it('should export getStashList', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getStashList).toBeDefined()
		expect(typeof mod.getStashList).toBe('function')
	})

	it('should export getCommandMessage', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getCommandMessage).toBeDefined()
		expect(typeof mod.getCommandMessage).toBe('function')
	})

	it('should export getIsMergeAction', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getIsMergeAction).toBeDefined()
		expect(typeof mod.getIsMergeAction).toBe('function')
	})

	it('should export getIsMergedTargetBranch', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getIsMergedTargetBranch).toBeDefined()
		expect(typeof mod.getIsMergedTargetBranch).toBe('function')
	})

	it('should export getIsUpdatedInTime', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getIsUpdatedInTime).toBeDefined()
		expect(typeof mod.getIsUpdatedInTime).toBe('function')
	})

	it('should export getGitLogsByCommitIDs', async () => {
		const mod = await import('../src/index.js')

		expect(mod.getGitLogsByCommitIDs).toBeDefined()
		expect(typeof mod.getGitLogsByCommitIDs).toBe('function')
	})
})
