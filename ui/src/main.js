import { createApp, createBlock, defineComponent } from 'vue'
import App from './App.vue'
// import Antd from 'ant-design-vue'
import router from './router'
import store from './store'
import components from '@/components'
import plugins from '@/plugins'
// import 'ant-design-vue/dist/antd.css'
const isDev = process.env.NODE_ENV === 'development'
import * as vvv from 'vue'
console.log(App, vvv, process.env.NODE_ENV)
console.log(components)

const app = createApp(App)
// app.config.isCustomElement = tag => tag.startsWith('ion-') || tag.startsWith('v3-')
// 开启debug模式
app.config.debug = isDev
app.config.devtools = isDev

// app.use(Antd)
app.use(components)
app.use(plugins)

app.use(router).use(store).mount('#app', {
	aaaaaa: 1111
})
console.log(app)
// box.mount('#box')
