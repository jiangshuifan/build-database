

<template>
  <div style="height:100%;width:100%">

    <div style="width:800px;height:600px">
      <div class="echart" ref="echart" style="height:100%;width:100%"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from "vue"
// import Demo from "./demo.vue"
import { outPutOption, getGraphNodes, iGraph, getVisibleNodes, getFieldList } from "../../utils/format-data/graph-nodes"
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
  let categories = getFieldList(initData.categories, 'name')
  let links = initData.links
  //可以理解为绘制
  chart.setOption(option)
  let colors = chart.getOption().color
  //拖拽点
  setInvisibleDragableNodes(option.series[0].nodes)


  chart.on('legendselectchanged', function (params: any) {
    let visibleNodes = getVisibleNodes(option.series[0].nodes, params.selected)
    setInvisibleDragableNodes(visibleNodes)
  });
  chart.on('graphRoam', updatePosition);


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
      graphic: $echarts.util.map(option.series[0].nodes, function (item: any, dataIndex: any) {
        var tmpPos = chart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
        return {
          x: tmpPos[0],
          y: tmpPos[1]
        };
      })
    });

  }
  //设置隐藏的可拖拽的点
  function setInvisibleDragableNodes(nodes: any) {
    let nodePosition: { [prop: string]: any } = {}
    let graphicOption = {
      graphic: $echarts.util.map(nodes, function (item: any, dataIndex: any) {
        let categoryInd = categories.indexOf(item.category)
        let color = colors[categoryInd % (colors.length)] + '66'
        //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
        var tmpPos = chart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
        nodePosition[item.id] = tmpPos
        return {
          type: 'circle',
          id: dataIndex,
          x: tmpPos[0],
          y: tmpPos[1],
          shape: {
            r: item.symbolSize / 2
          },
          style: {
            fill: color
          },
          // silent:true,
          invisible: false,
          draggable: true,
          ondragend: function () {
            onPointDragging(dataIndex, [this.x, this.y])
          },
          onclick: function () {
            if (item.name !== item.category) {
              console.log(item)
            }
          },
          // ondrag: function () {
          //   onPointDragging(dataIndex, [this.x, this.y])
          // },
          onmouseover: function () {
            showTooltip(dataIndex);
          },
          onmouseout: function () {
            hideTooltip(dataIndex);
          },
          z: 100              //使图层在最高层
        };
      })
    }
    chart.setOption(graphicOption)

    // links.forEach(link => {
    //   graphic.graphic.push({
    //     type: 'line',
    //     shape: {
    //       x1: nodePosition[link.source][0],
    //       y1: nodePosition[link.source][1],
    //       x2: nodePosition[link.target][0],
    //       y2: nodePosition[link.target][1],
    //     }
    //   })
    // })
    // console.log(graphic.graphic)
    // console.log($echarts.util)

  }
  async function onPointDragging(dataIndex: any, point: any) {      //节点上图层拖拽执行的函数
    var tmpPos = chart.convertFromPixel({ 'seriesIndex': 0 }, [point[0], point[1]]);
    let nodes = option.series[0].nodes
    let node = nodes[dataIndex]
    node.x = tmpPos[0];
    node.y = tmpPos[1];
    chart.setOption({
      series: {
        nodes: nodes
      }
    })
    updatePosition()
  }

})

</script>
<style lang="scss" scoped></style>
