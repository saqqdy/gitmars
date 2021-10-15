<template>
	<div class="project-list">
		<div class="content">
			<h2>项目列表</h2>
			<ul>
				<li v-for="item in data.list" :key="item.id" class="flex" @click="goProject(item)">
					<span class="iconfont icon-star-fill" title="收藏"></span>
					<div class="ttl">
						<span>
							{{ item.name }}
							<span class="tg"></span>
						</span>
						<p>{{ item.path }}</p>
					</div>
					<span class="iconfont icon-link" @click.stop="open(item)" title="进入项目首页"></span>
					<span class="iconfont icon-close-circle" @click.stop="del(item)" title="删除"></span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'ProjectList'
}
</script>

<script lang="ts" setup>
import { getCurrentInstance, reactive, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useCurrentInstance from '@/hooks/use-current-instance'

import type { ProjectType } from '@/types/project'

interface DataType {
	list: ProjectType[]
}

const {
	globalProperties: { $axios }
} = useCurrentInstance()
const router = useRouter()
const route = useRoute()
const data: DataType = reactive({
	list: []
})
onBeforeMount(() => {
	getProjects()
})
// getProjects
const getProjects = () => {
	$axios({
		url: '/common/project/list',
		data: {}
	}).then(({ data: list }) => {
		data.list = [].concat(list)
	})
}
// open
const open = ({ name }: ProjectType) => {
	console.log(name)
}
const goProject = ({ id }: ProjectType) => {
	router.push(`/control?id=${id}`)
}
// del
const del = ({ id }: ProjectType) => {
	$axios({
		url: '/common/project/del',
		type: 'post',
		data: {
			id
		}
	}).then(() => {
		getProjects()
	})
}
defineExpose({
	data,
	open,
	goProject,
	del
})
</script>

<style lang="less" scoped>
.project-list {
	.content {
		padding: 30px;
		width: 800px;
		margin: 0 auto;
		h2 {
			color: #6a8bad;
			font-size: 16px;
			line-height: 50px;
		}
		.flex {
			display: flex;
			padding: 20px 10px;
			margin-bottom: 10px;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			&.active,
			&:hover,
			&:active {
				background: rgba(66, 185, 131, 0.05);
			}
			.ttl {
				flex: 1;
				span {
					font-weight: bold;
				}
				span .tg {
					display: inline-block;
					padding: 4px;
					border-radius: 50%;
					background: #3a5169;
					margin-left: 10px;
				}
				p {
					color: #6a8bad;
				}
			}
			.iconfont {
				background: #3a5169;
				font-size: 18px;
				border-radius: 2px;
				margin: 0 10px;
				width: 32px;
				height: 32px;
				line-height: 32px;
				text-align: center;
			}
		}
	}
}
</style>
