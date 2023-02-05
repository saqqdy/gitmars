#!/usr/bin/env zx

import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { loadYmlSync } from 'load-yml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const [, , ...args] = process.argv

const IS_ENABLE = args.includes('--enable')
const WORKFLOW_PUBLISH_TEST_PATH = join(__dirname, '..', '.github', 'workflows', 'publish-test.yml')

const workflowPublishTest = loadYmlSync(WORKFLOW_PUBLISH_TEST_PATH)
const workflows = execSync(`gh workflow list --all`, {
	stdio: 'pipe'
})
	.toString()
	.replace(/\n$/, '')
	.split('\n')
	.map(item => item.split('\t'))
for (const [name, status, id] of workflows) {
	if (name === workflowPublishTest.name) {
		!(!IS_ENABLE && status !== 'active') &&
			execSync(`gh workflow ${IS_ENABLE ? 'enable' : 'disable'} ${id}`, {
				stdio: 'inherit'
			})
		break
	}
}
