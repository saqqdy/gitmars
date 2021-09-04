<template>
	<div class="box">
		<el-input v-model="data.type" placeholder="分支类型"></el-input>/
		<el-input v-model="data.name" placeholder="分支名称"></el-input>
	</div>
</template>

<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { reactive, toRaw } from 'vue'
import { ElInput } from 'element-plus'

interface DataType {
	type: string
	name: string
}

const data: DataType = reactive({
	type: '',
	name: ''
})
const submit = (): Promise<DataType> => {
	return new Promise((resolve, reject) => {
		if (!data.type || !data.name) {
			reject()
			return
		}
		resolve(toRaw(data))
	})
}
defineExpose({
	data,
	submit
})
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
