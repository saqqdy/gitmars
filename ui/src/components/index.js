import v3Split from './split/index.vue'
import v3Button from './button/index.vue'
import v3Checkbox from './checkbox/index.vue'
import v3Collapse from './collapse/index.vue'
import v3CollapseItem from './collapse-item/index.vue'
import v3Box from './box/index.vue'

const install = app => {
	app.component(v3Split.name, v3Split)
	app.component(v3Button.name, v3Button)
	app.component(v3Checkbox.name, v3Checkbox)
	app.component(v3Collapse.name, v3Collapse)
	app.component(v3CollapseItem.name, v3CollapseItem)
	app.component(v3Box.name, v3Box)
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	install,
	v3Split,
	v3Button,
	v3Checkbox,
	v3Collapse,
	v3CollapseItem
}
