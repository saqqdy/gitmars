import VueHighlightJS from 'vue-highlight.js'

// 这里样式我选择的是atom-one-light；样式更多选择可以参见 https://highlightjs.org/static/demo/ 里的styles
// 注意： 代码块的背景色 还是由官方设置的 $codeBgColor 决定的
import 'highlight.js/styles/atom-one-light.css'

// 你可以在这里引入自己定义的css样式，进行修改
// import '../.vuepress/public/css/index.css'

// 使用异步函数也是可以的
export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData, // 站点元数据
    isServer // 当前应用配置是处于 服务端渲染 或 客户端
}) => {
    // ...做一些其他的应用级别的优化
    Vue.use(VueHighlightJS)
}
