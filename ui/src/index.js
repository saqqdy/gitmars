// 组件引入
import components from './components'

// 指令引入
import directives from './directive'

// 过滤器引入
import filters from './filters'

// 公共方法引入
import plugins from './plugins'

import './css/theme.less'

const install = Vue => {
	components(Vue)
	directives(Vue)
	filters(Vue)
	plugins(Vue)
}
// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}
export default {
	install
}
