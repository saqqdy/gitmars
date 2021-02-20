<template>
	<div
		class="y-group"
		:style="
			cleanStyle({
				marginTop: $px2rem(gutter),
				padding: $px2rem(padding)
			})
		"
	>
		<div class="title" v-if="title || $slots.title">
			{{ title }}
			<slot name="title"></slot>
		</div>
		<div class="y-cells">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import mix from '../mix'
export default {
	name: 'y-group',
	props: {
		title: String,
		gutter: [String, Number],
		padding: [String, Number]
	},
	mixins: [mix],
	methods: {}
}
</script>

<style lang="less">
.y-group {
	width: 100%;
	.title {
		line-height: 2;
		font-size: 12px;
		padding: 0 16px;
		color: #aaa;
	}
}
.y-cells {
	font-size: 16px;
	overflow: hidden;
	position: relative;
}
.y-cells:before {
	content: ' ';
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	height: 1px;
	border-top: 1px solid #ddd;
	color: #ddd;
	transform-origin: 0 0;
	transform: scaleY(0.5);
	z-index: 1;
}
.y-cells:after {
	content: ' ';
	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
	height: 1px;
	border-bottom: 1px solid #ddd;
	color: #ddd;
	transform-origin: 0 100%;
	transform: scaleY(0.5);
	z-index: 1;
}
// .y-cells__title {
// 	margin-top: 0.77em;
// 	margin-bottom: 0.3em;
// 	padding-left: 15px;
// 	padding-right: 15px;
// 	color: #999999;
// 	font-size: 14px;
// }
// .y-cells__title + .y-cells {
// 	margin-top: 0;
// }
// .y-cells__tips {
// 	margin-top: 0.3em;
// 	color: #999999;
// 	padding-left: 15px;
// 	padding-right: 15px;
// 	font-size: 14px;
// }
</style>
