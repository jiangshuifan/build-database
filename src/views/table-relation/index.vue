

<template>
  <div style="height:100%;width:100%">
    <div class="echart" ref="echart" style="width: 100%;height:100%"></div>
    <!-- <Demo></Demo> -->
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from "vue"
// import Demo from "./demo.vue"
import { outPutOption, getGraphNodes, iGraph } from "../../utils/format-data/graph-nodes"
import { getTableFieldRelation } from "../../api/table"
import { useRouter } from "vue-router"

const $router = useRouter()
const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)

let initData: iGraph = {
  nodes: [],
  links: [],
  categories: []
}


let echart: null | HTMLElement = ref(null).value
let chart: any
let $echarts = getCurrentInstance()?.appContext.config.globalProperties.$echarts
onMounted(async () => {
  chart = $echarts.init(echart);
  initData = getGraphNodes((await getTableFieldRelation(databaseId)).data)
  let option = outPutOption(initData)
  //可以理解为绘制
  chart.setOption(option)
  //点击事件
  chart.on('click', function (params: any) {
    console.log(params.data);
  });
  chart.on('graphRoam', updatePosition);
  //看不见的拖拽点
  chart.setOption({
    graphic: $echarts.util.map(option.series[0].data, function (item: any, dataIndex: any) {
      //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
      var tmpPos = chart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
      return {
        type: 'circle',
        id: dataIndex,
        x: tmpPos[0],
        y: tmpPos[1],
        shape: {
          r: item.symbolSize / 2
        },
        // silent:true,
        invisible: true,
        draggable: true,
        ondrag: function () {
          onPointDragging(dataIndex, [this.x, this.y])
        },
        onmouseover: function () {
          showTooltip(dataIndex);
        },
        onmouseout: function () {
          hideTooltip(dataIndex);
        },
        z: 100              //使图层在最高层
      };
    })
  });

  window.addEventListener('resize', updatePosition);

  //#region  tooltip
  function showTooltip(dataIndex: number) {
    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: dataIndex
    });
  }
  function hideTooltip(dataIndex: number) {
    chart.dispatchAction({
      type: 'hideTip'
    });
  }
  //#endregion


  function updatePosition() {    //更新节点定位的函数
    chart.setOption({
      graphic: $echarts.util.map(option.series[0].data, function (item: any, dataIndex: any) {
        var tmpPos = chart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
        return {
          x: tmpPos[0],
          y: tmpPos[1]
        };
      })
    });

  }
  async function onPointDragging(dataIndex: any, point: any) {      //节点上图层拖拽执行的函数
    // @ts-ignore
    var tmpPos = chart.convertFromPixel({ 'seriesIndex': 0 }, [point[0], point[1]]);
    let node = option.series[0].data[dataIndex]
    node.x = tmpPos[0];
    node.y = tmpPos[1];
    chart.setOption(option)
    updatePosition()
  }
})

</script>
<style lang="scss" scoped>
// :deep(.echart>div) {
//   width: 100% !important;
//   height: 100% !important;
// }
</style>
