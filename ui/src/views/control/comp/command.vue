<template>
	<div class="command-wrap">
		<ul>
			<li v-for="arg in status.args" :key="arg.name">
				{{ arg.name }}
				<el-input v-model:value="arg.value" :key="arg.name + '-arg'" :placeholder="arg.required ? '必填' : '选填'"></el-input>
			</li>
		</ul>
		<ul>
			<li v-for="option in status.options" :key="option.long">
				{{ option.description }}
				<el-input v-if="option.optional" v-model:value="option.value" :key="option.long + '-option'" :placeholder="option.required ? '必填' : '选填'"></el-input>
				<v3-checkbox v-else v-model:value="option.value" :key="option.long + '-option'"></v3-checkbox>
			</li>
		</ul>
	</div>
</template>

<script>
import { reactive, unref, watch, inject, ref, computed } from 'vue'
import { ElInput } from 'element-plus'

export default {
	name: 'Command',
	components: {
		ElInput
	},
	inheritAttrs: false,
	props: {
		value: {
			type: Object,
			default: () => ({ options: [], args: [] }),
			required: true
			// 	validator(value) {
			// 		return ['default', 'danger', 'primary'].indexOf(value) > -1
			// 	}
		},
		current: String
	},
	setup(props, { emit }) {
		const status = reactive(unref(props.value))
		status.options.forEach(option => {
			if (!option.hasOwnProperty('value')) option.value = null
		})
		status.args.forEach(arg => {
			if (!arg.hasOwnProperty('value')) arg.value = null
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
		watch(
			status,
			val => {
				emit('update:value', val)
			},
			{
				deep: true
			}
		)
		return {
			status
			// curBranch,
		}
	}
}
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
