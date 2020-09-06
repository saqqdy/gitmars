module.exports = {
	presets: ['@vue/cli-plugin-babel/preset'],
	plugins: [
		'@vue/babel-plugin-jsx',
		[
			'import',
			{
				libraryName: 'tool',
				style: false,
				libraryDirectory: 'lib',
				camel2DashComponentName: false
			},
			'tool'
		],
		// ['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: 'css' }] // `style: true` 会加载 less 文件
	]
}
