import { createApp } from 'vue'
import { ElProgress, ElSkeleton, ElRow, ElCol, ElButton, ElCarousel, ElCarouselItem, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElTooltip, ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/index.css'
// @ts-ignore
import plugins from '@/plugins'
// @ts-ignore
import filters from '@/filters'
// @ts-ignore
import components from '@/components'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 5000 }

app.use(ElProgress)
app.use(ElSkeleton)
app.use(ElRow)
app.use(ElCol)
app.use(ElButton)
app.use(ElCarousel)
// app.use(ElCarouselItem);
app.use(ElForm)
// app.use(ElFormItem);
app.use(ElInput)
app.use(ElSelect)
// app.use(ElOption);
app.use(ElTooltip)
app.use(ElMessage)
app.use(ElMessageBox)
app.use(store).use(router).use(components).use(plugins).use(filters).mount('#app')
// app.mount('#app');
