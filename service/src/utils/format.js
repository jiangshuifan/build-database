const formatReturn = (success, data) => {
  return {
    success,
    data
  }
}

const formatDic = (arr, reflect) => {
  let init = { id: 'id', label: "label", value: 'value', children: 'children' }
  if (reflect) {
    reflect = Object.assign(init, reflect)
  } else {
    reflect = init
  }
  let target = arr.map(item => {
    let v = { id: item[reflect.id], label: item[reflect.label], value: item[reflect.value] }
    if (Object.hasOwn(item, 'children')) {
      v.children = formatDic(item.children, reflect)
    }
    return v
  })
  return target
}

module.exports = {
  formatReturn, formatDic
}