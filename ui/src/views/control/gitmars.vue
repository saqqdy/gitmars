<template>
	<div class="page">
		<h1>
			Gitmars工作流
			<p>
				<v3-button type="primary" @click="createBranch">创建分支</v3-button>
				<v3-button type="danger" @click="saveStash">删除分支</v3-button>
			</p>
		</h1>
		<div class="cont">
			<div class="nav">
				<dl class="bugfix">
					<dt>bug分支</dt>
					<dd v-for="el in branchList.bugfix" :class="{ active: el.indexOf('*') > -1 }" :key="el">
						{{ el }}
						<v3-button type="primary" size="mini" @click="checkout(el)" v-if="el.indexOf('*') === -1" plain>进入</v3-button>
					</dd>
				</dl>
				<dl class="feature">
					<dt>feature分支</dt>
					<dd v-for="el in branchList.feature" :class="{ active: el.indexOf('*') > -1 }" :key="el">
						{{ el }}
						<v3-button type="primary" size="mini" @click="checkout(el)" v-if="el.indexOf('*') === -1" plain>进入</v3-button>
					</dd>
				</dl>
				<dl class="others">
					<dt>其他分支</dt>
					<dd v-for="el in branchList.others" :class="{ active: el.indexOf('*') > -1 }" :key="el">
						{{ el }}
						<v3-button type="primary" size="mini" @click="checkout(el)" v-if="el.indexOf('*') === -1" plain>进入</v3-button>
					</dd>
				</dl>
			</div>
			<div class="main">
				<h3>
					<span><i class="iconfont icon-layout"></i> 当前分支：{{ current }} </span>
					<p>{{ project.path }}</p>
				</h3>
				<div class="cmd">
					<div class="section">
						<h4>工作流</h4>
						<v3-collapse v-model="activeNames" :accordion="true" @change="handleChange">
							<v3-collapse-item name="1">
								<template #title>
									<MapCommand :value="commandValue['combine']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['combine']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="2">
								<template #title>
									<MapCommand :value="commandValue['update']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['update']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="3">
								<template #title>
									<MapCommand :value="commandValue['build']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['build']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="4">
								<template #title>
									<MapCommand :value="commandValue['continue']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['continue']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="5">
								<template #title>
									<MapCommand :value="commandValue['end']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['end']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="6">
								<template #title>
									<MapCommand :value="commandValue['branch']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['branch']"></Command>
							</v3-collapse-item>
						</v3-collapse>
					</div>
					<div class="section">
						<h4>实用工具</h4>
						<v3-collapse v-model:value="activeNames" :accordion="true" @change="handleChange">
							<v3-collapse-item name="1">
								<template #title>
									<MapCommand :value="commandValue['save']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['save']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="2">
								<template #title>
									<MapCommand :value="commandValue['get']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['get']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="3">
								<template #title>
									<MapCommand :value="commandValue['copy']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['copy']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="4">
								<template #title>
									<MapCommand :value="commandValue['revert']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['revert']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="5">
								<template #title>
									<MapCommand :value="commandValue['link']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['link']"></Command>
							</v3-collapse-item>
							<v3-collapse-item name="6">
								<template #title>
									<MapCommand :value="commandValue['unlink']" :current="current" @exec="exec"></MapCommand>
								</template>
								<Command v-model:value="commandValue['unlink']"></Command>
							</v3-collapse-item>
						</v3-collapse>
					</div>
				</div>
				<Xterm ref="xterm" class="xterm" v-if="project" :id="project.id" :path="project.path"></Xterm>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, getCurrentInstance, reactive, computed, onMounted, inject, watch, nextTick, provide, onBeforeUnmount } from 'vue'
import Command from './comp/command'
import MapCommand from './comp/map-command'
import Xterm from '@/components/xterm'
import commandSets from './gitmSets'
import nav from '@/components/nav'

console.log(commandSets)

