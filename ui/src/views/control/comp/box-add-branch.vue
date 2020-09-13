<template>
	<div class="box">
		<a-input v-model:value="data.type" placeholder="分支类型"></a-input>
		/
		<a-input v-model:value="data.name" placeholder="分支名称"></a-input>
	</div>
</template>

<script>
import { reactive, unref } from 'vue'
import AInput from 'ant-design-vue/lib/input'

export default {
	components: {
		AInput
	},
	inheritAttrs: false,
	props: {},
	setup(props, { emit }) {
		const data = reactive({
			type: '',
			name: ''
		})
		const submit = () => {
			return new Promise((resolve, reject) => {
				if (!data.type || !data.name) {
					reject()
					return
				}
				resolve(unref(data))
			})
		}
		return {
			data,
			submit
		}
	}
}
</script>

<style lang="less">
.box {
	input {
		box-sizing: border-box;
		border: 1px solid #ddd;
		width: 40%;
		padding: 16px;
		height: 44px;
		line-height: 20px;
	}
}
</style>
