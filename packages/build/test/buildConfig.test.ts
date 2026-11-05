import type { ApolloConfigType } from '../src/types'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { getBuildConfig, getProjectOption } from '../src/buildConfig.js'

const CACHE_PATH = '/tmp/gitmars-build-config-test'

const mocks = vi.hoisted(() => ({
	getConfig: vi.fn(),
	requestGet: vi.fn(),
	writeFile: vi.fn(),
	isCacheExpired: vi.fn(),
	updateCacheTime: vi.fn(),
	isFileExist: vi.fn(),
}))

vi.mock('@gitmars/cache', () => ({
	CACHE_PATH: '/tmp/gitmars-build-config-test',
	isCacheExpired: mocks.isCacheExpired,
	updateCacheTime: mocks.updateCacheTime,
}))

vi.mock('@gitmars/git', () => ({
	getConfig: mocks.getConfig,
}))

vi.mock('@gitmars/utils', () => ({
	debug: vi.fn(),
	isFileExist: mocks.isFileExist,
	removeFile: vi.fn(),
	writeFile: mocks.writeFile,
	useLocale: vi.fn(() => ({ t: (key: string) => key, lang: 'en-US', locale: {} })),
}))

vi.mock('@jssj/request', () => ({
	default: { get: mocks.requestGet },
}))

const buildSecret = {
	username: 'jenkins-user',
	password: 'jenkins-password',
	miniprogramToken: 'mp-token',
	miniprogramSession: 'mp-session',
	gitNotificationGroupUrl: 'https://notify.example.com/hook',
}

const secretKeys = Object.keys(buildSecret)

function createApiConfig(): ApolloConfigType {
	return {
		dev: {
			line: 'dev',
			schema: 'dev-schema',
			list: [{ name: 'app', project: 'app', schema: 'app-schema' }],
		},
		bug: { line: 'bug', schema: 'bug-schema', list: [] },
		prod: { line: 'prod', schema: 'prod-schema', list: [] },
		username: 'legacy-user',
		password: 'legacy-password',
		miniprogramToken: 'legacy-mp-token',
		miniprogramSession: 'legacy-mp-session',
		gitNotificationGroupUrl: 'https://notify.example.com/legacy',
		template: 'https://jenkins.example.com/job/app/build',
		templateWithParam: 'https://jenkins.example.com/job/app/buildWithParameters',
	}
}

function mockConfig(params: Record<string, string> = { name: 'team' }) {
	return {
		master: 'master',
		develop: 'dev',
		release: 'release',
		bugfix: 'bug',
		support: 'support',
		apis: {
			buildConfig: { url: 'https://api.example.com/buildConfig', method: 'get', params },
		},
		buildSecret,
	}
}

describe('getBuildConfig security', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mkdirSync(CACHE_PATH, { recursive: true })
		mocks.isCacheExpired.mockReturnValue(true)
		mocks.isFileExist.mockReturnValue(false)
		mocks.updateCacheTime.mockResolvedValue(undefined)
		mocks.writeFile.mockResolvedValue(undefined)
		mocks.getConfig.mockReturnValue(mockConfig())
		mocks.requestGet.mockResolvedValue({ data: createApiConfig() })
	})

	afterAll(() => {
		rmSync(CACHE_PATH, { recursive: true, force: true })
	})

	it('injects buildSecret into the returned config', async () => {
		const result = await getBuildConfig(false)

		expect(result.username).toBe(buildSecret.username)
		expect(result.password).toBe(buildSecret.password)
		expect(result.miniprogramToken).toBe(buildSecret.miniprogramToken)
		expect(result.miniprogramSession).toBe(buildSecret.miniprogramSession)
		expect(result.gitNotificationGroupUrl).toBe(buildSecret.gitNotificationGroupUrl)
	})

	it('never persists secrets to the cache file', async () => {
		await getBuildConfig(false)

		const [filepath, payload] = mocks.writeFile.mock.calls[0]

		expect(filepath).toBe(`${CACHE_PATH}/buildConfig-team.json`)
		const cached = JSON.parse(payload)

		for (const key of secretKeys) {
			expect(cached).not.toHaveProperty(key)
		}
	})

	it('keeps per-env schema in the cache and in the result', async () => {
		const result = await getBuildConfig(false)
		const cached = JSON.parse(mocks.writeFile.mock.calls[0][1])

		expect(result.dev.schema).toBe('dev-schema')
		expect(result.bug.schema).toBe('bug-schema')
		expect(result.prod.schema).toBe('prod-schema')
		expect(cached.dev.schema).toBe('dev-schema')
		expect(cached).not.toHaveProperty('token')
	})

	it('re-injects secrets when the cache is still valid', async () => {
		mocks.isCacheExpired.mockReturnValue(false)
		mocks.isFileExist.mockReturnValue(true)
		mocks.getConfig.mockReturnValue(mockConfig({ name: 'cache-hit' }))
		writeFileSync(
			`${CACHE_PATH}/buildConfig-cache-hit.json`,
			JSON.stringify({
				dev: { line: 'dev', schema: 'dev-schema', list: [] },
				bug: { line: 'bug', schema: 'bug-schema', list: [] },
				prod: { line: 'prod', schema: 'prod-schema', list: [] },
				template: 'https://jenkins.example.com/job/app/build',
				templateWithParam: 'https://jenkins.example.com/job/app/buildWithParameters',
			}),
		)

		const result = await getBuildConfig(false)

		expect(mocks.requestGet).not.toHaveBeenCalled()
		expect(mocks.writeFile).not.toHaveBeenCalled()
		expect(result.username).toBe(buildSecret.username)
		expect(result.dev.schema).toBe('dev-schema')
	})

	it('leaves the API response untouched when buildSecret is absent', async () => {
		mocks.getConfig.mockReturnValue({ ...mockConfig(), buildSecret: undefined })

		const result = await getBuildConfig(false)

		expect(result.username).toBe('legacy-user')
		expect(result.gitNotificationGroupUrl).toBe('https://notify.example.com/legacy')
	})

	it('exposes the renamed schema through getProjectOption', async () => {
		const project = await getProjectOption('app', 'dev', createApiConfig())

		expect(project.name).toBe('app')
		expect(project.schema).toBe('app-schema')
		expect(mocks.requestGet).not.toHaveBeenCalled()
	})
})
