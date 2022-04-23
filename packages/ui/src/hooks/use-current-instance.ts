import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance, useCssModule } from 'vue'

export default function useCurrentInstance(props?: string | string[]) {
    if (typeof props === 'string') props = [props]
    const { appContext, proxy } =
        getCurrentInstance() as ComponentInternalInstance
    const globalProperties = appContext.config.globalProperties
    let style = {}
    props && props.includes('style') && (style = useCssModule() as any)
    return {
        globalProperties,
        proxy,
        style
    }
}
