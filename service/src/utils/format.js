const formatReturn = (success, data) => {
  return {
    success,
    data
  }
}
//对象数组转
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
//字符串数组转
const StringArrayToDic = (arr, reflect) => {
  let init = { id: 'id', label: "label", value: 'value', children: 'children' }
  if (reflect) {
    reflect = Object.assign(init, reflect)
  } else {
    reflect = init
  }
  let target = arr.map((item, index) => {
    let v = {}
    v[reflect.id] = index
    v[reflect.label] = item
    v[reflect.value] = item
    return v
  })
  return target
}
module.exports = {
  formatReturn, formatDic, StringArrayToDic
}