export default {
	name: 'control-tasks',
	components: { Xterm, Command, MapCommand },
	async setup() {
		// data
		const { getTerminal } = inject('Terminal')
		const { socket } = inject('Socket')
		const { ctx } = getCurrentInstance()
		const {
			ctx: {
				$axios,
				$box,
				$nextIndex,
				$router: { currentRoute: route }
			}
		} = getCurrentInstance()
		const xterm = ref(null)
		const project = ref(null)
		const terminal = ref(null)
		const commandValue = reactive(commandSets)
		const activeNames = ref()
		// const branchInterval = ref(null)
		// const { getGitmars } = inject('Gitmars')
		const branchs = ref([])
		// watch
		// watch(
		// 	() => branchs.value,
		// 	() => {
		// 		branchInterval.value && clearInterval(branchInterval.value)
		// 	}
		// )
		watch(
			commandValue,
			val => {
				console.log(val)
			},
			{
				deep: true
			}
		)
		// 计算属性
		const current = computed(() => {
			let o = branchs.value.find(el => el.indexOf('*') > -1)
			o = o.replace(/[\s\\*]+/, '')
			return o
		})
		const branchList = computed(() => {
			let o = {
				bugfix: [],
				feature: [],
				others: []
			}
			branchs.value.forEach(branch => {
				if (branch.indexOf('bugfix/') > -1) {
					o.bugfix.push(branch)
				} else if (branch.indexOf('feature/') > -1) {
					o.feature.push(branch)
				} else {
					o.others.push(branch)
				}
			})
			return o
		})
		// 事件
		onMounted(() => {
			console.log(1, $nextIndex(), ctx, ctx.$el, xterm.value)
		})
		// onBeforeUnmount(() => {
		// 	branchInterval.value && clearInterval(branchInterval.value)
		// })
		// 获取分支列表
		const getProject = async () => {
			return (
				await $axios({
					url: '/common/project/list',
					data: {
						id: route.value.query.id
					}
				})
			).data
		}
		// 获取分支列表
		const getBranchs = async () => {
			return (
				await $axios({
					url: '/cmd/branch/list',
					data: {}
				})
			).data
		}
		// 执行指令
		const exec = cmd => {
			if (!terminal.value) return
			socket.emit(terminal.value.name + '-input', ` ${cmd}\r`)
		}
		project.value = await getProject()
		// 进入执行目录
		await $axios({
			url: '/cmd/cd',
			data: {
				dir: project.value.path
			}
		})
		// branchInterval.value = setInterval(async () => {
		// 	branchs.value = await getBranchs()
		// }, 500)
		branchs.value = await getBranchs()
		terminal.value = getTerminal(project.value.id, project.value.path)

		const handleItemClick = () => {
			console.log('handleItemClick', 666)
		}
		const handleChange = () => {
			console.log('handleChange', 444)
		}
		// 创建分支
		const createBranch = () => {
			$box(nav, {
				width: '640px',
				height: '320px',
				options: {},
				onOk: instance => {
					let { type, name } = instance.submit()
					return new Promise(resolve => {
						exec(`gitm start ${type} ${name}`)
						resolve()
					})
				}
			})
		}
		const saveStash = () => {}
		// checkout分支
		const checkout = async branch => {
			exec(`git checkout ${branch}`)
			project.value = await getProject()
		}
		// console.log(branchs, typeof branchs, branchList)
		// const socketGitmars = getGitmars(project.value.id, project.value.path)

		// methods
		// socketGitmars.on(project.value.id + '-global', global => {
		// 	console.log(global)
		// })
		// socketGitmars.on(project.value.id + '-config', config => {
		// 	console.log(config)
		// })
		// socketGitmars.on(project.value.id + '-branch', branch => {
		// 	console.log(branch)
		// })
		// provide('Branch', [getBranchs, current, branchList])
		return {
			xterm,
			exec,
			commandValue,
			activeNames,
			route,
			project,
			branchList,
			current,
			handleItemClick,
			handleChange,
			createBranch,
			saveStash,
			checkout
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
			.cmd {
				flex: 1;
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				grid-template-rows: minmax(0px, auto) auto minmax(0px, auto);
				grid-template-areas: 'a' 'b';
				grid-auto-flow: row dense;
				justify-items: stretch;
				align-items: stretch;
				gap: 20px;
				.section {
					// .collapse-title {
					// 	flex: 1;
					// 	display: flex;
					// 	margin-right: 10px;
					// 	justify-content: space-between;
					// 	align-items: center;
					// }
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
