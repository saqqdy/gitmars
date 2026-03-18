import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './style.css'

export default {
	extends: DefaultTheme,
	Layout: () => h(DefaultTheme.Layout)
} satisfies Theme
