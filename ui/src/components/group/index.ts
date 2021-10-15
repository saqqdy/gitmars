import Group from './group.vue'

/* istanbul ignore next */
Group.install = function (Vue) {
	Vue.component(Group.name, Group)
}

export default Group
