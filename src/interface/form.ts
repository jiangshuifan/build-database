import { dbField } from "../database"

export interface formConfigItem {
  eType: 'input' | 'date-picker' | 'select' | 'time-picker' | 'switch' | 'checkbox' | 'radio' | 'cascader',
  field: string,
  props?: { [property: string]: any },
  data?: any[],
  [property: string]: any
}


export class formConfig {
  initDBConfig: formConfigItem[] = [{ eType: 'input', field: 'name', label: '数据库名称', props: { placeholder: "输入数据库名称" } }]
  initTableConfig: formConfigItem[] = [{ eType: 'input', field: 'name', label: '表格名称', props: { placeholder: "输入表格名称" } }]
  initFieldsConfig: formConfigItem[] = [
    { eType: 'input', field: 'field', label: '字段名称', props: { placeholder: "输入字段名称" } },
    { eType: 'input', field: 'name', label: '备注', props: { placeholder: "输入备注名" } },
    {
      eType: 'select', field: 'type', label: '类型', props: { placeholder: "选择字段类型" }
    }]
  selectedTableData: dbField[] = []
}
