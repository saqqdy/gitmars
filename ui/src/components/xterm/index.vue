<template>
    <div ref="terminal" class="terminal">
        <div :id="id" ref="termWrap" class="terminal-pane" />
    </div>
</template>

<script>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { TerminalInjectionKey } from '@/symbols/injection'

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
        const { getTerminal /*, fitAddon */ } = inject(TerminalInjectionKey)
        // const { socket } = inject(SocketInjectionKey)
        const terminal = getTerminal(props.id, props.path)
        // methods

        // event
        onMounted(() => {
            terminal.term.open(termWrap.value)
            // fitAddon.fit()
            terminal.term.focus()
            // terminal.term.clear()
            // terminal.term.reset()
            // nextTick(() => {
            // 	socket.emit(terminal.name + '-input', '\r')
            // })
            // searchAddon.findNext('foo')
        })
        onBeforeUnmount(() => {
            // fitAddon.dispose()
            // terminal.term.dispose()
        })
        return {
            termWrap
        }
    }
}
</script>
<style lang="less" scoped>
.terminal {
    overflow: hidden;
    height: 100%;
}
</style>
