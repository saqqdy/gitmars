<template>
    <div class="map-command-wrap">
        <span>{{ cmd }}</span>
        <v3-button type="primary" size="small" plain @click.stop="exec">
            执行
        </v3-button>
    </div>
</template>

<script lang="ts"></script>
<script lang="ts" setup>
import { PropType, Ref, computed, ref, toRaw, watch } from 'vue'

import type { CommandSetsType } from '@/types/command'
export default {
    name: 'MapCommand',
    inheritAttrs: false
}

// props
const props = defineProps({
    data: {
        type: Object as PropType<CommandSetsType>,
        default: () => ({ options: [], args: [] }),
        required: false
    },
    value: {
        type: Object as PropType<CommandSetsType>,
        default: () => ({ options: [], args: [] }),
        required: true
    },
    execName: {
        type: String,
        default: 'gitm',
        required: false
    },
    current: {
        type: String,
        default: '',
        required: true
    }
})

// emits
const emitExec = defineEmits(['exec'])

const cmd: Ref<string> = ref('')
const { command /*, short: commandShort */ } = toRaw(props.value)
// 计算属性
const curBranch = computed(() => {
    const arr = toRaw(props.current).split('/')
    if (['bugfix', 'feature', 'support'].includes(arr[0])) {
        return {
            type: arr[0],
            name: arr[1]
        }
    }
    return null
})
// commands对象转换成shell指令
const mapComamnds = ({ options, args }: CommandSetsType): string => {
    const argument = [] // 参数
    const optional = [] // 可选的传参
    const notOptional = [] // 不可选的传参
    for (const option of options) {
        if (option.value !== null) {
            // 有赋值
            let k = option.short || option.long,
                value =
                    option.value instanceof Array
                        ? option.value.join(' ')
                        : option.value
            // 可选的，带参数或者没有短指令的
            if (option.optional || !option.short) {
                value = value || option.defaultValue
                if (!value) continue
                if (option.optional) {
                    // 可选值
                    value = ' "' + value + '"'
                    optional.push(k + value)
                } else optional.push(k)
            } else if (option.short) {
                if (notOptional.length > 0) k = k.substr(1)
                if (value) notOptional.push(k)
            }
        }
    }
    for (const arg of args) {
        arg.value && argument.push(arg.value)
    }
    return `${props.execName} ${command} ${argument.join(
        ' '
    )} ${notOptional.join('')} ${optional.join(' ')}`.replace(/[\s]{2,}/g, ' ')
}
// 执行指令
const exec = () => {
    emitExec('exec', cmd.value)
}
watch(
    () => props.value,
    val => {
        cmd.value = mapComamnds(val)
    },
    {
        deep: true,
        immediate: true
    }
)
defineExpose({
    curBranch,
    cmd,
    exec
})
</script>

<style lang="less">
.map-command-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 10px;
}
</style>
