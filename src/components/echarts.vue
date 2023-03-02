<template>
  <div ref="echart" style="width: 100%;height:100%"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from "vue"
let echart: null | HTMLElement = ref(null).value
let chart
let $echarts = getCurrentInstance()?.appContext.config.globalProperties.$echarts

const { option } = defineProps<{
  option: any
}>()

onMounted(() => {
  chart = $echarts.init(echart);
  chart.setOption(option)

  chart.on('click', function (params: any) {
    console.log(params.data);
  });
  echart?.addEventListener('scroll', (e) => {
    e.stopPropagation()
    e.preventDefault()
  })
})
</script>

<style scoped></style>