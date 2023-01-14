<template>
	<div class="command-wrap">
		<ul>
			<li v-for="arg in data.args" :key="arg.name">
				{{ arg.name }}
				<div class="r">
					<template v-if="arg.options">
						<el-select
							v-model="arg.value"
							:key="arg.name + '-arg'"
							:placeholder="arg.required ? '必填' : '选填'"
							clearable
						>
							<el-option
								v-for="item in arg.options"
								:key="item"
								:label="item"
								:value="item"
							></el-option>
						</el-select>
					</template>
					<template v-else>
						<el-input
							v-model="arg.value"
							:key="arg.name + '-arg'"
							:placeholder="arg.required ? '必填' : '选填'"
							clearable
						/>
					</template>
				</div>
			</li>
		</ul>
		<ul>
			<li v-for="option in data.options" :key="option.long">
				{{ option.description }}
				<div class="r">
					<template v-if="option.optional">
						<template v-if="option.options">
							<el-select
								:key="option.long + '-arg'"
								v-model="option.value"
								:placeholder="option.required ? '必填' : '选填'"
								clearable
							>
								<el-option
									v-for="item in option.options"
									:key="item"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
						</template>
						<template v-else>
							<el-input
								:key="option.long + '-option'"
								v-model="option.value"
								:placeholder="option.required ? '必填' : '选填'"
								clearable
							/>
						</template>
					</template>
					<el-checkbox
						v-else
						v-model="option.value"
						:key="option.long + '-option-check'"
					></el-checkbox>
				</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Command',
	inheritAttrs: false
}
</script>
<script lang="ts" setup>
import type { PropType } from 'vue'
import { reactive, toRaw, watch } from 'vue'

import type { CommandSetsType } from '@/types/command'

const props = defineProps({
	modelValue: {
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
const data = reactive(toRaw(props.modelValue))

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
const updateValue = defineEmits(['update:modelValue'])

watch(
	data,
	val => {
		updateValue('update:modelValue', val)
	},
	{
		deep: true
	}
)
defineExpose({
	data
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
		.r {
			.el-input,
			.el-select {
				width: 200px;
			}
		}
	}
}
</style>
