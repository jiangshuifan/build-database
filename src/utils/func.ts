export const getFieldLists = function (array: any, field: any) {
  return array.reduce((preV: any, value: any) => { preV.push(value[field]); return preV }, [])
}

export const getFieldObject = function (array: any, field: string) {
  return array.reduce((preV: any, value: any) => {
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