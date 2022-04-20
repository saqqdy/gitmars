<script>
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import { delay as Delay, addEvent, fixNumber, removeEvent } from 'js-cool'
import style from './style.module.less'

export default {
    name: 'V3Split',
    props: {
        mode: {
            type: String,
            default: 'horizontal',
            validator: v => ['horizontal', 'vertical'].includes(v)
        },
        // 像素或者百分比
        modelValue: {
            type: [Number, String],
            default: '50%',
            validator: v => /^([0-9]+)(%|px)?$/.test(v)
        },
        // 最小像素或百分比
        min: {
            type: [Number, String],
            default: 0
        },
        // 最大像素或百分比
        max: {
            type: [Number, String],
            default: '100%'
        }
    },
    setup(props, { slots, emit }) {
        const delay = new Delay()
        const data = reactive({
            size: 50,
            suffix: '%',
            pos: {},
            boxSize: 0,
            moving: false
        })
        const v3Split = ref(null)
        // computed
        const px = computed(() => Math.round((data.size / 100) * data.boxSize))
        const panelStype = computed(() => {
            let size = 0 + data.size
            if (props.mode === 'horizontal') {
                if (!slots.right) {
                    size = 100
                } else if (!slots.left) {
                    size = 0
                }
            } else {
                if (!slots.bottom) {
                    size = 100
                } else if (!this.$slots.top) {
                    size = 0
                }
            }
            return {
                [props.mode === 'horizontal' ? 'width' : 'height']: size + '%'
            }
        })
        // watch
        watch(
            () => props.modelValue,
            val => {
                if (val) {
                    if (data.suffix === '%') {
                        // 输入%
                        data.size = fixNumber(parseFloat(val), 2)
                    } else if (data.boxSize > 0) {
                        // 输入px
                        data.size = fixNumber(
                            (parseFloat(val) * 100) / data.boxSize,
                            2
                        )
                    }
                }
            }
        )
        watch(
            () => data.size,
            val => {
                const v = (data.suffix !== '%' ? px : val) + data.suffix
                if (v !== props.modelValue && px.value !== 0) emit('input', v)
            }
        )
        // methods
        /**
         * @private getTransform
         * @description 获取偏移量
         * @param {Object} el 元素对象
         */
        const getTransform = el => {
            const transformMatrix =
                el.style.WebkitTransform ||
                getComputedStyle(el, '').getPropertyValue(
                    '-webkit-transform'
                ) ||
                el.style.transform ||
                getComputedStyle(el, '').getPropertyValue('transform')
            const matrix = transformMatrix.match(/\-?[0-9]+\.?[0-9]*/g)
            let x, y
            if (matrix) {
                x = parseInt(matrix[12] || matrix[4] || 0) // translate x
                y = parseInt(matrix[13] || matrix[5] || 0) // translate y
                return { x, y }
            }
            return { x: 0, y: 0 }
        }
        /**
         * @private calculateSize
         * @description 计算出不超范围的size
         * @param {Number} size
         */
        const calculateSize = size => {
            if (String(props.min).indexOf('%') > 1) {
                size = Math.max(size, parseInt(props.min))
            } else if (data.boxSize > 0) {
                size = Math.max(
                    size,
                    fixNumber((parseInt(props.min) * 100) / data.boxSize, 2)
                )
            }
            if (String(props.max).indexOf('%') > 1) {
                size = Math.min(size, parseInt(props.max))
            } else if (data.boxSize > 0) {
                size = Math.min(
                    size,
                    fixNumber((parseInt(props.max) * 100) / data.boxSize, 2)
                )
            }
            return size
        }
        /**
         * @private getPosition
         * @description 获取鼠标位置
         * @param {Object} el 元素对象
         */
        const getPosition = el => {
            let x = 0,
                y = 0,
                left = 0,
                top = 0
            while (el.offsetParent) {
                const t = getTransform(el) // 备用方案：el.getBoundingClientRect();
                x += el.offsetLeft + t.x
                y += el.offsetTop + t.y
                el = el.offsetParent
            }
            // 处理当元素处于滚动之后的情况
            while (el.parentNode) {
                left += el.scrollLeft
                top += el.scrollTop
                el = el.parentNode
            }
            return { x, y, left, top }
        }
        /**
         * @private mousedown
         * @description 鼠标点击缩放条事件
         * @param {Object} e event
         */
        const mousedown = e => {
            let el = e.target
            data.boxSize = parseInt(
                props.mode === 'horizontal'
                    ? v3Split.value.clientWidth
                    : v3Split.value.clientHeight
            )
            while (el.parentNode) {
                if (el.parentNode.className.includes(style.v3SplitBox)) {
                    data.pos = getPosition(el.parentNode)
                    break
                }
                el = el.parentNode
            }
            e.preventDefault()
            e.stopPropagation()
            emit('move-start')
            addEvent(document, 'mousemove', handleMouseMove)
            addEvent(document, 'mouseup', handleMouseUp)
        }
        /**
         * @private handleMouseMove
         * @description 鼠标移动事件
         * @param {Object} e event
         */
        function handleMouseMove(e) {
            data.moving = true
            emit('moving', e)
            delay.register(
                'v3SplitOnmouseMove',
                () => {
                    let size
                    // min = parseInt(props.min),
                    // max
                    if (props.mode === 'horizontal') {
                        size = e.pageX + data.pos.left - data.pos.x
                    } else {
                        size = e.pageY + data.pos.top - data.pos.y
                    }
                    // max = parseInt(props.max || data.boxSize)
                    data.size = calculateSize(
                        fixNumber((size * 100) / data.boxSize, 2)
                    )
                },
                50,
                true
            )
            e.preventDefault()
        }
        /**
         * @private handleMouseUp
         * @description 鼠标弹起事件
         * @param {Object} e event
         */
        function handleMouseUp() {
            data.moving = false
            emit('move-end')
            removeEvent(document, 'mousemove', handleMouseMove)
            removeEvent(document, 'mouseup', handleMouseUp)
        }
        // init
        String(props.modelValue).replace(/^([0-9]+)(%|px)?$/, (a, b, c) => {
            if (c === '%') {
                data.size = calculateSize(parseInt(b))
            }
            data.suffix = c || ''
        })
        // event
        onMounted(() => {
            data.boxSize = parseInt(
                props.mode === 'horizontal'
                    ? v3Split.value.clientWidth
                    : v3Split.value.clientHeight
            )
            if (data.suffix !== '%') {
                // 输入px或空单位
                data.size = calculateSize(
                    fixNumber(
                        (parseInt(props.modelValue) * 100) / data.boxSize,
                        2
                    )
                )
            }
        })

        return () =>
            h(
                'div',
                {
                    class: [
                        style.v3SplitBox,
                        style[props.mode],
                        data.moving ? ' moving' : ''
                    ],
                    ref: v3Split
                },
                slots.default
                    ? slots.default()
                    : [
                          h(
                              'div',
                              {
                                  class: [
                                      style.v3SplitPanel,
                                      style.v3SplitPanel1
                                  ],
                                  style: panelStype.value
                              },
                              props.mode === 'horizontal'
                                  ? slots.left()
                                  : slots.top()
                          ),
                          ((props.mode === 'horizontal' &&
                              slots.left &&
                              slots.right) ||
                              (props.mode === 'vertical' &&
                                  slots.top &&
                                  slots.bottom)) &&
                              h(
                                  'div',
                                  {
                                      class: style.v3SplitBar,
                                      onMousedown: mousedown
                                  },
                                  [h('span'), h('span'), h('span'), h('span')]
                              ),
                          h(
                              'div',
                              {
                                  class: [
                                      style.v3SplitPanel,
                                      style.v3SplitPanel2
                                  ]
                              },
                              props.mode === 'horizontal'
                                  ? slots.right()
                                  : slots.bottom()
                          )
                      ]
            )
    }
}
</script>
