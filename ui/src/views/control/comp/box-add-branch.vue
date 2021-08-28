<template>
	<div class="box">
		<el-input v-model:value="data.type" placeholder="分支类型"></el-input>
		/
		<el-input v-model:value="data.name" placeholder="分支名称"></el-input>
	</div>
</template>

<script>
import { reactive, unref } from 'vue'
import { ElInput } from 'element-plus'

export default {
	components: {
		ElInput
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
