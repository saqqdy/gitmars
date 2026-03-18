import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'Gitmars',
	description: '这是一个git工作流工具',
	base: '/gitmars/',
	head: [['meta', { content: '#f56c2d', name: 'theme-color' }]],
	outDir: 'dist',
	cleanUrls: true,
	themeConfig: {
		logo: '/logo.svg',
		siteTitle: 'Gitmars',
		lastUpdated: {
			text: '最后更新于',
			formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
		},
		nav: [
			{ text: '首页', link: '/' },
			{ text: '指南', link: '/guide/' },
			{ text: 'API参考', link: '/api/' },
			{ text: '示例', link: '/example/' },
			{ text: 'Go', link: '/go/' },
			{
				text: '更多',
				items: [
					{
						text: '链接',
						items: [
							{ text: 'Github', link: 'https://github.com/saqqdy/gitmars' },
							{ text: 'Bugs', link: 'https://github.com/saqqdy/gitmars/issues' },
							{ text: '更新日志', link: '/changelog' }
						]
					},
					{
						text: '作者',
						items: [{ text: 'saqqdy', link: 'http://www.saqqdy.com' }]
					}
				]
			}
		],
		sidebar: {
			'/guide/': [
				{
					text: '指南',
					items: [
						{ text: '介绍', link: '/guide/' },
						{ text: '快速上手', link: '/guide/getting-start' },
						{ text: '基本配置', link: '/guide/basic-config' }
					]
				}
			],
			'/example/': [
				{
					text: '工作流',
					items: [
						{ text: 'feature', link: '/example/#feature' },
						{ text: 'bugfix', link: '/example/#bugfix' },
						{ text: 'support', link: '/example/#support' },
						{ text: 'publish', link: '/example/#publish' }
					]
				},
				{
					text: '效率',
					items: [
						{ text: 'copy', link: '/example/#copy' },
						{ text: 'build', link: '/example/#build' },
						{ text: 'branch', link: '/example/#branch' }
					]
				}
			],
			'/api/': [
				{
					text: '智能导航',
					items: [{ text: 'gitm go', link: '/api/#gitm-go' }]
				},
				{
					text: '配置',
					items: [
						{ text: 'gitm init', link: '/api/#gitm-init' },
						{ text: 'gitm config', link: '/api/#gitm-config' }
					]
				},
				{
					text: '工作流',
					items: [
						{ text: 'gitm start', link: '/api/#gitm-start' },
						{ text: 'gitm combine', link: '/api/#gitm-combine' },
						{ text: 'gitm end', link: '/api/#gitm-end' },
						{ text: 'gitm update', link: '/api/#gitm-update' },
						{ text: 'gitm continue', link: '/api/#gitm-continue' }
					]
				},
				{
					text: '效率',
					// collapsed: true,
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
					text: '管理员',
					items: [
						{ text: 'gitm admin create', link: '/api/#gitm-admin-create' },
						{ text: 'gitm admin publish', link: '/api/#gitm-admin-publish' },
						{ text: 'gitm admin update', link: '/api/#gitm-admin-update' },
						{ text: 'gitm admin clean', link: '/api/#gitm-admin-clean' }
					]
				},
				{
					text: '其他',
					items: [
						{ text: 'gitm permission', link: '/api/#gitm-permission' },
						{ text: 'gitm version', link: '/api/#gitm-version' }
					]
				}
			]
		},
		socialLinks: [{ icon: 'github', link: 'https://github.com/saqqdy/gitmars' }],
		editLink: {
			pattern: 'https://github.com/saqqdy/gitmars/edit/master/packages/docs/:path',
			text: '帮助我们改善此页面！'
		},
		footer: {
			message: 'Released under the GPL-3.0 License.',
			copyright: 'Copyright © 2021-present saqqdy'
		},
		search: { provider: 'local' },
		outline: { label: 'On this page', level: [2, 3] },
		docFooter: {
			prev: '上一页',
			next: '下一页'
		},
		lastUpdatedText: '最后更新',
		returnToTopLabel: '回到顶部',
		sidebarMenuLabel: '菜单',
		darkModeSwitchLabel: '主题',
		darkModeSwitchTitle: '切换到深色模式',
		lightModeSwitchTitle: '切换到浅色模式'
	}
})
