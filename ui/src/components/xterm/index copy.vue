<template>
	<div class="terminal" ref="terminal">
		<div :key="pane.name" :ref="pane.name" :id="pane.name" class="terminal-pane"></div>
	</div>
</template>

<script>
import { reactive, onMounted, onBeforeUnmount, nextTick, inject } from 'vue'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'
// const socket = new WebSocket('wss://docker.example.com/containers/mycontainerid/attach/ws');
import { WebLinksAddon } from 'xterm-addon-web-links'
import { v4 as uuidv4 } from 'uuid'
// import axios from '@/lib/axios/index'

export default {
	name: 'Xterm',
	components: {},
	setup() {
		// data
		const pane = reactive({
			global: null,
			name: null,
			term: null,
			pid: null
		})
		const socket = inject('Socket', null)
		const attachAddon = new AttachAddon(socket)
		const fitAddon = new FitAddon()
		const searchAddon = new SearchAddon()

		// methods
		// const createTerminal = (cb, cwd = null) => {
		// 	return new Promise(resolve => {
		pane.name = 'terminal-' + uuidv4()
		pane.term = new Terminal()
		pane.term.loadAddon(new WebLinksAddon())
		pane.term.loadAddon(attachAddon)
		pane.term.loadAddon(fitAddon)
		pane.term.loadAddon(searchAddon)
		// cb && cb(pane.term)

		// pane.term.on('resize', size => {
		// 	socket.emit(pane.name + '-resize', [size.cols, size.rows])
		// })
		// pane.term.writeln('This is a local terminal emulation, without a real terminal in the back-end.')
		pane.term.onData(data => {
			socket.emit(pane.name + '-input', data)
		})

		// 监听输入事件
		// pane.term.onKey(({ key, domEvent }) => {
		// 	console.log(key, domEvent)
		// })

		socket.on(pane.name + '-output', arrayBuffer => {
			pane.term.write(arrayBuffer)
		})
		socket.on(pane.name + '-pid', pid => {
			console.log(pid)
			pane.pid = pid
		})
		socket.on(pane.name + '-global', global => {
			console.log(global)
			pane.global = global
		})
		window.addEventListener('resize', () => {
			pane.term.fit()
		})
		socket.emit('create', { name: pane.name, cwd: null })
		// resolve(pane.term)
		// nextTick(() => {
		// 	// term.open(ctx.$refs[pane.name])
		// 	pane.term.open(document.getElementById(pane.name))
		// 	fitAddon.fit()
		// 	searchAddon.findNext('foo')
		// 	pane.term.focus()
		// 	// setTimeout(() => {
		// 	// 	socket.emit(pane.name + '-input', 'gitm -v\r')
		// 	// }, 6000)
		// })
		// 	})
		// }

		// event
		onMounted(async () => {
			// if (!socket) socket = await io('http://127.0.0.1:3000/terminal', { reconnection: true })
			// await createTerminal()
			pane.term.open(document.getElementById(pane.name))
			fitAddon.fit()
			// searchAddon.findNext('foo')
			pane.term.focus()
		})
		onBeforeUnmount(() => {})
		return {
			socket,
			pane
		}
	}
}
</script>
<style lang="less" scoped>
.terminal {
	overflow: hidden;
	// color: blue;
	// cursor: pointer;
	// margin: 0 8px;
	// &:hover,
	// &:active {
	// 	text-decoration: underline;
	// }
}
</style>
