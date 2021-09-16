<template>
	<div class="command-wrap">
		<ul>
			<li v-for="arg in data.args" :key="arg.name">
				{{ arg.name }}
				<el-input v-model="arg.value" :key="arg.name + '-arg'" :placeholder="arg.required ? '必填' : '选填'"></el-input>
			</li>
		</ul>
		<ul>
			<li v-for="option in data.options" :key="option.long">
				{{ option.description }}
				<el-input v-if="option.optional" v-model="option.value" :key="option.long + '-option'" :placeholder="option.required ? '必填' : '选填'"></el-input>
				<v3-checkbox v-else v-model="option.value" :key="option.long + '-option-check'"></v3-checkbox>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Command',
	inheritAttrs: false,
}
</script>
<script lang="ts" setup>
import { PropType, reactive, unref, watch, inject, ref, toRaw, computed } from 'vue'

import type { CommandSetsType } from '@/types/command'

const props = defineProps({
		value: {
			type: Object as PropType<CommandSetsType>,
			default: () => ({ options: [], args: [] }),
			required: true
			// 	validator(value) {
			// 		return ['default', 'danger', 'primary'].indexOf(value) > -1
			// 	}
		},
		current: String

})
// 数据
const data = reactive(toRaw(props.value))
data.options.forEach(option => {
	if (!('value' in option)) option.value = null
})
data.args.forEach(arg => {
	if (!('value' in arg)) arg.value = null
})

// 计算属性
// const curBranch = computed(() => {
// 	let arr = unref(props.current).split('/')
// 	if (['bugfix', 'feature', 'support'].includes(arr[0])) {
// 		return {
// 			type: arr[0],
// 			name: arr[1]
// 		}
// 	}
// 	return null
// })

// 更新value
const updateValue = defineEmits(['update:value'])

watch(
	data,
	val => {
		updateValue('update:value',val)
	},
	{
		deep: true
	}
)
defineExpose( {
	data,
	// curBranch,
})
</script>

<style lang="less">
.command-wrap {
	appearance: none;
	box-sizing: border-box;
	padding: 8px 8px 0;
	font-size: 14px;
	line-height: 1.6;
	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>
