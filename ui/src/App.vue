<template>
	<teleport to="#app" class="app">
		<!-- <div id="nav">
			<router-link to="/">Home</router-link>
			<router-link to="/project">project</router-link>
			<router-link to="/main">main</router-link>
		</div> -->
		<router-view />
	</teleport>
</template>

<script>
import { reactive, provide, onMounted } from 'vue'
import io from 'socket.io-client'
import { Terminal } from 'xterm'
import xtermTheme from 'xterm-style'
import 'xterm/css/xterm.css'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'
import { WebLinksAddon } from 'xterm-addon-web-links'

export default {
	components: {},
	setup() {
		// data
		const socket = io('http://127.0.0.1:3000/terminal', { reconnection: true })
		const socketGitmars = io('http://127.0.0.1:3000/gitmars', { reconnection: true })
		const attachAddon = new AttachAddon(socket)
		const fitAddon = new FitAddon()
		const searchAddon = new SearchAddon()
		const terms = reactive({})

		// function
		const getTerminal = (id, cwd = null) => {
			if (!terms[id]) {
				terms[id] = {
					term: new Terminal({
						theme: xtermTheme,
						fontSize: 12,
						fontWeight: 300,
						lineHeight: 1.1,
						fontFamily: '"JetBrains Mono", Menlo, consolas, "Microsoft YaHei", "PingFangSC-Regular", Avenir, Helvetica, Arial, sans-serif'
					}),
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
					console.info('pid: ', pid)
					terms[id].pid = pid
				})
				socket.emit('create', { name: terms[id].name, cwd })
				window.addEventListener('resize', () => {
					terms[id].term.fit()
				})
			}
			return terms[id]
		}

		// provide
		provide('Socket', { socket, socketGitmars })
		provide('Terminal', { getTerminal, fitAddon })

		// hooks
		onMounted(() => {})

		return {}
	}
}
</script>

<style lang="less">
@import './assets/css/index.less';
</style>
