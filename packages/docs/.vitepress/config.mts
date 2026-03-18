import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'Gitmars',
	description: 'A Git Workflow Tool',
	base: '/gitmars/',
	head: [
		['meta', { content: '#f56c2d', name: 'theme-color' }]
	],
	outDir: 'dist',
	cleanUrls: true,
	locales: {
		root: {
			label: 'English',
			lang: 'en',
			description: 'A Git Workflow Tool',
			themeConfig: {
				nav: [
					{ text: 'Home', link: '/' },
					{ text: 'Guide', link: '/guide/' },
					{ text: 'API', link: '/api/' },
					{ text: 'Examples', link: '/example/' },
					{
						text: 'Links',
						items: [
							{ text: 'GitHub', link: 'https://github.com/saqqdy/gitmars' },
							{ text: 'NPM', link: 'https://www.npmjs.com/package/gitmars' }
						]
					}
				],
				sidebar: {
					'/guide/': [
						{
							text: 'Guide',
							items: [
								{ text: 'Introduction', link: '/guide/' },
								{ text: 'Getting Started', link: '/guide/getting-start' },
								{ text: 'Basic Config', link: '/guide/basic-config' }
							]
						}
					],
					'/api/': [
						{
							text: 'API Reference',
							items: [{ text: 'Overview', link: '/api/' }]
						},
						{
							text: 'Smart Navigation',
							items: [{ text: 'gitm go', link: '/api/#gitm-go' }]
						},
						{
							text: 'Configuration',
							items: [
								{ text: 'gitm init', link: '/api/#gitm-init' },
								{ text: 'gitm config', link: '/api/#gitm-config' }
							]
						},
						{
							text: 'Workflow',
							items: [
								{ text: 'gitm start', link: '/api/#gitm-start' },
								{ text: 'gitm combine', link: '/api/#gitm-combine' },
								{ text: 'gitm end', link: '/api/#gitm-end' },
								{ text: 'gitm update', link: '/api/#gitm-update' },
								{ text: 'gitm continue', link: '/api/#gitm-continue' }
							]
						},
						{
							text: 'Productivity',
							collapsed: true,
							items: [
								{ text: 'gitm copy', link: '/api/#gitm-copy' },
								{ text: 'gitm build', link: '/api/#gitm-build' },
								{ text: 'gitm build-mp', link: '/api/#gitm-build-mp' },
								{ text: 'gitm miniprogram', link: '/api/#gitm-miniprogram' },
								{ text: 'gitm branch', link: '/api/#gitm-branch' },
								{ text: 'gitm revert', link: '/api/#gitm-revert' },
								{ text: 'gitm undo', link: '/api/#gitm-undo' },
								{ text: 'gitm redo', link: '/api/#gitm-redo' },
								{ text: 'gitm save', link: '/api/#gitm-save' },
								{ text: 'gitm get', link: '/api/#gitm-get' },
								{ text: 'gitm cleanbranch', link: '/api/#gitm-cleanbranch' },
								{ text: 'gitm log', link: '/api/#gitm-log' },
								{ text: 'gitm hook', link: '/api/#gitm-hook' },
								{ text: 'gitm run', link: '/api/#gitm-run' },
								{ text: 'gitm upgrade', link: '/api/#gitm-upgrade' },
								{ text: 'gitm clean', link: '/api/#gitm-clean' },
								{ text: 'gitm suggest', link: '/api/#gitm-suggest' },
								{ text: 'gitm approve', link: '/api/#gitm-approve' },
								{ text: 'gitm review', link: '/api/#gitm-review' },
								{ text: 'gitm status', link: '/api/#gitm-status' },
								{ text: 'gitm link', link: '/api/#gitm-link' },
								{ text: 'gitm unlink', link: '/api/#gitm-unlink' },
								{ text: 'gitm postmsg', link: '/api/#gitm-postmsg' },
								{ text: 'gitm alias', link: '/api/#gitm-alias' }
							]
						},
						{
							text: 'Administrator',
							items: [
								{ text: 'gitm admin create', link: '/api/#gitm-admin-create' },
								{ text: 'gitm admin publish', link: '/api/#gitm-admin-publish' },
								{ text: 'gitm admin update', link: '/api/#gitm-admin-update' },
								{ text: 'gitm admin clean', link: '/api/#gitm-admin-clean' }
							]
						},
						{
							text: 'Other',
							items: [
								{ text: 'gitm permission', link: '/api/#gitm-permission' },
								{ text: 'gitm version', link: '/api/#gitm-version' }
							]
						}
					]
				},
				editLink: {
					pattern: 'https://github.com/saqqdy/gitmars/edit/master/packages/docs/:path',
					text: 'Edit this page on GitHub'
				},
				footer: {
					message: 'Released under the GPL-3.0 License.',
					copyright: 'Copyright © 2021-present saqqdy'
				},
				lastUpdated: {
					text: 'Last updated',
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
				},
				docFooter: {
					prev: 'Previous',
					next: 'Next'
				},
				outline: {
					label: 'On this page',
					level: [2, 3]
				},
				returnToTopLabel: 'Return to top',
				sidebarMenuLabel: 'Menu',
				darkModeSwitchLabel: 'Theme',
				darkModeSwitchTitle: 'Switch to dark theme',
				lightModeSwitchTitle: 'Switch to light theme',
				langMenuLabel: 'Language'
			}
		},
		zh: {
			label: '简体中文',
			lang: 'zh-CN',
			link: '/zh/',
			description: '这是一个git工作流工具',
			themeConfig: {
				nav: [
					{ text: '首页', link: '/zh/' },
					{ text: '指南', link: '/zh/guide/' },
					{ text: 'API', link: '/zh/api/' },
					{ text: '示例', link: '/zh/example/' },
					{
						text: '更多',
						items: [
							{ text: 'GitHub', link: 'https://github.com/saqqdy/gitmars' },
							{ text: 'NPM', link: 'https://www.npmjs.com/package/gitmars' }
						]
					}
				],
				sidebar: {
					'/zh/guide/': [
						{
							text: '指南',
							items: [
								{ text: '介绍', link: '/zh/guide/' },
								{ text: '快速上手', link: '/zh/guide/getting-start' },
								{ text: '基本配置', link: '/zh/guide/basic-config' }
							]
						}
					],
					'/zh/api/': [
						{
							text: 'API 参考',
							items: [{ text: '概览', link: '/zh/api/' }]
						},
						{
							text: '智能导航',
							items: [{ text: 'gitm go', link: '/zh/api/#gitm-go' }]
						},
						{
							text: '配置',
							items: [
								{ text: 'gitm init', link: '/zh/api/#gitm-init' },
								{ text: 'gitm config', link: '/zh/api/#gitm-config' }
							]
						},
						{
							text: '工作流',
							items: [
								{ text: 'gitm start', link: '/zh/api/#gitm-start' },
								{ text: 'gitm combine', link: '/zh/api/#gitm-combine' },
								{ text: 'gitm end', link: '/zh/api/#gitm-end' },
								{ text: 'gitm update', link: '/zh/api/#gitm-update' },
								{ text: 'gitm continue', link: '/zh/api/#gitm-continue' }
							]
						},
						{
							text: '效率',
							collapsed: true,
							items: [
								{ text: 'gitm copy', link: '/zh/api/#gitm-copy' },
								{ text: 'gitm build', link: '/zh/api/#gitm-build' },
								{ text: 'gitm build-mp', link: '/zh/api/#gitm-build-mp' },
								{ text: 'gitm miniprogram', link: '/zh/api/#gitm-miniprogram' },
								{ text: 'gitm branch', link: '/zh/api/#gitm-branch' },
								{ text: 'gitm revert', link: '/zh/api/#gitm-revert' },
								{ text: 'gitm undo', link: '/zh/api/#gitm-undo' },
								{ text: 'gitm redo', link: '/zh/api/#gitm-redo' },
								{ text: 'gitm save', link: '/zh/api/#gitm-save' },
								{ text: 'gitm get', link: '/zh/api/#gitm-get' },
								{ text: 'gitm cleanbranch', link: '/zh/api/#gitm-cleanbranch' },
								{ text: 'gitm log', link: '/zh/api/#gitm-log' },
								{ text: 'gitm hook', link: '/zh/api/#gitm-hook' },
								{ text: 'gitm run', link: '/zh/api/#gitm-run' },
								{ text: 'gitm upgrade', link: '/zh/api/#gitm-upgrade' },
								{ text: 'gitm clean', link: '/zh/api/#gitm-clean' },
								{ text: 'gitm suggest', link: '/zh/api/#gitm-suggest' },
								{ text: 'gitm approve', link: '/zh/api/#gitm-approve' },
								{ text: 'gitm review', link: '/zh/api/#gitm-review' },
								{ text: 'gitm status', link: '/zh/api/#gitm-status' },
								{ text: 'gitm link', link: '/zh/api/#gitm-link' },
								{ text: 'gitm unlink', link: '/zh/api/#gitm-unlink' },
								{ text: 'gitm postmsg', link: '/zh/api/#gitm-postmsg' },
								{ text: 'gitm alias', link: '/zh/api/#gitm-alias' }
							]
						},
						{
							text: '管理员',
							items: [
								{ text: 'gitm admin create', link: '/zh/api/#gitm-admin-create' },
								{ text: 'gitm admin publish', link: '/zh/api/#gitm-admin-publish' },
								{ text: 'gitm admin update', link: '/zh/api/#gitm-admin-update' },
								{ text: 'gitm admin clean', link: '/zh/api/#gitm-admin-clean' }
							]
						},
						{
							text: '其他',
							items: [
								{ text: 'gitm permission', link: '/zh/api/#gitm-permission' },
								{ text: 'gitm version', link: '/zh/api/#gitm-version' }
							]
						}
					]
				},
				editLink: {
					pattern: 'https://github.com/saqqdy/gitmars/edit/master/packages/docs/:path',
					text: '在 GitHub 上编辑此页'
				},
				footer: {
					message: '基于 GPL-3.0 许可发布',
					copyright: '版权所有 © 2021-present saqqdy'
				},
				lastUpdated: {
					text: '最后更新于',
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
				},
				docFooter: {
					prev: '上一页',
					next: '下一页'
				},
				outline: {
					label: '页面导航',
					level: [2, 3]
				},
				returnToTopLabel: '回到顶部',
				sidebarMenuLabel: '菜单',
				darkModeSwitchLabel: '主题',
				darkModeSwitchTitle: '切换到深色模式',
				lightModeSwitchTitle: '切换到浅色模式',
				langMenuLabel: '语言'
			}
		}
	},
	themeConfig: {
		logo: '/logo.svg',
		siteTitle: 'Gitmars',
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/saqqdy/gitmars' }
		],
		search: { provider: 'local' }
	}
})
