<template>
	<div class="control">
		<div class="menu mini">
			<ul>
				<li>
					<router-link :to="{ name: 'control_gitmars', query: route.query }" title="gitmars工作流">
						<span class="iconfont icon-codelibrary"></span>
						<span>gitmars工作流</span>
					</router-link>
				</li>
				<li>
					<router-link :to="{ name: 'control_tasks', query: route.query }" title="任务">
						<span class="iconfont icon-control"></span>
						<span>任务</span>
					</router-link>
				</li>
			</ul>
			<ul>
				<li>
					<router-link :to="{ name: 'project_list' }" title="返回项目列表">
						<span class="iconfont icon-left-circle"></span>
						<span>返回项目列表</span>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="loading" v-if="error">{{ error }}</div>
		<Suspense v-else>
			<template #default>
				<router-view class="routerView" />
			</template>
			<template #fallback>
				<div class="loading">loading...</div>
			</template>
		</Suspense>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Control'
}
</script>
<script lang="ts" setup>
import { Ref, ref, onErrorCaptured } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const error: Ref<Error | Object | null> = ref(null)
if (route.name === 'control') router.replace({ name: 'control_gitmars', query: route.query })
onErrorCaptured((err): boolean => {
	error.value = err
	// console.warn('error', err)
	return true
})
defineExpose({
	router,
	route,
	error
})
</script>

<style lang="less" scoped>
.control {
	height: 100%;
	display: flex;
	justify-items: stretch;
	align-items: stretch;
	.loading {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.menu {
		width: 220px;
		background: #1d2935;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
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
