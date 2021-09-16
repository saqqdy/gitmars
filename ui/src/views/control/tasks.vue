<template>
	<div class="page" v-if="data.ready">
		<h1>
			tasks
			<p>
				<v3-button type="primary">创建分支</v3-button>
			</p>
		</h1>
		<div class="cont">
			<div class="nav">
				<dl class="bugfix" v-if="Object.keys(data.scripts).length > 0">
					<dt>脚本指令</dt>
					<dd v-for="(script, key) in data.scripts" :class="{ active: false }" :key="key">
						{{ key }}
						<v3-button type="primary" size="mini" @click="run(key)" plain>执行</v3-button>
					</dd>
				</dl>
			</div>
			<div class="main">
				<h3>
					<span>
						<span class="iconfont icon-layout"><span> 当前分支：
					</span>
					<p>{{ data.project.path }}</p>
				</h3>
				<Xterm
					ref="xterm"
					class="xterm"
					v-if="data.project"
					:id="data.project.id"
					:path="data.project.path"
				></Xterm>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { reactive, onMounted, inject } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import Xterm from '@/components/xterm'
import { TerminalInjectionKey, SocketInjectionKey } from '@/symbols/injection'
import useCurrentInstance from '@/hooks/use-current-instance'

import type { ProjectType } from "@/types/project";
import type { TerminalType } from "@/types/terminal";

interface DataType {
	project: ProjectType
	scripts: any[]
	terminal: TerminalType
	ready: boolean
}

export default {
	name: 'ControlTasks',
	components: { Xterm },
	async setup() {
		// data
		const { getTerminal } = inject(TerminalInjectionKey, {})
		const { socket } = inject(SocketInjectionKey, {})
		const {
			globalProperties: { $axios }
		} = useCurrentInstance()
		const router = useRouter()
		const route = useRoute()
		const data: DataType = reactive({
			project: { id: '', name: '', path: '' },
			scripts: [],
			terminal: { name: '' },
			ready: false,
		})

		// 计算属性
		// 事件
		onMounted(() => {
		})
		onBeforeRouteLeave(() => { })

		// 获取分支列表
		const getProject = async () => {
			return (
				await $axios({
					url: '/common/project/list',
					data: {
						id: route.query.id
					}
				})
			).data
		}
		const getPackage = async () => {
			const {
				data: { scripts }
			} = await $axios({
				url: '/cmd/fs/read',
				data: {
					path: `${data.project.path}/package.json`
				}
			})
			return scripts
		}
		// 执行指令
		const exec = (cmd: string) => {
			if (!data.terminal) return
			socket.emit(data.terminal.name + '-input', ` ${cmd}\r`)
		}
		const run = (script: string | number) => {
			exec(`yarn run ${script}`)
		}
		data.project = await getProject()
		data.scripts = await getPackage()
		// 进入执行目录
		await $axios({
			url: '/cmd/cd',
			data: {
				dir: data.project.path
			}
		})

		data.terminal = getTerminal && getTerminal(data.project.id, data.project.path)
		data.ready = true

		return {
			data,
			exec,
			run,
			route
		}
	}
}
</script>

<style lang="less" scoped>
.page {
	display: flex;
	flex-direction: column;
	justify-content: stretch;
	align-items: stretch;
	::v-deep(.v3-collapse) {
		border-top-color: #6a8bad;
	}
	::v-deep(.v3-collapse-item__content) {
		color: #fff;
	}
	::v-deep(.v3-collapse-item__header),
	::v-deep(.v3-collapse-item__wrap) {
		border-bottom-color: #6a8bad;
		background: none;
		color: #fff;
	}
	h1 {
		height: 32px;
		padding: 16px;
		line-height: 32px;
		font-size: 28px;
		font-weight: 300;
		background: #344a5f;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.cont {
		flex: 1;
		display: flex;
		justify-content: stretch;
		align-items: stretch;
		.nav {
			width: 300px;
			overflow-y: auto;
			background: #2c3e50;
			height: 100%;
			dl {
				margin-bottom: 10px;
			}
			dt {
				padding: 0 16px;
				height: 20px;
				line-height: 20px;
				font-size: 12px;
				color: #6a8bad;
			}
			dd {
				height: 44px;
				line-height: 44px;
				padding: 0 16px;
				font-size: 14px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:hover {
					color: #fff;
					background: rgba(66, 185, 131, 0.05);
				}
				&.active {
					color: #42b983;
					background: rgba(66, 185, 131, 0.08) !important;
				}
			}
		}
		.main {
			flex: 1;
			padding: 16px;
			background: #304457;
			display: flex;
			flex-direction: column;
			justify-content: stretch;
			align-items: stretch;
			h3 {
				font-size: 18px;
				line-height: 30px;
				margin-bottom: 16px;
				font-weight: normal;
				display: flex;
				justify-content: space-between;
				align-items: center;
				p {
					font-size: 12px;
					background: #2c3e50;
					line-height: 18px;
					padding: 8px;
					border-radius: 3px;
				}
			}
			.xterm {
				height: 50%;
				min-height: 408px;
			}
		}
	}
}
</style>
