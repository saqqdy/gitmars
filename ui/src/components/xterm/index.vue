<template>
	<div class="terminal" ref="terminal">
		<div ref="termWrap" :id="id" class="terminal-pane"></div>
	</div>
</template>

<script>
import { onMounted, onBeforeUnmount, inject, ref, nextTick } from 'vue'

export default {
	name: 'Xterm',
	components: {},
	props: {
		id: String,
		path: String
	},
	setup(props) {
		// data
		const termWrap = ref(null)
		const { getTerminal, fitAddon } = inject('Terminal')
		const { socket } = inject('Socket')
		const terminal = getTerminal(props.id, props.path)
		// methods

		// event
		onMounted(() => {
			terminal.term.open(termWrap.value)
			fitAddon.fit()
			terminal.term.focus()
			// nextTick(() => {
			// 	socket.emit(terminal.name + '-input', 'll\r')
			// })
			// searchAddon.findNext('foo')
		})
		onBeforeUnmount(() => {})
		return {
			termWrap
		}
	}
}
</script>
<style lang="less" scoped>
.terminal {
	overflow: hidden;
}
</style>
