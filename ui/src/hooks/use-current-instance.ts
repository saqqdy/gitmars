import { getCurrentInstance, useCssModule, ComponentInternalInstance } from 'vue'

// export type UseCurrentInstanceType = {
// 	globalProperties: any,
// 	proxy,
// 	style,
// }

export default function useCurrentInstance(props?: string | string[]) {
	props = [].concat(props)
	const { appContext, proxy } = getCurrentInstance() as ComponentInternalInstance
	const globalProperties = appContext.config.globalProperties
	let style = {}
	props.includes('style') && (style = useCssModule())
	return {
		globalProperties,
		proxy,
		style
	}
}
