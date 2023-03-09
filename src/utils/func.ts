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