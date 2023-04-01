import { dbField } from '../database'
export const getFieldLists = function (array: any, field: any) {
  return array.reduce((preV: any, value: any) => { preV.push(value[field]); return preV }, [])
}

export const getFieldObject = function (array: any, field: string) {
  return array.reduce((preV: { [property: string]: any }, value: any) => {
    if (Object.hasOwn(preV, value[field])) {
      console.log(array, field, preV)
      throw new Error(`字段${field}重复`)
    } else {
      preV[value[field]] = undefined
    }
    return preV
  },
    {})
}


//由数据得到columns,当前项目可用
export const getTableColumns = function (array: dbField[]) {
  return array.reduce((preV: any, value: dbField) => {
    preV.push({
      field: value.field,
      title: value.name
    }); return preV
  }, [])
}

//深拷贝
export const deepClone = function (obj: any) {
  let objClone: any = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        //判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deepClone(obj[key]);
        } else {
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}
//随机颜色
export const randomColor = function (): number[] {
  let colorArray = [Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255)]
  let Indexzero = Math.floor(Math.random() * 3)
  let Index255 = (Indexzero + Math.ceil(Math.random() * 2)) % 3
  colorArray[Indexzero] = 0
  colorArray[Index255] = 255
  return colorArray
}

//随机打乱数组
export const randowArray = (arr: any[]) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    let middle = arr[j]
    arr[j] = arr[i]
    arr[i] = middle
  }
  return arr
}

//时间区段
export const getTimeSection = () => {
  let currentTime = new Date()
  let currentHour = currentTime.getHours()
  let text = ""
  if (currentHour >= 22 || currentHour < 5) {
    text = "深夜"
  } else if (currentHour >= 5 && currentHour < 8) {
    text = "早晨"
  } else if (currentHour >= 8 && currentHour < 12) {
    text = "上午"
  } else if (currentHour >= 12 && currentHour < 14) {
    text = "中午"
  } else if (currentHour >= 14 && currentHour < 17) {
    text = "下午"
  } else if (currentHour >= 17 && currentHour < 19) {
    text = "傍晚"
  } else if (currentHour >= 19 && currentHour < 22) {
    text = "晚上"
  }
  return text
}