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
      preV[value[field]] = ''
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