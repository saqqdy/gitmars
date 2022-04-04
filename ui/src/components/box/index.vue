<template>
    <transition name="fade">
        <div
            ref="v3Box"
            class="v3-box"
            :class="{
                'one-btn': btns === 1,
                'two-btn': btns === 2,
                'no-btn': btns === 0
            }"
            :style="{
                width: data.mWidth || width,
                maxWidth: !data.max ? data.maxW : ''
            }"
        >
            <div v-if="showHeader" class="v3-box-header" v-html="title" />
            <!-- <template v-if="!$slots.title">{{ title }}</template>
				<slot name="title" v-if="$slots.title"></slot> -->

            <div
                ref="boxContent"
                v-if="message && !component"
                class="v3-box-content message"
                v-html="message"
                :style="{
                    height: data.mHeight || height,
                    maxHeight: !data.max ? data.maxH : '',
                    minHeight: data.mHeight
                }"
            />
            <div
                ref="boxContent"
                class="v3-box-content"
                :class="{ 'no-header': !showHeader }"
                v-if="component && !message"
                :style="{
                    height: data.mHeight || height,
                    maxHeight: !data.max ? data.maxH : '',
                    minHeight: data.mHeight
                }"
            >
                <!-- <slot></slot> -->
            </div>

            <div v-if="showBtn" class="v3-box-footer">
                <template v-if="!$slots.footer">
                    <el-button
                        ref="mainBtn"
                        type="primary"
                        class="btn-main"
                        autofocus
                        v-if="showOkBtn"
                        @click="handleOk"
                    >
                        {{ okBtnName }}
                    </el-button>
                    <el-button v-if="showCancelBtn" @click="handleCancel">
                        {{ cancelBtnName }}
                    </el-button>
                </template>
                <slot v-if="$slots.footer" name="footer" />
            </div>

            <div class="v3-box-ico">
                <div class="v3-box-filter" />
                <!-- <slot name="filter"></slot> -->
                <span
                    class="v3-box-max iconfont icon-tuichuquanping"
                    title="恢复默认"
                    @click="handleMax"
                    v-if="showMax && data.max"
                ></span>
                <span
                    class="v3-box-max iconfont icon-quanping"
                    title="最大化"
                    @click="handleMax"
                    v-if="showMax && !data.max"
                ></span>
                <span
                    class="v3-box-close iconfont icon-close"
                    title="关闭"
                    v-if="showClose"
                    @click="handleClose"
                ></span>
            </div>
        </div>
    </transition>
</template>

<script>
import {
    computed,
    createVNode,
    nextTick,
    reactive,
    ref,
    render,
    unref,
    watchEffect
} from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { delay as Delay, addEvent, fixNumber, removeEvent } from 'js-cool'
import { ElButton } from 'element-plus'

