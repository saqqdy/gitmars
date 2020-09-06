<template>
	<teleport to="#app" class="app">
		<div id="nav">
			<router-link to="/">Home</router-link>
			<router-link to="/project">project</router-link>
			<router-link to="/main">main</router-link>
		</div>
		<!-- <v3-button type="primary" nativeType="button" icon="database-fill" @click="click" plain>确认</v3-button> -->
		<router-view />
	</teleport>
</template>

<script>
import { reactive, provide, onMounted } from 'vue'
import io from 'socket.io-client'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'
import { WebLinksAddon } from 'xterm-addon-web-links'
// import { v4 as uuidv4 } from 'uuid'

export default {
	name: 'App',
	setup() {
		// data
		const socket = io('http://127.0.0.1:3000/terminal', { reconnection: true })
		// const socketGitmars = io('http://127.0.0.1:3000/gitmars', { reconnection: true })
		const attachAddon = new AttachAddon(socket)
		const fitAddon = new FitAddon()
		const searchAddon = new SearchAddon()
		const terms = reactive({})

		// function
		const getTerminal = (id, cwd = null) => {
			if (!terms[id]) {
				terms[id] = {
					term: new Terminal(),
					name: 'terminal-' + id,
					pid: null
				}
				terms[id].term.loadAddon(new WebLinksAddon())
				terms[id].term.loadAddon(attachAddon)
				terms[id].term.loadAddon(fitAddon)
				terms[id].term.loadAddon(searchAddon)
				// term输入
				terms[id].term.onData(data => {
					socket.emit(terms[id].name + '-input', data)
				})
				// 监听输入事件
				// terms[id].term.onKey(({ key, domEvent }) => {
				// 	console.log(key, domEvent)
				// })
				// socket
				socket.on(terms[id].name + '-output', arrayBuffer => {
					terms[id].term.write(arrayBuffer)
				})
				socket.on(terms[id].name + '-pid', pid => {
					console.log(pid)
					terms[id].pid = pid
				})
				// socket.on(terms[id].name + '-global', global => {
				// 	console.log(global)
				// 	global = global
				// })
				socket.emit('create', { name: terms[id].name, cwd })
				window.addEventListener('resize', () => {
					terms[id].term.fit()
				})
			}
			return terms[id]
		}
		// const getGitmars = (id, cwd = null) => {
		// 	socketGitmars.emit('create', { name: id, cwd })
		// 	return socketGitmars
		// }

		// provide
		provide('Socket', { socket /*, socketGitmars*/ })
		provide('Terminal', { getTerminal, fitAddon })
		// provide('Gitmars', { getGitmars })

		// hooks
		onMounted(() => {})

		return {}
	}
}
</script>

<style lang="less">
@import './assets/css/index.less';
</style>
