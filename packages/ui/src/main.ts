import { createApp } from 'vue'
import {
	ElButton,
	ElCarousel,
	ElCheckbox,
	ElCol,
	ElCollapse,
	ElForm,
	ElInput,
	ElMessage,
	ElMessageBox,
	ElOption,
	ElProgress,
	ElRow,
	ElSelect,
	ElSkeleton,
	ElTooltip
} from 'element-plus'
// import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from '@/plugins'
import filters from '@/filters'
import components from '@/components'

const app = createApp(App)
app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 5000 }

app.use(ElCollapse)
app.use(ElProgress)
app.use(ElSkeleton)
app.use(ElCheckbox)
app.use(ElRow)
app.use(ElCol)
app.use(ElButton)
app.use(ElCarousel)
app.use(ElForm)
app.use(ElInput)
app.use(ElSelect)
app.use(ElOption)
app.use(ElTooltip)
app.use(ElMessage)
app.use(ElMessageBox)
app.use(store).use(router).use(components).use(plugins).use(filters).mount('#app')
// app.mount('#app');
