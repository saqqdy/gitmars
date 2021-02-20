import Cell from './cell.vue'

/* istanbul ignore next */
Cell.install = function (Vue) {
	Vue.component(Cell.name, Cell)
}

export default Cell
