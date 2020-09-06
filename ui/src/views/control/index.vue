<template>
	<div class="control">
		<ul class="menu mini">
			<li>
				<router-link :to="{ name: 'control_gitmars', query: route.query }" title="gitmars工作流"><span class="iconfont icon-codelibrary"></span><span>gitmars工作流</span></router-link>
			</li>
			<li>
				<router-link :to="{ name: 'control_tasks', query: route.query }" title="任务"><span class="iconfont icon-detail"></span><span>任务</span></router-link>
			</li>
		</ul>
		<div v-if="error">{{ error }}</div>
		<Suspense v-else>
			<template #default>
				<router-view class="routerView" />
			</template>
			<template #fallback> loading... </template>
		</Suspense>
	</div>
</template>

<script>
import { ref, getCurrentInstance, onErrorCaptured } from 'vue'

export default {
	name: 'project-add',
	setup() {
		const { ctx: ctx } = getCurrentInstance()
		const { currentRoute: route } = ctx.$router
		const error = ref(null)
		if (route.value.name === 'control') ctx.$router.replace({ name: 'control_gitmars', query: route.value.query })
		onErrorCaptured(err => {
			error.value = err
			return true
		})
		return {
			router: ctx.$router,
			route,
			error
		}
	}
}
</script>

<style lang="less" scoped>
.control {
	height: 100%;
	display: flex;
	justify-items: stretch;
	align-items: stretch;
	.menu {
		width: 220px;
		background: #1d2935;
		.iconfont ~ span {
			margin-left: 8px;
		}
		&.mini {
			text-align: center;
			width: 60px;
			overflow: hidden;
			::v-deep(.iconfont) {
				font-size: 24px;
			}
			.iconfont ~ span {
				display: none;
			}
		}
		li {
			height: 44px;
			line-height: 44px;
		}
		a {
			font-size: 16px;
			padding: 0 18px;
			display: block;
			&:hover {
				color: #fff;
				background: #4e6e8e;
			}
			&.router-link-active {
				color: #42b983;
				background: rgba(66, 185, 131, 0.05) !important;
			}
		}
	}
	.routerView {
		flex: 1;
	}
}
</style>
