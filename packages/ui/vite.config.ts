import { dirname, resolve, join } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        // tsconfigPaths(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        }),
        vue(),
        vueJsx(),
        legacy({
            targets: ['> 1%', 'not IE 11', 'not op_mini all']
        })
    ],
    base: process.env.ELECTRON === 'true' ? './' : '/',
    build: {
        outDir: './dist',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // @ts-expect-error
                        const [, module] =
                            /node_modules\/(@?[a-z0-9-]+?[a-z0-9-]+)/.exec(id)
                        const url = join(
                            process.cwd(),
                            'node_modules',
                            module,
                            'package.json'
                        )
                        if (
                            [
                                'axios',
                                'axios-ex',
                                'dayjs',
                                'lodash-es',
                                'qs',
                                'uuid',
                                // 'vue',
                                // 'vue-router',
                                // 'vuex',
                                // 'vue-demi',
                                'element-plus',
                                'xterm'
                            ].includes(module) &&
                            existsSync(url)
                        ) {
                            try {
                                const { version } = require(url)
                                return `vendor/${module}_${version}.js`
                            } catch {
                                console.info('none')
                            }
                        }
                    }
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            gitmars: resolve(__dirname, 'node_modules/gitmars'),
            'socket.io-client': 'socket.io-client/dist/socket.io.js'
        }
    },
    server: {
        proxy: {
            '/jar/': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true,
                rewrite: url => url.replace(/^\/jar\//, '/')
            }
        },
        fs: { allow: ['..'] },
        cors: true,
        host: true,
        port: 8888
    },
    optimizeDeps: {
        include: ['socket.io-client']
        // esbuildOptions: {
        //     plugins: [esbuildCommonjs()]
        // }
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    green: '#17c0ae',
                    blue: '#409eff',
                    orange: '#fe703f',
                    red: ' #ef4f4f',
                    black: 'rgb(48, 49, 51)',
                    gray: '#909399',
                    primary: '#409eff', // 全局主色
                    link: '#fff', // 链接色
                    success: '#67c23a', // 成功色
                    warning: '#e6a23c', // 警告色
                    error: ' #ef4f4f', // 错误色
                    'font-size': '14px', // 主字号
                    heading: 'rgba(255, 255, 255, 0.85)', // 标题色
                    'font-color': '#5a5a5a', // 主文本色
                    'font-color-secondary': 'rgba(255, 255, 255, 0.45)', // 次文本色
                    disabled: 'rgba(255, 255, 255, 0.25)', // 失效色
                    'border-radius': '4px', // 组件/浮层圆角
                    'border-color': '#ebeef5', // 边框色
                    'box-shadow': '0 2px 8px rgba(255, 255, 255, 0.15)' // 浮层阴影
                    // hack: `true; @import "assets/css/var.less";`,
                },
                javascriptEnabled: true
            }
            // scss: {
            // 	additionalData: '@import "src/assets/styles/vars.scss";',
            // }
        }
    }
})
