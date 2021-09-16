<template>
	<!-- <transition name="v3-message-fade" @after-leave="handleAfterLeave"> -->
	<div
		:class="['v3-message', type && !iconClass ? `v3-message--${type}` : '', center ? 'is-center' : '', showClose ? 'is-closable' : '', customClass]"
		:style="positionStyle"
		v-show="visible"
		@mouseenter="clearTimer"
		@mouseleave="startTimer"
		role="alert"
	>
		<i :class="iconClass" v-if="iconClass"></i>
		<i :class="typeClass" v-else></i>
		<slot>
			<p v-if="!dangerouslyUseHTMLString" class="v3-message__content">{{ message }}</p>
			<p v-else v-html="message" class="v3-message__content"></p>
		</slot>
		<i v-if="showClose" class="v3-message__closeBtn v3-icon-close" @click="close"></i>
	</div>
	<!-- </transition> -->
</template>

<script type="text/babel">
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
const typeMap = {
	success: 'success',
	info: 'info',
	warning: 'warning',
	error: 'error'
}
export default {
	setup(props, { emit }) {
		const data = reactive({
			visible: false,
			message: '',
			duration: 3000,
			type: 'info',
			iconClass: '',
			customClass: '',
			onClose: null,
			showClose: false,
			closed: false,
			verticalOffset: 20,
			timer: null,
			dangerouslyUseHTMLString: false,
			center: false
		})
		const typeClass = computed(() => {
			return data.type && !data.iconClass ? `v3-message__icon v3-icon-${typeMap[data.type]}` : ''
		})
		const positionStyle = computed(() => {
			return {
				top: `${data.verticalOffset}px`
			}
		})
		watch(
			() => data.closed,
			val => {
				if (val) {
					data.visible = false
				}
			}
		)
		const handleAfterLeave = () => {
			// this.$destroy(true)
			// this.$el.parentNode.removeChild(this.$el)
		}
		const close = () => {
			data.closed = true
			if (typeof data.onClose === 'function') {
				data.onClose(this)
			}
		}
		const clearTimer = () => {
			clearTimeout(data.timer)
		}
		const startTimer = () => {
			if (data.duration > 0) {
				data.timer = setTimeout(() => {
					if (!data.closed) {
						close()
					}
				}, data.duration)
			}
		}
		const keydown = e => {
			if (e.keyCode === 27) {
				// esc关闭消息
				if (!data.closed) {
					close()
				}
			}
		}
		onMounted(() => {
			startTimer()
			document.addEventListener('keydown', keydown)
		})
		onBeforeUnmount(() => {
			document.removeEventListener('keydown', keydown)
		})
	}
}
</script>

<style lang="less">
.v3-message {
	min-width: 380px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border-radius: 4px;
	border-width: 1px;
	border-style: solid;
	border-color: #ebeef5;
	position: fixed;
	left: 50%;
	top: 20px;
	-webkit-transform: translateX(-50%);
	transform: translateX(-50%);
	background-color: #edf2fc;
	-webkit-transition: opacity 0.3s, top 0.4s, -webkit-transform 0.4s;
	transition: opacity 0.3s, top 0.4s, -webkit-transform 0.4s;
	transition: opacity 0.3s, transform 0.4s, top 0.4s;
	transition: opacity 0.3s, transform 0.4s, top 0.4s, -webkit-transform 0.4s;
	overflow: hidden;
	padding: 15px 15px 15px 20px;
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
}
.v3-message.is-center {
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
}
.v3-message.is-closable .v3-message__content {
	padding-right: 16px;
}
.v3-message p {
	margin: 0;
}
.v3-message--info .v3-message__content {
	color: #909399;
}
.v3-message--success {
	background-color: #f0f9eb;
	border-color: #e1f3d8;
}
.v3-message--success .v3-message__content {
	color: #67c23a;
}
.v3-message--warning {
	background-color: #fdf6ec;
	border-color: #faecd8;
}
.v3-message--warning .v3-message__content {
	color: #e6a23c;
}
.v3-message--error {
	background-color: #fef0f0;
	border-color: #fde2e2;
}
.v3-message--error .v3-message__content {
	color: #f56c6c;
}
.v3-message__icon {
	margin-right: 10px;
}
.v3-message__content {
	padding: 0;
	font-size: 14px;
	line-height: 1;
}
.v3-message__content:focus {
	outline-width: 0;
}
.v3-message__closeBtn {
	position: absolute;
	top: 50%;
	right: 15px;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
	cursor: pointer;
	color: #c0c4cc;
	font-size: 16px;
}
.v3-message__closeBtn:focus {
	outline-width: 0;
}
.v3-message__closeBtn:hover {
	color: #909399;
}
.v3-message .v3-icon-success {
	color: #67c23a;
}
.v3-message .v3-icon-error {
	color: #f56c6c;
}
.v3-message .v3-icon-info {
	color: #909399;
}
.v3-message .v3-icon-warning {
	color: #e6a23c;
}
.v3-message-fade-enter,
.v3-message-fade-leave-active {
	opacity: 0;
	-webkit-transform: translate(-50%, -100%);
	transform: translate(-50%, -100%);
}
</style>
