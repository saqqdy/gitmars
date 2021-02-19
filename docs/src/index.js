import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import DocButton from './components/DocButton'

const components = [DocButton]

Vue.use(ElementUI)

const DocComponent = {
    // 必须得有install方法
    install(Vue, options) {
        Object.values(components).forEach(component => {
            Vue.component(component.name, component)
        })
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(DocComponent)
}

export default DocComponent
