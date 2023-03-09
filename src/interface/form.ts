import { Database, dbField } from "../database"

export interface formConfigItem {
  eType: 'input' | 'date-picker' | 'select' | 'time-picker' | 'switch' | 'checkbox' | 'radio' | 'cascader' | 'tree-select',
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

const Dic_TorF = [{ id: 1, value: 'true', label: '是' }, { id: 0, value: 'false', label: '否' }]
export class formConfig {
  selectedTableData: dbField[] = []
  initDBConfig: formConfigItem[] = [
    { eType: 'input', field: 'name', label: '数据库名称', props: { placeholder: "输入数据库名称" } },
    {
      eType: 'select', field: 'type', label: '数据库类型', data: formatFieldArrToDic(['Postgres', 'MySQL', 'MariaDB', 'SQLite', 'MicrosoftSQLServe']), props: { placeholder: "选择数据库类型" }
    },
    { eType: 'radio', field: 'isPrivate', label: '是否加密', data: Dic_TorF },
    { eType: 'input', field: 'password', label: '密码', props: { placeholder: "输入密码" } },
  ]
  initTableConfig: formConfigItem[] = [
    { eType: 'input', field: 'name', label: '表格名称', props: { placeholder: "输入表格名称" } },
  ]


}

const formatFieldArrToDic = function (array: any) {
  return array.reduce((prev: any, v: any) => {
    prev.push({ id: v, value: v, label: v })
    return prev
  }, [])
}

//#region 配置相关的函数
//field页面得到form表单配置数据
interface iFieldConfigForm {
  databaseId: string | number,
  tableId: string | number
}
export const getFieldFormConfig = function (prop: iFieldConfigForm): formConfigItem[] {
  return [
    { eType: 'input', field: 'field', label: '字段名称', props: { placeholder: "输入字段名称" } },
    { eType: 'input', field: 'name', label: '备注', props: { placeholder: "输入备注名" } },
    {
      eType: 'select', field: 'type', dic: "/dic/field-types", requestParams: {
        type: 'mysql'
      }, label: '类型', props: { placeholder: "选择字段类型" }
    },
    { eType: 'radio', field: 'isMarjorkey', label: '是否为主键', data: Dic_TorF },
    { eType: 'radio', field: 'isForeignkey', label: '是否为外键', data: Dic_TorF },
    {
      eType: "cascader", field: 'foreignKeys', label: '设置相关外键', dic: "/dic/table-fields", requestParams: {
        dbId: prop.databaseId,
        tbId: prop.tableId
      },
      props: {
        "show-all-levels": false,
        props: { multiple: true }
      }
    },
  ]
}

//#endregion