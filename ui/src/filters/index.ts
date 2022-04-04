import dayjs from 'dayjs'

export default app => {
    app.config.globalProperties.$filter = {
        // 日期
        date(val, format) {
            if (!val) return ''
            return dayjs(val).format(format)
        },
        // 设置小数位
        point(val, num) {
            if (val) return parseFloat(val).toFixed(num)
            else return val
        }
    }
}
