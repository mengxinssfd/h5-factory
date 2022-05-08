import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { createVuePlugin } from 'vite-plugin-vue2'

const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 单独打包组件的配置
  const buildComponents = {
    lib: {
      entry: resolve(__dirname, 'src/components/index.js'),
      name: 'components',
      fileName: (format) => `components.${format}.js`,
      formats: ['umd']
    },
    // 把css打包到js里面
    // fixme 注意：目前有个bug，umd的css的结尾和js混到一起去了，需要手动分开
    cssCodeSplit: true,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      // external: ['vue'],
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      globals: {
        vue: 'Vue'
      },
      plugins: []
    },
    sourcemap: false
  }
  return {
    plugins: [
      createVuePlugin(),
      {
        ...visualizer({ filename: 'dist/analyze.html' }),
        apply(config, { mode }) {
          return mode === 'analyze'
        }
      }
    ],
    build: mode === 'components' ? buildComponents : {
      lib: {
        entry: resolve(__dirname, 'src/main.js'),
        name: 'main',
        fileName: (format) => `main.${format}.js`,
        formats: ['umd']
      },
      sourcemap: false
    },
    esbuild: {
      // 移除console, debugger; 只会在build下去除
      drop: ['console', 'debugger']
    },
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      // port: 3000,
      open: false, // 自动打开
      base: './ ' // 生产环境路径
    }
  }
})
