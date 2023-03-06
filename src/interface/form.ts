import { dbField } from "../database"

export interface formConfigItem {
  eType: 'input' | 'date-picker' | 'select' | 'time-picker' | 'switch' | 'checkbox' | 'radio' | 'cascader',
  field: string,
  props?: { [property: string]: any },
  data?: any[],
  dic?: string,
  requestParams?: { [property: string]: any },
  'property-reflect'?: {
    [property: string]: any
  },
  [property: string]: any
}


export class formConfig {
  initDBConfig: formConfigItem[] = [
    { eType: 'input', field: 'dbName', label: '数据库名称', props: { placeholder: "输入数据库名称" } },
    {
      eType: 'select', field: 'dbType', label: '数据库类型', data: formatFieldArrToDic(['Postgres', 'MySQL', 'MariaDB', 'SQLite', 'MicrosoftSQLServe']), props: { placeholder: "选择数据库类型" }
    },
    { eType: 'radio', field: 'isPrivate', label: '是否加密', data: formatFieldArrToDic(['true', 'false']) },
    { eType: 'input', field: 'password', label: '密码', props: { placeholder: "输入数据库名称" } },
  ]
  initTableConfig: formConfigItem[] = [
    { eType: 'input', field: 'tbName', label: '表格名称', props: { placeholder: "输入表格名称" } },
  ]
  initFieldsConfig: formConfigItem[] = [
    { eType: 'input', field: 'field', label: '字段名称', props: { placeholder: "输入字段名称" } },
    { eType: 'input', field: 'fdName', label: '备注', props: { placeholder: "输入备注名" } },
    {
      eType: 'select', field: 'fdType', dic: "/dic/field-types", requestParams: {
        type: 'mysql'
      }, label: '类型', props: { placeholder: "选择字段类型" }
    },
    { eType: 'radio', field: 'isMarjorKey', label: '是否为主键', data: [{ id: 1, value: true, label: '是' }, { id: 0, value: false, label: '否' }] },
    { eType: 'radio', field: 'isForeignKey', label: '是否为外键', data: [{ id: 1, value: true, label: '是' }, { id: 0, value: false, label: '否' }], props: { placeholder: "输入备注名" } },
  ]
  selectedTableData: dbField[] = []
}

const formatFieldArrToDic = function (array: any) {
  return array.reduce((prev: any, v: any) => {
    prev.push({ id: v, value: v, label: v })
    return prev
  }, [])
} 