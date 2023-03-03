import { createApp } from 'vue'
import "normalize.css"
import './style.css'
import App from './App.vue'
//element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
//pinia
import { createPinia } from "pinia"
import router from './router'
import echarts from './utils/echarts'

const pinia = createPinia()
const app = createApp(App)
//vue3挂载全局变量
app.config.globalProperties.$echarts = echarts;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
  .use(router).use(pinia).mount('#app')
