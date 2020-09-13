// const createI18n = config => ({
// 	locale: ref(config.locale),
// 	messages: config.messages,
// 	$t(key) {
// 		return this.messages[this.locale.value][key]
// 	}
// })

// const i18nSymbol = Symbol()

// export function box(config) {
// console.log(this)
// const i18n = createI18n(config)
// provide(i18nSymbol, i18n)
// }

// export function useI18n() {
// 	const i18n = inject(i18nSymbol)
// 	if (!i18n) throw new Error('No i18n provided!!!')

// 	return i18n
// }

import axios from './axios'
import Box from './box'
import { nextIndex, delay } from '@/lib/tool'

export default function (app) {
	app.config.globalProperties.$nextIndex = nextIndex.bind(app)
	app.config.globalProperties.$axios = axios
	app.config.globalProperties.$delay = new delay()
	app.config.globalProperties.$box = (...args) => new Box(app, ...args)
}
