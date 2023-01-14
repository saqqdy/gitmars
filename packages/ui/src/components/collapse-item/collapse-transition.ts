import { getCurrentInstance, h, reactive } from 'vue'

// @ts-expect-error
function hasClass(elem: HTMLElement, cls) {
	elem = elem || {}
	return new RegExp('\\b' + cls + '\\b').test(elem.className)
}
// @ts-expect-error
function addClass(elem: HTMLElement, cls) {
	elem = elem || {}
	hasClass(elem, cls) || (elem.className += ' ' + cls)
	elem.className = elem.className.trim()
}
// @ts-expect-error
function removeClass(elem: HTMLElement, cls) {
	elem = elem || {}
	if (hasClass(elem, cls)) {
		const reg = new RegExp('\\b' + cls + '\\b')
		elem.className = elem.className.replace(reg, '')
	}
}

class Transition {
	// @ts-expect-error
	beforeEnter(el) {
		addClass(el, 'collapse-transition')
		if (!el.dataset) el.dataset = {}

		el.dataset.oldPaddingTop = el.style.paddingTop
		el.dataset.oldPaddingBottom = el.style.paddingBottom

		el.style.height = '0'
		el.style.paddingTop = 0
		el.style.paddingBottom = 0
	}

	// @ts-expect-error
	enter(el) {
		el.dataset.oldOverflow = el.style.overflow
		if (el.scrollHeight !== 0) {
			el.style.height = el.scrollHeight + 'px'
			el.style.paddingTop = el.dataset.oldPaddingTop
			el.style.paddingBottom = el.dataset.oldPaddingBottom
		} else {
			el.style.height = ''
			el.style.paddingTop = el.dataset.oldPaddingTop
			el.style.paddingBottom = el.dataset.oldPaddingBottom
		}

		el.style.overflow = 'hidden'
	}

	// @ts-expect-error
	afterEnter(el) {
		// for safari: remove class then reset height is necessary
		removeClass(el, 'collapse-transition')
		el.style.height = ''
		el.style.overflow = el.dataset.oldOverflow
	}

	// @ts-expect-error
	beforeLeave(el) {
		if (!el.dataset) el.dataset = {}
		el.dataset.oldPaddingTop = el.style.paddingTop
		el.dataset.oldPaddingBottom = el.style.paddingBottom
		el.dataset.oldOverflow = el.style.overflow

		el.style.height = el.scrollHeight + 'px'
		el.style.overflow = 'hidden'
	}

	// @ts-expect-error
	leave(el) {
		if (el.scrollHeight !== 0) {
			// for safari: add class after set height, or it will jump to zero height suddenly, weired
			addClass(el, 'collapse-transition')
			el.style.height = 0
			el.style.paddingTop = 0
			el.style.paddingBottom = 0
		}
	}

	// @ts-expect-error
	afterLeave(el) {
		removeClass(el, 'collapse-transition')
		el.style.height = ''
		el.style.overflow = el.dataset.oldOverflow
		el.style.paddingTop = el.dataset.oldPaddingTop
		el.style.paddingBottom = el.dataset.oldPaddingBottom
	}
}

export default {
	name: 'v3CollapseTransition',
	functional: true,
	setup() {
		// @ts-expect-error
		const { proxy } = getCurrentInstance()
		const data = reactive({
			on: new Transition()
		})
		// @ts-expect-error
		return () => h('transition', data, proxy.$children)
	}
}
