

<template>
  <div class="relation-container">
    <div class="area-1"></div>
    <div class="area-2"></div>
    <div class="area-3">
      <div class="echart" ref="echart" style="height:100%;width:100%"></div>
    </div>
    <div class="area-4"></div>
    <div class="area-5"></div>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from "vue"
// import Demo from "./demo.vue"
import { outPutOption, getGraphNodes, iGraph, getVisibleNodes, getFieldList } from "../../utils/format-data/graph-nodes"
import { getTableFieldNodes } from "../../api/table"
import { getTableFieldRelation } from "../../api/database"
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
  let graphNodes = getGraphNodes((await getTableFieldNodes(databaseId)).data)
  let tableFieldRelation = (await getTableFieldRelation(databaseId)).data

  let indexReflect = graphNodes.reflect
  initData = graphNodes.option
  tableFieldRelation.forEach((relation) => {
    initData.links.push({
      source: indexReflect[relation.foreignKeyField],
      target: indexReflect[relation.marjorkeyField],
    })
  })
  let option = outPutOption(initData)
  let categories = getFieldList(initData.categories, 'name')
  let links = initData.links
  //可以理解为绘制
  chart.setOption(option)
  let colors = chart.getOption().color
  //拖拽点
  setInvisibleDragableNodes(option.series[0].nodes)


  chart.on('legendselectchanged', function (params: any) {
    let nodes = getVisibleNodes(option.series[0].nodes, params.selected)
    let { inVisibleNodes, visibleNodes } = nodes
    setInvisibleDragableNodes(visibleNodes)
    setInvisibleDragableNodes(inVisibleNodes, true)
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
  function setInvisibleDragableNodes(nodes: any, invisible: boolean = false) {
    let graphicOption = {
      graphic: $echarts.util.map(nodes, function (item: any) {
        let categoryInd = categories.indexOf(item.category)
        let color = colors[categoryInd % (colors.length)] + '66'
        //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
        var tmpPos = chart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
        console.log(invisible)
        return {
          type: 'circle',
          id: item.id,
          x: tmpPos[0],
          y: tmpPos[1],
          shape: {
            r: item.symbolSize / 2
          },
          style: {
            fill: color
          },
          // silent:true,
          invisible: invisible,
          draggable: true,
          ondragend: function () {
            onPointDragging(item.id, [this.x, this.y])
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
            showTooltip(item.id);
          },
          onmouseout: function () {
            hideTooltip(item.id);
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
<style lang="scss" scoped>
.relation-container {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 1fr auto 1fr
}

.area-1 {
  grid-area: 1/1/3/2;
}

.area-2 {
  grid-area: 1/2/2/4;
}

.area-3 {
  width: 800px;
  height: 540px;
  padding: 20px;
  background-color: #fff;
}

.area-4 {
  grid-area: 3/1/4/3;
}

.area-5 {
  grid-area: 2/3/4/4;
}
</style>
