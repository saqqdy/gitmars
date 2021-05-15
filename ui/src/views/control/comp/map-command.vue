<template>
	<div class="map-command-wrap">
		<span>{{ cmd }}</span>
		<v3-button type="primary" size="small" @click.stop="exec" plain>执行</v3-button>
	</div>
</template>

<script>
import { ref, watch, unref, computed } from 'vue'

export default {
	name: 'MapCommand',
	inheritAttrs: false,
	props: {
		data: {
			type: Object,
			default: () => ({ options: [], args: [] }),
			required: false
		},
		value: {
			type: Object,
			default: () => ({ options: [], args: [] }),
			required: true
		},
		current: String
	},
	setup(props, { slots, emit }) {
		const cmd = ref('')
		const { command, short: commandShort } = unref(props.value)
		// 计算属性
		const curBranch = computed(() => {
			let arr = unref(props.current).split('/')
			if (['bugfix', 'feature', 'support'].includes(arr[0])) {
				return {
					type: arr[0],
					name: arr[1]
				}
			}
			return null
		})
		// commands对象转换成shell指令
		const mapComamnds = ({ options, args }) => {
			let argument = [], // 参数
				optional = [], // 可选的传参
				notOptional = [] // 不可选的传参
			for (let option of options) {
				if (option.value !== null) {
					// 有赋值
					let k = option.short || option.long,
						value = option.value instanceof Array ? option.value.join(' ') : option.value
					// 可选的，带参数或者没有短指令的
					if (option.optional || !option.short) {
						if (!value) continue
						if (option.optional) {
							// 可选值
							value = ' "' + value + '"'
							if (option.defaultValue) value = ' "' + option.defaultValue + '"'
							optional.push(k + value)
						} else optional.push(k)
					} else if (option.short) {
						if (notOptional.length > 0) k = k.substr(1)
						if (value) notOptional.push(k)
					}
				}
			}
			for (let arg of args) {
				arg.value && argument.push(arg.value)
			}
			return `gitm ${command} ${argument.join(' ')} ${notOptional.join('')} ${optional.join(' ')}`.replace(/[\s]{2,}/g, ' ')
		}
		// 执行指令
		const exec = () => {
			emit('exec', unref(cmd))
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
		return {
			curBranch,
			cmd,
			exec
		}
	}
}
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
