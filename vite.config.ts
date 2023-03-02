import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"
//gzip压缩
import viteCompression from "vite-plugin-compression"
//兼容浏览器
import legacy from "@vitejs/plugin-legacy"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  legacy({
    targets: ['chrome 52'],
    additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    renderLegacyChunks: true,
    polyfills: [
      'es.symbol',
      'es.array.filter',
      'es.promise',
      'es.promise.finally',
      'es/map',
      'es/set',
      'es.array.for-each',
      'es.object.define-properties',
      'es.object.define-property',
      'es.object.get-own-property-descriptor',
      'es.object.get-own-property-descriptors',
      'es.object.keys',
      'es.object.to-string',
      'web.dom-collections.for-each',
      'esnext.global-this',
      'esnext.string.match-all'
    ]
  }),
  viteCompression({
    threshold: 800000 // 对大于 800kb 的文件进行压缩
  })

  ],
  resolve: {
    alias: {
      "@": path.resolve("./src")// @代替src
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  build: {
    target: 'es2015'
  }
})
