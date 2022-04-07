import dayjs, { type ConfigType } from 'dayjs'
import { type App } from 'vue'

export default (app: App) => {
    app.config.globalProperties.$filter = {
        // 日期
        date(val: ConfigType, format?: string) {
            if (!val) return ''
            return dayjs(val).format(format)
        },
        // 设置小数位
        point(val: string, num: number): string {
            if (val) return parseFloat(val).toFixed(num)
            else return val
        }
    }
}
