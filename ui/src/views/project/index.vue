<template>
	<div id="project">
		<div class="head">
			<div class="title">
				<div class="left link"><span class="iconfont icon-left" title="收藏"></span> 返回控制台</div>
				<h1>项目管理器</h1>
				<div class="right"><span class="iconfont icon-warning-circle-fill" title="关于"></span></div>
			</div>
			<div class="menu">
				<router-link to="/project/list"><span class="iconfont icon-database-fill"></span> 项目</router-link>
				<router-link to="/project/add"><span class="iconfont icon-plus-square-fill"></span> 导入</router-link>
			</div>
		</div>
		<router-view class="routerView" />
	</div>
</template>

<script>
import { getCurrentInstance } from 'vue'
export default {
	name: 'project',
	setup() {
		const { ctx: ctx } = getCurrentInstance()
		const { currentRoute: route } = ctx.$router
		if (route.value.name === 'project') ctx.$router.replace('/project/list')
		return {}
	}
}
</script>
