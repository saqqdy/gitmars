<template>
	<span :class="'v3-checkbox ' + size" @click.stop="changeStatus">
		<span class="iconfont" :class="{ 'icon-border': !status, 'icon-check-square': status, disabled: disabled }"><span>
		<span><slot></slot></span>
	</span>
</template>

<script>
/**
 * v3-checkbox
 * @module package/checkbox
 * @desc 复选框
 * @param {string} [value=default] - 值 true false
 * @param {boolean} [disabled=false] - 禁用
 * @param {string} [size=normal] - 尺寸，接受 normal, small, large
 *
 * @example
 * <v3-checkbox size="large" v-modal:value="value">复选框</v3-checkbox>
 */
import { h, ref, unref, watch } from 'vue'
export default {
	name: 'v3Checkbox',
	inheritAttrs: false,
	props: {
		value: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'normal',
			validator(value) {
				return ['mini', 'small', 'normal', 'large'].indexOf(value) > -1
			}
		}
	},
	setup(props, { slots, emit }) {
		const status = ref(null)
		status.value = Boolean(props.value)
		watch(
			() => status.value,
			val => {
				emit('update:value', unref(val))
			}
		)
		const changeStatus = () => {
			if (!props.disabled) status.value = !status.value
		}
		return {
			status,
			changeStatus
		}
	}
}
</script>

<style lang="less">
.v3-checkbox {
	appearance: none;
	font-size: 16px;
	text-align: center;
	display: inline-block;
	cursor: pointer;
	i + span {
		margin-left: 8px;
	}
	.disabled {
		color: @gray;
	}
	&.mini {
		font-size: 12px;
	}
	&.small {
		font-size: 14px;
	}
	&.nomral {
		font-size: 16px;
	}
	&.large {
		font-size: 18px;
	}
}
</style>
