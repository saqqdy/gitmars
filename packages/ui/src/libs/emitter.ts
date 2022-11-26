// @ts-nocheck
function broadcastFun(componentName, eventName, params) {
    this.$children.forEach(child => {
        const name = child.$options.componentName
        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params))
        } else {
            broadcastFun.apply(child, [componentName, eventName].concat([params]))
        }
    })
}

export default function emitter(ctx) {
    // 冒泡
    const dispatch = (componentName, eventName, params) => {
        let parent = ctx.$parent || ctx.$root,
            name = parent.$options.componentName

        while (parent && (!name || name !== componentName)) {
            parent = parent.$parent

            if (parent) {
                name = parent.$options.componentName
            }
        }
        if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params))
        }
    }
    // 捕获
    const broadcast = (componentName, eventName, params) => {
        broadcastFun.call(ctx, componentName, eventName, params)
    }
    return {
        dispatch,
        broadcast
    }
}
