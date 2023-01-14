import { createRouter, createWebHashHistory } from 'vue-router'

// import { defineAsyncComponent } from 'vue'

// // simple usage
// const AsyncFoo = defineAsyncComponent(() => import('./Foo.vue'))

// // with options
// const AsyncFooWithOptions = defineAsyncComponent({
// 	loader: () => import('./Foo.vue'),
// 	loadingComponent: LoadingComponent,
// 	errorComponent: ErrorComponent,
// 	delay: 100, // default: 200
// 	timeout: 3000, // default: Infinity
// 	suspensible: false, // default: true
// 	onError(error, retry, fail, attempts) {
// 		if (error.message.match(/fetch/) && attempts <= 3) {
// 			retry()
// 		} else {
// 			fail()
// 		}
// 	}
// })

const routes = [
	{
		path: '/',
		name: 'Home',
		redirect: '/project/list'
		// component: Home
	},
	{
		path: '/project',
		name: 'project',
		component: () => import(/* webpackChunkName: "project" */ '../views/project/index.vue'),
		children: [
			{
				path: 'list',
				name: 'project_list',
				component: () =>
					import(/* webpackChunkName: "project" */ '../views/project/list.vue')
			},
			{
				path: 'add',
				name: 'project_add',
				component: () =>
					import(/* webpackChunkName: "project" */ '../views/project/add.vue')
			}
		]
	},
	{
		path: '/control',
		name: 'control',
		component: () => import(/* webpackChunkName: "control" */ '../views/control/index.vue'),
		children: [
			{
				path: 'gitmars',
				name: 'control_gitmars',
				component: () =>
					import(/* webpackChunkName: "control" */ '../views/control/gitmars.vue')
			},
			{
				path: 'tasks',
				name: 'control_tasks',
				component: () =>
					import(/* webpackChunkName: "control" */ '../views/control/tasks.vue')
			}
		]
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	// @ts-expect-error
	routes
})

export default router
