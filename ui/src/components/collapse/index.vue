<template>
	<div class="v3-collapse" role="tablist" aria-multiselectable="true" @item-click="handleItemClick">
		<slot></slot>
	</div>
</template>
<script>
import { ref, provide, getCurrentInstance, watch } from 'vue'
export default {
	name: 'v3Collapse',
	componentName: 'v3Collapse',
	props: {
		accordion: Boolean,
		value: {
			type: [Array, String, Number],
			default() {
				return []
			}
		}
	},
	// emits: {
	// 	'item-click': () => {
	// 		console.log('item-click', 10)
	// 		return true
	// 	}
	// },
	setup(props, { slots, emit }) {
		const activeNames = ref([])
		activeNames.value = [].concat(props.value)
		watch(
			() => props.value,
			val => {
				console.log('collapse value change', val)
				// activeNames.value = val
			}
		)
		const setActiveNames = actNames => {
			actNames = [].concat(actNames)
			let value = props.accordion ? actNames[0] : actNames
			activeNames.value = actNames
			// emit('change', value)
			emit('update:value', value)
		}
		const handleItemClick = item => {
			if (props.accordion) {
				setActiveNames((activeNames.value[0] || activeNames.value[0] === 0) && activeNames.value[0] === item.name ? '' : item.name)
			} else {
				let actNames = activeNames.value.slice(0),
					index = actNames.indexOf(item.name)
				if (index > -1) {
					actNames.splice(index, 1)
				} else {
					actNames.push(item.name)
				}
				setActiveNames(actNames)
			}
		}
		provide('collapse', { activeNames, handleItemClick })

		return {
			activeNames,
			setActiveNames,
			handleItemClick
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
