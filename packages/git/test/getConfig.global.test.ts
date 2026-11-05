import { beforeEach, describe, expect, it, vi } from 'vitest'

import getConfig from '../src/getConfig.js'

const mocks = vi.hoisted(() => ({
	statSync: vi.fn(),
	search: vi.fn(),
	load: vi.fn(),
	spawnSync: vi.fn(),
}))

vi.mock('node:fs', () => ({
	statSync: mocks.statSync,
}))

vi.mock('node:os', () => ({
	homedir: vi.fn(() => '/home/tester'),
}))

vi.mock('@gitmars/utils', () => ({
	debug: vi.fn(),
	echo: vi.fn(),
	spawnSync: mocks.spawnSync,
	useLocale: vi.fn(() => ({ t: (key: string) => key, lang: 'en-US', locale: {} })),
}))

vi.mock('cosmiconfig', () => ({
	cosmiconfigSync: vi.fn(() => ({
		search: mocks.search,
		load: mocks.load,
	})),
}))

vi.mock('../src/getGitRevParse.js', () => ({
	default: vi.fn(() => ({
		root: '/work/project',
		prefix: '.',
		gitCommonDir: '/work/project/.git',
		gitDir: '/work/project/.git',
		gitHookDir: '/work/project/.git/hooks',
		cdup: '',
	})),
}))

vi.mock('../src/lang.js', () => ({
	default: { t: (key: string) => key },
}))

describe('getConfig two-layer merge', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// getGitRevParse is mocked; statSync is called for the project file path.
		// Throw so getConfig falls back to treating pathName as a directory.
		mocks.statSync.mockImplementation((p: string) => {
			if (p === '/work/project/gitmarsconfig.json') throw new Error('ENOENT')

			return { isDirectory: () => true }
		})
	})

	it('merges global config as base and project config as override', () => {
		mocks.search.mockImplementation((from: string) => {
			if (from === '/home/tester') {
				return {
					config: { master: 'global-master', gitHost: 'https://git.example.com' },
					filepath: '/home/tester/.gitmarsrc',
				}
			}

			return {
				config: { master: 'project-master', gitID: '1234' },
				filepath: '/work/project/.gitmarsrc',
			}
		})

		const config = getConfig()

		expect(config.master).toBe('project-master')
		expect(config.gitHost).toBe('https://git.example.com')
		expect(config.gitID).toBe('1234')
		expect(config.skipCI).toBeTruthy()
	})

	it('falls back to defaults when global config is absent', () => {
		mocks.search.mockImplementation((from: string) => {
			if (from === '/home/tester') return null

			return { config: { develop: 'dev-project' }, filepath: '/work/project/.gitmarsrc' }
		})

		const config = getConfig()

		expect(config.master).toBe('master')
		expect(config.develop).toBe('dev-project')
	})

	it('does not mix in global config when a filepath is passed explicitly', () => {
		mocks.statSync.mockReturnValue({ isDirectory: () => false })
		mocks.load.mockReturnValue({
			config: { master: 'explicit-master' },
			filepath: '/work/project/custom.json',
		})

		const config = getConfig('/work/project/custom.json')

		expect(config.master).toBe('explicit-master')
		expect(mocks.search).not.toHaveBeenCalled()
	})

	it('ignores unparseable global config', () => {
		mocks.search.mockImplementation((from: string) => {
			if (from === '/home/tester') throw new Error('parse error')

			return { config: { master: 'project-master' }, filepath: '/work/project/.gitmarsrc' }
		})

		const config = getConfig()

		expect(config.master).toBe('project-master')
	})
})
