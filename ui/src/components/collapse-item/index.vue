<template>
	<div class="v3-collapse-item" :class="{ 'is-active': isActive, 'is-disabled': disabled }">
		<div role="tab" :aria-expanded="isActive" :aria-controls="`v3-collapse-content-${id}`" :aria-describedby="`v3-collapse-content-${id}`">
			<div
				class="v3-collapse-item__header"
				@click="handleHeaderClick"
				role="button"
				:id="`v3-collapse-head-${id}`"
				:tabindex="disabled ? undefined : 0"
				:class="{
					focusing: focusing,
					'is-active': isActive
				}"
				@keyup.space.enter.stop="handleEnterClick"
				@focus="handleFocus"
				@blur="focusing = false"
			>
				<slot name="title">{{ title }}</slot>
				<i class="v3-collapse-item__arrow iconfont icon-right" :class="{ 'is-active': isActive }"> </i>
			</div>
		</div>
		<!-- <v3-collapse-transition> -->
		<div class="v3-collapse-item__wrap" v-show="isActive" role="tabpanel" :aria-hidden="!isActive" :aria-labelledby="`v3-collapse-head-${id}`" :id="`v3-collapse-content-${id}`">
			<div class="v3-collapse-item__content">
				<slot></slot>
			</div>
		</div>
		<!-- </v3-collapse-transition> -->
	</div>
</template>
<script>
import v3CollapseTransition from './collapse-transition'
import emitter from '@/libs/emitter'
import { ref, reactive, inject, computed, getCurrentInstance } from 'vue'
export default {
	name: 'v3CollapseItem',
	componentName: 'v3CollapseItem',
	// components: { v3CollapseTransition },
	props: {
		title: String,
		name: {
			type: [String, Number],
			default() {
				return this._uid
			}
		},
		disabled: Boolean
	},
	setup(props, { slots, emit, attrs }) {
		const { proxy, appContext } = getCurrentInstance()
		// const {
		// 	// $router: { getRoutes },
		// 	$root: { $http, saqqdy }
		// } = proxy
		const { dispatch } = emitter(proxy)
		const { activeNames, handleItemClick } = inject('collapse')
		const contentWrapStyle = reactive({
			height: 'auto',
			display: 'block'
		})
		const contentHeight = ref(0)
		const focusing = ref(false)
		const isClick = ref(false)
		const id = ref(Math.floor(Math.random() * 10000))
		const isActive = computed(() => activeNames.value.indexOf(props.name) > -1)

		const handleFocus = () => {
			setTimeout(() => {
				if (!isClick.value) {
					focusing.value = true
				} else {
					isClick.value = false
				}
			}, 50)
		}
		const handleHeaderClick = () => {
			if (props.disabled) return
			dispatch('v3Collapse', 'item-click', proxy)
			handleItemClick && handleItemClick(proxy)
			// emit('item-click', proxy)
			focusing.value = false
			isClick.value = true
		}
		const handleEnterClick = () => {
			dispatch('v3Collapse', 'item-click', proxy)
		}

		// console.log(attrs, slots, proxy, saqqdy, $http())
		return {
			contentWrapStyle,
			contentHeight,
			focusing,
			isClick,
			id,
			isActive,

			handleFocus,
			handleHeaderClick,
			handleEnterClick
		}
	}
}
</script>