export default {
    name: 'V3Box',
    components: { ElButton },
    props: {
        opacity: {
            type: Number,
            default: 0.4
        },
        title: {
            type: String,
            required: true,
            default: '提示'
        },
        width: {
            type: String,
            default: '640px'
        },
        maxWidth: {
            type: String
        },
        height: String,
        maxHeight: {
            type: String,
            default: '480px'
        },
        message: String,
        okBtnName: {
            type: String,
            default: '确定'
        },
        cancelBtnName: {
            type: String,
            default: '取消'
        },
        defaultMax: {
            type: Boolean,
            default: false
        },
        showOkBtn: {
            type: Boolean,
            default: true
        },
        showCancelBtn: {
            type: Boolean,
            default: true
        },
        showClose: {
            type: Boolean,
            default: true
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        showBtn: {
            type: Boolean,
            default: true
        },
        showMax: {
            type: Boolean,
            default: true
        },
        // 传入临时组件
        options: {
            type: Object,
            default: () => ({})
        },
        component: {
            type: Object,
            default: () => ({})
        },
        hide: Function,
        onOk: Function,
        onCancel: Function,
        onClose: Function
    },
    setup(props) {
        const delay = new Delay()
        const data = reactive({
            zIndex: 0,
            instance: null,
            isAppendContent: false,
            maxW: '640px',
            maxH: '360px',
            mWidth: null,
            mHeight: null,
            max: false
        })
        const v3Box = ref(null)
        const boxContent = ref(null)
        const mainBtn = ref(null)
        const btns = computed(() => {
            if (props.showMax) {
                if (props.showClose) return 2
                return 1
            } else {
                if (props.showClose) return 1
                return 0
            }
        })

        // 监听回车键
        const { enter } = useMagicKeys()
        watchEffect(() => {
            if (enter.value) handleOk() // 按下回车键确认
        })

        const init = () => {
            data.max = unref(props.defaultMax)
            data.maxH = unref(props.maxHeight)
            data.maxW = unref(props.maxWidth) || unref(props.width)
            calculate()

            // const vueConstructor = Vue.extend(Object.assign({ router: $router }, props.component))
            // let initOpt = {}
            // if (props.options) {
            // 	initOpt = {
            // 		propsData: props.options // 这里暂时没有更好的方案，先以propsData传值
            // 	}
            // }
            // data.instance = new vueConstructor(initOpt)
            // for (let i in props.options) {
            // 	data.instance[i] = props.options[i]
            // }
            // data.instance.$store = data.$store
            // data.instance.$parent = this
            // 监听模板组件事件
            // data.instance.$on('onOk', () => {
            // 	handleOk()
            // })
            // data.instance.$on('onCancel', () => {
            // 	handleCancel()
            // })
            // data.instance.$on('onClose', () => {
            // 	handleClose()
            // })
            nextTick(() => {
                data.instance = createVNode(props.component)
                data.instance.props = unref(props.options)
                render(data.instance, boxContent.value)
                data.isAppendContent = true

                // let titleNode = ctx.$el.querySelector('.v3-box-header'),
                // 	filterNode = ctx.$el.querySelector('.v3-box-filter'),
                // 	footerNode = ctx.$el.querySelector('.v3-box-footer'),
                // 	title,
                // 	filter,
                // 	footer
                addEvent(window, 'resize', reSize)
                if (props.showBtn && props.showOkBtn) {
                    mainBtn.value.focus()
                } else {
                    v3Box.value.focus()
                }
                // 挂载插槽
                // title = data.instance.el.querySelector('[slot="title"]')
                // filter = data.instance.el.querySelector('[slot="filter"]')
                // footer = data.instance.el.querySelector('[slot="footer"]')
                // title && mountToSlot(titleNode, title)
                // filter && filterNode.appendChild(filter)
                // footer && mountToSlot(footerNode, footer)
            })
        }
        // const mountToSlot = (parent, newNode) => {
        // 	let len = parent.childNodes.length
        // 	while (len--) {
        // 		parent.removeChild(parent.childNodes[len])
        // 	}
        // 	parent.appendChild(newNode)
        // }
        const reSize = () => {
            delay.register('windowReSize', calculate, 500)
        }
        const calculate = () => {
            const c =
                110 - (props.showBtn ? 0 : 60) - (props.showHeader ? 0 : 50) // herder=50和footer=60高度
            const p = props.showHeader ? 0 : 40
            const maxW = fixNumber(
                window.innerWidth > 320 ? window.innerWidth - 20 : 300
            )
            const maxH = fixNumber(
                window.innerHeight > 300 + c
                    ? window.innerHeight - c - 60 + p
                    : 240 + p
            )
            const maxHeight = parseInt(
                props.maxHeight || props.height || maxH || 480
            )
            const maxWidth = parseInt(
                props.maxWidth || props.width || maxW || 600
            )
            data.maxW = Math.min(maxWidth, maxW) + 'px'
            data.maxH = Math.min(maxHeight, maxH) + 'px'
            if (data.max) {
                data.mWidth = maxW + 'px'
                data.mHeight = maxH + 'px'
            }
        }
        const handleOk = () => {
            if (!props.onOk || typeof props.onOk !== 'function') {
                hide()
                return
            }
            // onOk 事件必须返回一个promise
            props.onOk(data.instance).then(() => {
                props.hide()
            })
        }
        const handleCancel = () => {
            hide()
            if (props.onCancel && typeof props.onCancel === 'function') {
                props.onCancel()
            }
        }
        const handleClose = () => {
            hide()
            if (props.onClose && typeof props.onClose === 'function') {
                props.onClose()
            }
        }
        /**
         * @function handleMax
         * @description 窗口对大化
         */
        const handleMax = () => {
            const c =
                110 - (props.showBtn ? 0 : 60) - (props.showHeader ? 0 : 50) // herder=50和footer=60高度
            const p = props.showHeader ? 0 : 40
            const w = fixNumber(
                window.innerWidth > 320 ? window.innerWidth - 20 : 300
            )
            const h = fixNumber(
                window.innerHeight > 300 + c
                    ? window.innerHeight - c - 60 + p
                    : 240 + p
            )
            if (!data.max) {
                data.max = true
                data.mWidth = w + 'px'
                data.mHeight = h + 'px'
            } else {
                data.max = false
                data.mWidth = null
                data.mHeight = null
            }
        }
        const hide = () => {
            removeEvent(window, 'resize', data.reSize)
            data.instance = null
            render(null, boxContent.value)
            props.hide()
        }
        init()
        return {
            v3Box,
            boxContent,
            mainBtn,
            data,
            btns,
            handleOk,
            handleCancel,
            handleClose,
            handleMax
        }
    }
}
</script>

<style lang="less" scoped="">
.v3-box {
    position: relative;
    border: 1px solid @border-color;
    background: #fff;
    &:hover {
        box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
    }
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: minmax(0, auto) auto minmax(0, auto);
    grid-template-areas: 'a' 'b' 'c';
    grid-auto-flow: row dense;
    justify-items: stretch;
    align-items: stretch;
    gap: 0;
    .v3-box-ico {
        padding: 10px;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        flex-wrap: 10px;
        span {
            width: 30px;
            height: 30px;
            line-height: 100%;
            text-align: center;
            margin-left: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #666;
            cursor: pointer;
            &:hover {
                color: #333;
            }
        }
        .v3-box-close {
            font-size: 20px;
        }
        .v3-box-max {
            font-size: 18px;
        }
        .v3-box-filter {
            margin-top: -1px;
            margin-right: 10px;
        }
    }
    .v3-box-header {
        grid-area: a;
        padding: 10px 20px;
        overflow: hidden;
        border-bottom: 1px solid @border-color;
        font-size: 16px;
        height: 50px;
        min-height: 50px;
        line-height: 30px;
        box-sizing: border-box;
    }
    .v3-box-content {
        grid-area: b;
        position: relative;
        z-index: 0;
        padding: 20px;
        overflow: auto;
        &.no-header {
            padding: 0;
        }
        &.message {
            text-align: center;
        }
    }
    .v3-box-footer {
        grid-area: c;
        padding: 10px;
        height: 60px;
        text-align: center;
        border-top: 1px solid @border-color;
        box-sizing: border-box;
        .btn {
            display: inline-block;
            margin: 0 10px;
            padding: 0 20px;
            width: 110px;
            line-height: 38px;
            height: 40px;
            border: 1px solid;
            cursor: pointer;
            border-radius: 4px;
            box-sizing: border-box;
            color: @font-color;
            background: #fff;
            border-color: @border-color;
        }
    }
    &.one-btn {
        .v3-box-header {
            padding: 10px 60px 10px 20px;
        }
    }
    &.two-btn {
        .v3-box-header {
            padding: 10px 100px 10px 20px;
        }
    }
    &.no-btn {
        .v3-box-header {
            padding: 10px 20px 10px 20px;
            text-align: center;
        }
    }
}
@keyframes zoomIns {
    from {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
    }

    50% {
        opacity: 1;
    }
}

.zoomIns {
    animation-name: zoomIns;
}
</style>
<style lang="less" scoped>
// .theme(@color) {
// 	// 当前组件里需要使用皮肤色的样式
// 	.v3-box-wrap {
// 		.v3-box-footer {
// 			::v-deep(.v3-button) {
// 				&:hover {
// 					border-color: rgba(@color, 0.6);
// 					background-color: rgba(@color, 0.1);
// 					color: @color;
// 				}
// 				&.btn-main {
// 					background-color: @color;
// 					border-color: @color;
// 					color: #fff;
// 					&:hover {
// 						border-color: rgba(@color, 0.8);
// 						background-color: rgba(@color, 0.8);
// 					}
// 				}
// 			}
// 		}
// 	}
// }
// // 通过less的loop循环，根据变量themeList的颜色列表生成
// .loop(@i) when (@i < length(@themeList)+1) {
// 	.theme-@{i} {
// 		.theme(extract(@themeList, @i));
// 	}
// 	.loop(@i+1);
// }
// .loop(1);
</style>
