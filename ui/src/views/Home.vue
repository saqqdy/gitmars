<template>
	<div class="terminal-wrap">
		<!-- <div>项目名称：{{ data.global.appName }}</div>
		<div>系统：{{ data.global.system }}</div> -->
		<div class="projectList" v-for="(item, index) of data.projects" :key="index">
			<div>{{ index }}</div>
			<div>{{ item.name }}</div>
			<div>{{ item.path }}</div>
			<div><span class="link" @click="goProject(item)">进入</span></div>
		</div>

		<div v-if="data.currentProject">
			<hr />
			{{ data.currentProject.name }}
			<div>
				<span class="link" @click="saveStash">存入暂存区</span>
				<span class="link" @click="getStash">从暂存区取出</span>
				<span class="link" @click="startBugfix">创建bugfix分支</span>
				<span class="link" @click="startRelease">创建release分支</span>
			</div>
			<div>
				<span class="link" @click="build">构建项目（app）</span>
				<span class="link" @click="getStash">从暂存区取出</span>
				<span class="link" @click="startBugfix">创建bugfix分支</span>
				<span class="link" @click="startRelease">创建release分支</span>
			</div>
			<hr />
			Master权限用户专用
			<div>
				<span class="link" @click="saveStash">发布bugfix</span>
				<span class="link" @click="getStash">发布release</span>
				<span class="link" @click="startBugfix">创建bugfix分支</span>
				<span class="link" @click="startRelease">创建release分支</span>
			</div>
		</div>

		<div class="terminal" ref="terminal" :style="{ backgroundColor: bgColor, color: fontColor }">
			<div v-for="(term, index) in data.terminals" :key="index" :ref="term.name" :id="term.name" class="terminal-pane" v1-show="term.name === data.currentPane"></div>
		</div>
	</div>
</template>

<script>
import { ref, reactive, onMounted, computed, getCurrentInstance, onBeforeUnmount, nextTick, watch } from 'vue'
import Terminal from './xterm'
import { WebLinksAddon } from 'xterm-addon-web-links'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

export default {
	name: 'Home',
	components: {},
	setup(props) {
		// data
		const {
			ctx: { _, $refs, $root, $axios }
		} = getCurrentInstance()
		const status = ref(null)
		// const global = ref({})
		const data = reactive({
			global: {},
			currentPane: null,
			terminals: [],
			theme: '',

			projects: [],
			currentProject: null
		})
		let socket = null
		// const theme = reactive({})

		// computed
		const bgColor = computed(() => {
			if (data.theme) {
				return data.theme.background
			} else {
				return '#000'
			}
		})
		const fontColor = computed(() => {
			if (data.theme) {
				return data.theme.foreground
			} else {
				return '#fff'
			}
		})

		// methods
		const createTerminal = (cb, cwd = null) => {
			return new Promise(resolve => {
				let name = 'terminal-' + uuidv4(),
					term = new Terminal(),
					pane
				term.loadAddon(new WebLinksAddon())
				pane = { term: term, name: name }
				data.terminals.push(pane)
				data.currentPane = name //默认显示新创建的tab
				cb && cb(term)

				term.on('resize', size => {
					socket.emit(name + '-resize', [size.cols, size.rows])
				})
				term.on('data', data => {
					socket.emit(name + '-input', data)
				})

				socket.on(name + '-output', arrayBuffer => {
					term.write(arrayBuffer)
				})
				socket.on(name + '-pid', pid => {
					console.log(pid)
					pane.pid = pid
				})
				socket.on(name + '-global', global => {
					console.log(global)
					data.global = global
				})
				window.addEventListener('resize', () => {
					term.fit()
				})
				socket.emit('create', { name: name, cwd })
				resolve(term)
				nextTick(() => {
					// term.open($refs[name])
					term.open(document.getElementById(name))
					console.log($refs, $root, _.refs, _.root)
					// fit()
					term.focus()
					// setTimeout(() => {
					// 	socket.emit(name + '-input', 'gitm -v\r')
					// }, 6000)
				})
			})
		}

		// watch
		// watch(message, val => {
		// 	console.log(val)
		// })

		// add
		const add = async () => {
			await createTerminal()
		}
		// del
		const del = name => {
			if (data.terminals.length < 1) return
			let i = data.terminals.findIndex(el => el.name === name)
			data.terminals.splice(i, 1)
			// fit()
		}
		// fit
		// const fit = () => {
		// 	data.terminals.forEach(el => {
		// 		let termEl = $refs[el.name]
		// 		if (el.term.element != termEl.children[0]) {
		// 			termEl.innerHTML = ''
		// 			termEl.append(el.term.element)
		// 		}
		// 		el.term.fit()
		// 		el.rect = el.term.element.getBoundingClientRect()
		// 	})
		// }
		// handleMove
		const handleMove = () => {
			let term = data.terminals.find(el => el.name === data.currentPane)
			if (isInRect(term.rect, event)) {
				return false
			}
			data.terminals.forEach(({ term, name, rect }, i) => {
				if (isInRect(rect, event)) {
					term.focus()
					data.currentPane = i
				} else {
					term.blur()
				}
			})
		}
		// isInRect
		const isInRect = (rect, e) => {
			if (e.clientY >= rect.top && e.clientY <= rect.top + rect.height && e.clientX >= rect.left && e.clientX <= rect.left + rect.width) {
				return true
			} else {
				return false
			}
		}
		// close
		const close = () => {
			data.terminals.forEach(({ term, name }) => {
				term.destroy()
				socket.emit(name + '-exit')
			})
			socket.close()
		}
		// getProjects
		const getProjects = () => {
			$axios({
				url: '/common/project/list',
				data: {}
			}).then(res => {
				console.log(200, res.data)
				data.projects = res.data
			})
		}
		// goProject
		const goProject = p => {
			data.currentProject = p
			socket && socket.emit(data.currentPane + '-input', `cd ${p.path}\r`)
		}
		// getStatus
		const getStatus = () => {
			$axios({
				url: '/cmd/status',
				data: {}
			}).then(res => {
				console.log(200, res.data)
				status.value = res.data
			})
		}

		// event
		onMounted(async () => {
			if (!socket) socket = await io('http://127.0.0.1:3000/terminal', { reconnection: true })
			await add()
			getStatus()
			getProjects()
			$axios({
				url: '/cmd/result',
				method: 'get',
				data: {
					cmd: encodeURIComponent('pwd')
				}
			}).then(data => {
				console.log(200, data)
			})
		})
		onBeforeUnmount(() => {
			close()
		})
		return {
			socket,
			global,
			data,

			bgColor,
			fontColor,

			add,
			del,

			handleMove,

			goProject
		}
	}
}
</script>
<style lang="less" scoped>
.terminal-wrap {
	color: #333;
	font-size: 14px;
	.link {
		color: blue;
		cursor: pointer;
		margin: 0 8px;
		&:hover,
		&:active {
			text-decoration: underline;
		}
	}
	.projectList {
		display: flex;
		line-height: 2;
		> div {
			padding: 0 10px;
		}
	}
}
</style>
