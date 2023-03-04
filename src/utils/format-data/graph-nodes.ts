import { DatabaseTable } from '../../database'
interface iGraph {
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
        name: 'Les Miserables',
        type: 'graph',
        layout: 'none',
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        draggable: false,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}'
        },
        labelLayout: {
          hideOverlap: true
        },
        scaleLimit: {
          min: 0.4,
          max: 2
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        }
      }
    ]
  }
}
export const getGraphNodes = function (tables: DatabaseTable[], radius: number = 15) {
  let instance = 0
  const target: iGraph = {
    nodes: [],
    links: [],
    categories: []
  }
  tables.forEach((v, ind) => {
    let i = 0
    let centerId = instance + i
    let fieldsNum = v.fields.length
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

    v.fields.forEach((field, i) => {
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
  return target
}