<template>
	<div
		class="y-cell"
		:class="{ 'y-cell_access': isLink || !!link }"
		:style="
			cleanStyle({
				marginTop: $px2rem(gutter),
				padding: $px2rem(padding),
			})
		"
		@click="onClick"
	>
		<div class="y-cell-title">
			<div class="y-cell__hd">
				<slot name="icon"></slot>
			</div>
			<div class="y-cell__bd">
				<template v-if="title || $slots.title">
					<slot class="y-title" name="title">{{ title }}</slot>
				</template>
			</div>
			<div class="y-cell__ft" :class="valueClass">
				<slot name="value"></slot>
				<slot>{{ value }}</slot>
			</div>
		</div>
		<div class="y-cell-content" v-if="$slots.content">
			<slot name="content"></slot>
		</div>
	</div>
</template>

<script>
import mix from '../mix';
export default {
	name: 'y-cell',
	props: {
		title: String,
		isLink: Boolean,
		link: [String, Object],
		value: [String, Number, Array],
		gutter: [String, Number],
		padding: [String, Number],
		disabled: Boolean,
		arrowDirection: String,
	},
	mixins: [mix],
	data() {
		return {
			data: '',
		};
	},
	watch: {
		value(val) {
			if (this.data !== val) this.data = val;
		},
		data(val) {
			this.$emit('value', val);
		},
	},
	computed: {
		valueClass() {
			return {
				'y-cell-arrow-transition': !!this.arrowDirection,
				'y-cell-arrow-up': this.arrowDirection === 'up',
				'y-cell-arrow-down': this.arrowDirection === 'down',
			};
		},
	},
	methods: {
		onClick() {
			!this.disabled && this.go(this.link);
		},
		go(url) {
			if (!url) {
				this.$emit('on-click');
				return;
			}
			const useRouter = typeof url === 'object' || (this.$router && typeof url === 'string' && !/http/.test(url));
			if (useRouter) {
				if (typeof url === 'object' && url.replace === true) {
					this.$router.replace(url);
				} else {
					url === 'BACK' ? this.$router.go(-1) : this.$router.push(url);
				}
			} else {
				window.location.href = url;
			}
		},
	},
};
</script>

<style lang="less">
// .y-tap-active {
// 	tap-highlight-color: rgba(0, 0, 0, 0);
// 	user-select: none;
// }
// .y-tap-active:active {
// 	background-color: #ececec;
// }
.y-cell {
	background-color: #fff;
	width: 100%;
	padding: 10px 15px;
	position: relative;
}
.y-cell-title {
	display: flex;
	align-items: center;
	justify-content: stretch;
}
.y-cell-content {
	font-size: 14px;
	padding: 5px 0;
	color: #aaa;
}
.y-cell:before {
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
	left: 16px;
}
.y-cell:first-child:before {
	display: none;
}
// .y-cell_primary {
// 	align-items: flex-start;
// }
.y-cell__bd {
	flex: 1;
}
.y-cell__ft {
	text-align: right;
	color: #aaa;
}
.y-cell_access {
	-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	color: inherit;
}
.y-cell_access:active {
	background-color: #ececec;
}
.y-cell_access .y-cell__ft {
	padding-right: 16px;
	position: relative;
}
.y-cell_access .y-cell__ft:after {
	content: ' ';
	display: inline-block;
	height: 6px;
	width: 6px;
	border-width: 2px 2px 0 0;
	border-color: #c8c8cd;
	border-style: solid;
	transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
	position: relative;
	top: -2px;
	position: absolute;
	top: 50%;
	margin-top: -4px;
	right: 2px;
}
.y-cell__ft.y-cell-arrow-down:after {
	transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
}
.y-cell__ft.y-cell-arrow-up:after {
	transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
}
.y-cell-arrow-transition:after {
	transition: transform 300ms;
}

// .y-cell-justify {
// 	height: 1.5em;
// }
// .y-cell-justify.y-cell-justify:after {
// 	content: '.';
// 	display: inline-block;
// 	width: 100%;
// 	overflow: hidden;
// 	height: 0;
// }
// .y-cell-primary {
// 	flex: 1;
// }
</style>
