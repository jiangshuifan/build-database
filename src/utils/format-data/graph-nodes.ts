export interface tableRoot {
  name: string
  children: any[]
}

export interface iGraph {
  nodes: any[]
  links: any[]
  categories: any[]
}


export const outPutOption = function (graph: iGraph) {
  return {
    tooltip: {},
    legend: [
      {
        data: graph.categories.map(function (a) {
          return a.name;
        })
      }
    ],
    series: [
      {
        name: '',
        type: 'graph',
        layout: 'none',
        nodes: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: false,//空白处拖动
        draggable: false,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        scaleLimit: {
          min: 0.4,
          max: 2
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
      }
    ]
  }
}
export const getGraphNodes = function (tables: tableRoot[], radius: number = 15) {
  let instance = 0
  let nodeReflect: any = {}
  const target: iGraph = {
    nodes: [],
    links: [],
    categories: []
  }
  tables.forEach((v, ind) => {
    let i = 0
    let centerId = instance + i
    let fieldsNum = v.children.length
    let gap = 2 * Math.PI / fieldsNum
    let centerX = 50 * (Math.floor(ind % 4) + 1)
    let centerY = 50 * (Math.floor(ind / 4) + 1)

    const nodes = [
      {
        id: instance + i,
        name: v.name,
        symbolSize: 50,
        x: centerX,
        y: centerY,
        value: '',
        category: v.name
      }
    ]

    v.children.forEach((field, i) => {
      nodeReflect[field.id] = instance + i + 1
      nodes.push({
        id: instance + i + 1,
        name: field.field,
        symbolSize: 30,
        x: centerX + radius * Math.cos(gap * i),
        y: centerY + radius * Math.sin(gap * i),
        value: field.type,
        category: v.name
      })
      target.links.push({
        source: instance + i + 1,
        target: centerId
      })
    })
    target.nodes = target.nodes.concat(nodes)
    target.categories.push({
      name: v.name
    })
    instance += nodes.length
  })
  return {
    reflect: nodeReflect,
    option: target
  }
}


export const getVisibleNodes = function (nodes: any[], seleted: { [prop: string]: boolean }) {
  let inVisibleCategories: string[] = []//隐藏的类
  for (let category in seleted) {
    if (!seleted[category]) {
      inVisibleCategories.push(category)
    }
  }
  let visibleNodes: any[] = []
  let inVisibleNodes: any[] = []
  nodes.forEach(node => {
    inVisibleCategories.indexOf(node.category) === -1 ? visibleNodes.push(node) : inVisibleNodes.push(node)
  })
  return {
    visibleNodes, inVisibleNodes
  }
}

export const getFieldList = function (arr: any[], field: string): string[] {
  return arr.map(item => {
    return item[field]
  })
}

export const getLinks = function (arr: any[]) {

}