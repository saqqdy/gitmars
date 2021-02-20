// import { ref, computed } from 'vue'
// import { useStore } from 'vuex'
// import vu3ui from 'vu3-ui'
// import 'vu3-ui/lib/vu3ui.css'
// import vu3ui from '/Users/saqqdy/www/saqqdy/vu3-ui/lib/vu3ui.umd.js'
// import '/Users/saqqdy/www/saqqdy/vu3-ui/lib/vu3ui.css'
// import vu3ui from '@/components/index'
import vu3ui from '@/components'
console.log(vu3ui)

export default function global() {
	// const mix1 = ref(3)
	// const store = useStore()
	// const num1 = computed(() => store.state.num)
	return {
		components: vu3ui,
		props: {}
	}
}