<style lang="less">
.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
	-webkit-transition: opacity 0.2s linear;
	transition: opacity 0.2s linear;
}
.fade-in-linear-enter,
.fade-in-linear-leave,
.fade-in-linear-leave-active {
	opacity: 0;
}
.v3-fade-in-linear-enter-active,
.v3-fade-in-linear-leave-active {
	-webkit-transition: opacity 0.2s linear;
	transition: opacity 0.2s linear;
}
.v3-fade-in-linear-enter,
.v3-fade-in-linear-leave,
.v3-fade-in-linear-leave-active {
	opacity: 0;
}
.v3-fade-in-enter-active,
.v3-fade-in-leave-active {
	-webkit-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
	transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.v3-fade-in-enter,
.v3-fade-in-leave-active {
	opacity: 0;
}
.v3-zoom-in-center-enter-active,
.v3-zoom-in-center-leave-active {
	-webkit-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
	transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.v3-zoom-in-center-enter,
.v3-zoom-in-center-leave-active {
	opacity: 0;
	-webkit-transform: scaleX(0);
	transform: scaleX(0);
}
.v3-zoom-in-top-enter-active,
.v3-zoom-in-top-leave-active {
	opacity: 1;
	-webkit-transform: scaleY(1);
	transform: scaleY(1);
	-webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	-webkit-transform-origin: center top;
	transform-origin: center top;
}
.v3-zoom-in-top-enter,
.v3-zoom-in-top-leave-active {
	opacity: 0;
	-webkit-transform: scaleY(0);
	transform: scaleY(0);
}
.v3-zoom-in-bottom-enter-active,
.v3-zoom-in-bottom-leave-active {
	opacity: 1;
	-webkit-transform: scaleY(1);
	transform: scaleY(1);
	-webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	-webkit-transform-origin: center bottom;
	transform-origin: center bottom;
}
.v3-zoom-in-bottom-enter,
.v3-zoom-in-bottom-leave-active {
	opacity: 0;
	-webkit-transform: scaleY(0);
	transform: scaleY(0);
}
.v3-zoom-in-left-enter-active,
.v3-zoom-in-left-leave-active {
	opacity: 1;
	-webkit-transform: scale(1, 1);
	transform: scale(1, 1);
	-webkit-transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), -webkit-transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	-webkit-transform-origin: top left;
	transform-origin: top left;
}
.v3-zoom-in-left-enter,
.v3-zoom-in-left-leave-active {
	opacity: 0;
	-webkit-transform: scale(0.45, 0.45);
	transform: scale(0.45, 0.45);
}
.collapse-transition {
	-webkit-transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
	transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
}
.horizontal-collapse-transition {
	-webkit-transition: 0.3s width ease-in-out, 0.3s padding-left ease-in-out, 0.3s padding-right ease-in-out;
	transition: 0.3s width ease-in-out, 0.3s padding-left ease-in-out, 0.3s padding-right ease-in-out;
}
.v3-list-enter-active,
.v3-list-leave-active {
	-webkit-transition: all 1s;
	transition: all 1s;
}
.v3-list-enter,
.v3-list-leave-active {
	opacity: 0;
	-webkit-transform: translateY(-30px);
	transform: translateY(-30px);
}
.v3-opacity-transition {
	-webkit-transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);
	transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.v3-collapse {
	border-top: 1px solid #ebeef5;
	border-bottom: 1px solid #ebeef5;
}
.v3-collapse-item.is-disabled .v3-collapse-item__header {
	color: #bbb;
	cursor: not-allowed;
}
.v3-collapse-item__header {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	height: 48px;
	line-height: 48px;
	background-color: #fff;
	color: #303133;
	cursor: pointer;
	border-bottom: 1px solid #ebeef5;
	font-size: 13px;
	font-weight: 500;
	-webkit-transition: border-bottom-color 0.3s;
	transition: border-bottom-color 0.3s;
	outline: 0;
}
.v3-collapse-item__arrow {
	margin: 0 8px 0 auto;
	-webkit-transition: -webkit-transform 0.3s;
	transition: -webkit-transform 0.3s;
	transition: transform 0.3s;
	transition: transform 0.3s, -webkit-transform 0.3s;
	font-weight: 300;
}
.v3-collapse-item__arrow.is-active {
	-webkit-transform: rotate(90deg);
	transform: rotate(90deg);
}
.v3-collapse-item__header.focusing:focus:not(:hover) {
	color: #409eff;
}
.v3-collapse-item__header.is-active {
	border-bottom-color: transparent;
}
.v3-collapse-item__wrap {
	will-change: height;
	background-color: #fff;
	overflow: hidden;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	border-bottom: 1px solid #ebeef5;
}
.v3-collapse-item__content {
	padding-bottom: 25px;
	font-size: 13px;
	color: #303133;
	line-height: 1.769230769230769;
}
.v3-collapse-item:last-child {
	margin-bottom: -1px;
}
</style>
