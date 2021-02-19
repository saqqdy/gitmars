module.exports = {
    '/workflow/': [
        // '',
        // 'cell',
        // '/cell',
        {
            title: '组件',
            path: '/workflow/',
            collapsable: false,
            sidebarDepth: 2
            // children: [
            // 	'/workflow/',
            // 	{
            // 		title: '组件 1',
            // 		path: '/workflow/cell/',
            // 		collapsable: false,
            // 		sidebarDepth: 3,
            // 	},
            // ],
        },
        {
            title: 'cell',
            // path: '/workflow/cell/',
            collapsable: false,
            sidebarDepth: 2
            // children: ['/workflow/cell/', '/workflow/box/']
        }
    ],
    '/guide/': [
        {
            title: '指南',
            // path: '/workflow/',
            collapsable: false,
            // sidebarDepth: 2,
            children: [
                {
                    title: '它是如何工作的',
                    path: 'howItWorks',
                    collapsable: false
                }
            ]
        }
    ],
    '/setting/': [
        {
            title: 'Group 1',
            path: '/workflow/',
            collapsable: false,
            sidebarDepth: 3,
            children: ['/']
        }
    ]
}
