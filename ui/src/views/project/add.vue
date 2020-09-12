<template>
	<div class="project-add">
		<div class="content">
			<h2>导入项目</h2>
			<div class="fold">
				<input type="text" v-model.trim="form.path" placeholder="请输入项目完整路径" />
			</div>
			<div class="btn">
				<a class="link" href="javascript:;" @click="add" type="button"><span class="iconfont icon-plus-square-fill"></span> 导入该项目</a>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, getCurrentInstance } from 'vue'

export default {
	name: 'project-add',
	setup() {
		const { ctx } = getCurrentInstance()
		const { $axios, $router, $box } = ctx
		const form = reactive({
			path: '/Users/saqqdy/www/saqqdy/lost-ui'
		})

		// checkPath
		const checkPath = () => {
			return new Promise((resolve, reject) => {
				$axios({
					url: '/common/project/check',
					data: {
						path: form.path
					}
				})
					.then(({ data: { code, message } }) => {
						if (code !== 0) {
							$box(null, {
								width: '320px',
								height: '80px',
								message: message,
								showHeader: false,
								showMax: false,
								showBtn: false
							})
							resolve(false)
						} else {
							resolve(true)
						}
					})
					.finally(() => {
						resolve(false)
					})
			})
		}
		// add
		const add = async () => {
			if (!form.path) alert('请输入项目完整路径')
			;(await checkPath()) &&
				$axios({
					url: '/common/project/add',
					type: 'post',
					data: {
						path: form.path
					}
				}).then(res => {
					$box(null, {
						width: '320px',
						height: '80px',
						message: '操作成功！',
						showHeader: false,
						showMax: false,
						showBtn: false
					})
					$router.push('/project/list')
				})
		}
		return {
			form,
			// function
			add
		}
	}
}
</script>

<style lang="less" scoped>
.project-add {
	.content {
		padding: 30px;
		width: 800px;
		height: calc(100% - 110px);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		h2 {
			color: #6a8bad;
			font-size: 16px;
			line-height: 50px;
		}
		.fold {
			margin-bottom: 80px;
			input {
				background: #3a5169;
				color: #fff;
				width: 100%;
				border: 0;
				padding: 16px;
				height: 24px;
				line-height: 24px;
			}
		}
		.btn {
			text-align: center;
			a {
				display: inline-block;
				font-size: 16px;
				padding: 10px 20px;
				background: #42b983;
				&:hover,
				&:active {
					background: #70cca2;
				}
			}
		}
	}
}
</style>
