<template>
  <div ref="echart" style="width: 100%;height:100%"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from "vue"
let echart: null | HTMLElement = ref(null).value
let chart: any
let $echarts = getCurrentInstance()?.appContext.config.globalProperties.$echarts

const { option, data } = defineProps<{
  option: any,
  data?: any
}>()
onMounted(() => {
  chart = $echarts.init(echart);
  chart.setOption(option)
  chart.setOption({
    // 声明一个 graphic component，里面有若干个 type 为 'circle' 的 graphic elements。
    // 这里使用了 echarts.util.map 这个帮助方法，其行为和 Array.prototype.map 一样，但是兼容 es5 以下的环境。
    // 用 map 方法遍历 data 的每项，为每项生成一个圆点。
    graphic: $echarts.util.map(data, function (dataItem: any, dataIndex: any) {
      return {
        // 'circle' 表示这个 graphic element 的类型是圆点。
        type: 'circle',

        shape: {
          // 圆点的半径。
          r: dataItem.symbolSize / 2
        },
        // 用 transform 的方式对圆点进行定位。position: [x, y] 表示将圆点平移到 [x, y] 位置。
        // 这里使用了 convertToPixel 这个 API 来得到每个圆点的位置，下面介绍。
        position: chart.convertToPixel('grid', dataItem),

        // 这个属性让圆点不可见（但是不影响他响应鼠标事件）。
        invisible: true,
        // 这个属性让圆点可以被拖拽。
        draggable: true,
        // 把 z 值设得比较大，表示这个圆点在最上方，能覆盖住已有的折线图的圆点。
        z: 100,
        // 此圆点的拖拽的响应事件，在拖拽过程中会不断被触发。下面介绍详情。
        // 这里使用了 echarts.util.curry 这个帮助方法，意思是生成一个与 onPointDragging
        // 功能一样的新的函数，只不过第一个参数永远为此时传入的 dataIndex 的值。
        ondrag: $echarts.util.curry(onPointDragging, dataIndex)
      };
    })
  });
  chart.on('click', function (params: any) {
    console.log(params.data);
  });


  initInvisibleGraphic()
  function initInvisibleGraphic() {
    // Add shadow circles (which is not visible) to enable drag.
    chart.setOption({
      graphic: $echarts.util.map(option.series[0].data, function (item: any, dataIndex: any) {
        //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
        var tmpPos = chart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
        return {
          type: 'circle',
          id: dataIndex,
          position: tmpPos,
          shape: {
            cx: 0,
            cy: 0,
            r: 20
          },
          // silent:true,
          invisible: true,
          draggable: true,
          ondrag: $echarts.util.curry(onPointDragging, dataIndex),
          z: 100              //使图层在最高层
        };
      })
    });
    window.addEventListener('resize', updatePosition);
    chart.on('dataZoom', updatePosition);
  }
  chart.on('graphRoam', updatePosition);
  function updatePosition() {    //更新节点定位的函数
    chart.setOption({
      graphic: $echarts.util.map(option.series[0].data, function (item: any, dataIndex: any) {
        var tmpPos = chart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
        return {
          position: tmpPos
        };
      })
    });

  }
  function onPointDragging(dataIndex: any) {      //节点上图层拖拽执行的函数
    // @ts-ignore
    var tmpPos = chart.convertFromPixel({ 'seriesIndex': 0 }, this.position);
    option.series[0].data[dataIndex].x = tmpPos[0];
    option.series[0].data[dataIndex].y = tmpPos[1];
    chart.setOption(option);
    updatePosition();
  }
})
</script>

<style scoped></style>