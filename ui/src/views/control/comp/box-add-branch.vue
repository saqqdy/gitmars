<template>
	<div class="box row justify-center align-center">
		<el-select
			class="col-6"
			v-model="data.type"
			placeholder="请选择分支类型"
			clearable
		>
			<el-option label="feature" value="feature"></el-option>
			<el-option label="bugfix" value="bugfix"></el-option>
			<el-option label="support" value="support"></el-option>
		</el-select>
		&nbsp;&nbsp;/&nbsp;&nbsp;
		<el-input
			class="col-18"
			ref="name"
			v-model="data.name"
			placeholder="分支名称"
		></el-input>
	</div>
</template>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>

<script lang="ts" setup>
import { reactive, toRaw, Ref, ref, onMounted, watchEffect } from 'vue'
import { ElInput, ElSelect, ElMessage } from 'element-plus'
import useCurrentInstance from '@/hooks/use-current-instance'

interface DataType {
	type: string
	name: string
}

const name = ref()
const data: DataType = reactive({
	type: 'feature',
	name: ''
})

		const {
			globalProperties: { $axios, $box }
		} = useCurrentInstance()
const submit = (): Promise<DataType> => {
	return new Promise((resolve, reject) => {
		if (!data.type || !data.name) {
			ElMessage({
				message: '请填写分支类型和名称',
				type: 'warning'
			})
			reject()
			return
		}
		resolve(toRaw(data))
	})
}

onMounted(() => {
	name.value.focus()
})

defineExpose({
	data,
	submit
})
</script>

<style lang="less">
.box {
	padding: 50px 0;
	.el-input {
		width: 180px;
	}
}
</style>
