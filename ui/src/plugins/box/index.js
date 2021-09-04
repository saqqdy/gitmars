import { render, createVNode } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { nextIndex, extend } from '@/libs/tool'
import box from '@/components/box/index.vue'
// import { createCommand } from 'commander'

const defaults = {
	opacity: 0.4,
	title: '提示',
	width: '640px',
	height: '360px',
	message: null,
	okBtnName: '确定',
	cancelBtnName: '取消',
	defaultMax: false,
	showOkBtn: true,
	showCancelBtn: true,
	showClose: true,
	showHeader: true,
	showBtn: true,
	showMax: true,
	options: {}
}

class Box {
	constructor(app, component, options) {
		options = extend(true, {}, defaults, options)
		this.$el = document.createElement('div')
		this.$el.className = 'mask'
		this.$el.style.zIndex = nextIndex()
		this.$el.style.background = 'rgba(0, 0, 0, ' + options.opacity + ')'
		this.$el.id = uuidv4()
		this.instance = createVNode(box)
		this.instance.props = {
			...options,
			component,
			hide: () => {
				this.hide()
			}
		}
		document.body.appendChild(this.$el)
		this.show()
	}
	show() {
		render(this.instance, this.$el)
	}
	hide() {
		render(null, this.$el)
		document.body.removeChild(this.$el)
		this.$el = null
		this.instance = null
		delete this.$el
		delete this.instance
	}
}

export default Box
