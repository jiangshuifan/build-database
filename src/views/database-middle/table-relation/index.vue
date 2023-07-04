

<template>
  <div class="relation-container">
    <div style="height:80px;display: flex;align-items: center;justify-content: center;">
      <el-radio-group @change="handleChangeGraph" v-model="graphRadio.graphType">
        <el-radio-button v-for="graphItem in graphRadio.graphArray" :key="graphItem.id" :label="graphItem.value">{{
          graphItem.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="graph-area" ref="graph_container">
      <div v-if="graphRadio.graphType === GraphEnum.relation" class="graph-relation" style="height:100%;width:100%"></div>
      <div v-if="graphRadio.graphType === GraphEnum.er" class="graph-er" style="height:100%;width:100%"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from "vue"
// import Demo from "./demo.vue"
import { outPutOption, getGraphNodes, iGraph, getVisibleNodes, getFieldList, tableRoot } from "@/utils/format-data/graph-nodes"
import { Graph, Cell, Shape } from '@antv/x6'
import { getTableFieldNodes } from "@/api/table"
import { getTableFieldRelation, iTableFieldRelation } from "@/api/database"
import { useRouter } from "vue-router"

enum GraphEnum {
  'relation' = 1,
  'er' = 2
}
interface iGraphItem {
  id: number,
  label: string,
  value: GraphEnum
}

const graph_container = ref()
const graphRadio = reactive<{
  graphType: GraphEnum,
  graphArray: iGraphItem[]
}>({
  graphType: GraphEnum.relation,
  graphArray: [
    { id: 1, label: '关系图', value: GraphEnum.relation },
    { id: 2, label: 'ER图', value: GraphEnum.er },
  ]
})

const $router = useRouter()
const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)
let initData: iGraph = {
  nodes: [],
  links: [],
  categories: []
}

let $echarts = getCurrentInstance()?.appContext.config.globalProperties.$echarts

const loadRelationGraph = async () => {
  let container = graph_container.value as HTMLElement
  let echart = container.querySelector('.graph-relation')
  let chart = $echarts.init(echart);
  let graphNodes = getGraphNodes((await getTableFieldNodes(databaseId)).data)
  let tableFieldRelation = (await getTableFieldRelation(databaseId)).data

  let indexReflect = graphNodes.reflect
  initData = graphNodes.option
  tableFieldRelation.forEach((relation) => {
    initData.links.push({
      source: indexReflect[relation.foreignKeyField],
      target: indexReflect[relation.marjorKeyField],
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
          draggable: !invisible,
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

}

const handleChangeGraph = async (graphType: GraphEnum) => {
  await nextTick()
  if (graphType === GraphEnum.er) {
    loadErGraph()
  } else if (graphType === GraphEnum.relation) {
    loadRelationGraph()
  }
}
const loadErGraph = async () => {
  let graphNodes = (await getTableFieldNodes(databaseId)).data
  let tableFieldRelation = (await getTableFieldRelation(databaseId)).data
  console.log(graphNodes)
  console.log(tableFieldRelation)
  let container = graph_container.value as HTMLElement
  let x6Graph = container.querySelector('.graph-er') as HTMLElement
  const LINE_HEIGHT = 24
  const NODE_WIDTH = 150
  Graph.registerPortLayout(
    'erPortPosition',
    (portsPositionArgs) => {
      return portsPositionArgs.map((_, index) => {
        return {
          position: {
            x: 0,
            y: (index + 1) * LINE_HEIGHT,
          },
          angle: 0,
        }
      })
    },
    true,
  )
  Graph.registerNode(
    'er-rect',
    {
      inherit: 'rect',
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        rect: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#5F95FF',
        },
        label: {
          fontWeight: 'bold',
          fill: '#ffffff',
          fontSize: 12,
        },
      },
      ports: {
        groups: {
          list: {
            markup: [
              {
                tagName: 'rect',
                selector: 'portBody',
              },
              {
                tagName: 'text',
                selector: 'portNameLabel',
              },
              {
                tagName: 'text',
                selector: 'portTypeLabel',
              },
            ],
            attrs: {
              portBody: {
                width: NODE_WIDTH,
                height: LINE_HEIGHT,
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
                magnet: true,
              },
              portNameLabel: {
                ref: 'portBody',
                refX: 6,
                refY: 6,
                fontSize: 10,
              },
              portTypeLabel: {
                ref: 'portBody',
                refX: 95,
                refY: 6,
                fontSize: 10,
              },
            },
            position: 'erPortPosition',
          },
        },
      },
    },
    true,
  )

  const graph = new Graph({
    container: x6Graph,
    connecting: {
      router: {
        name: 'er',
        args: {
          offset: 25,
          direction: 'H',
        },
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
            },
          },
        })
      },
    },
  })
  const cells: Cell[] = []
  // data.forEach((item: any) => {
  //   if (item.shape === 'edge') {
  //     cells.push(graph.createEdge(item))
  //   } else {
  //     cells.push(graph.createNode(item))
  //   }
  // })
  graphNodes.forEach((graphNode: tableRoot,index) => {
    const point = graphNode.children.map(v => {
      return {
        "id": v.id,
        "group": "list",
        "attrs": {
          "portNameLabel": {
            "text": v.field
          },
          "portTypeLabel": {
            "text": v.type
          }
        }
      }
    })
    const tabelNode = {
      "id": graphNode.id+"",
      "shape": "er-rect",
      "label":graphNode.name,
      "width": 150,
      "height": 24,
      "position": {
        "x": 250*(index+1),
        "y": 210
      },
      "ports": point
    }
    cells.push(graph.createNode(tabelNode))
  })
  tableFieldRelation.forEach((graphEdge: iTableFieldRelation) => {
    console.log(graphEdge)
    const edgeNode =   {
    "shape": "edge",
    "source": {
      "cell": graphEdge.marjorKeyTable+'',
      "port": graphEdge.marjorKeyField+''
    },
    "target": {
      "cell": graphEdge.foreignKeyTable+'',
      "port": graphEdge.foreignKeyField+''
    },
    "attrs": {
      "line": {
        "stroke": "#A2B1C3",
        "strokeWidth": 2
      }
    },
    "zIndex": 0
  }
    cells.push(graph.createEdge(edgeNode))
  })
  graph.resetCells(cells)
  graph.zoomToFit({ padding: 10, maxScale: 1 })
}
onMounted(async () => {
  loadRelationGraph()
})

</script>
<style lang="scss" scoped>
.relation-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}


.graph-area {
  flex: 1;
  width: 800px;
  height: 540px;
  padding: 20px;
  margin: 0 auto;
  background-color: #fff;
}
</style>
