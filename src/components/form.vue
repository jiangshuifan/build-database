<template>
  <el-dialog v-model="visible" title="Tips" @open="() => handleOpenDialog()" width="40%" :before-close="handleCancel">
    <el-form v-model="fields">
      <el-form-item v-for="item in formConfig" :label="item.label">
        <el-input v-if="item.eType === 'input'" v-model="fields[item.field]" v-bind="item.props" />
        <el-select v-else-if="item.eType === 'select'" v-model="fields[item.field]" v-bind="item.props">
          <el-option v-for="option in item.data" :label="option.label" :value="option.value" />
        </el-select>
        <el-date-picker v-else-if="item.eType === 'date-picker'" v-model="fields[item.field]" v-bind="item.props"
          type="date" placeholder="Pick a date" style="width: 100%" />
        <el-time-picker v-else-if="item.eType === 'time-picker'" v-model="fields[item.field]" v-bind="item.props"
          placeholder="Pick a time" style="width: 100%" />
        <el-switch v-else-if="item.eType === 'switch'" v-model="fields[item.field]" v-bind="item.props" />
        <el-checkbox-group v-else-if="item.eType === 'checkbox'" v-model="fields[item.field]" v-bind="item.props">
          <el-checkbox v-for="option in item.data" :label="option.label" :name="option.value" />
        </el-checkbox-group>
        <el-radio-group v-else-if="item.eType === 'radio'" v-model="fields[item.field]" v-bind="item.props">
          <el-radio v-for="option in item.data" :label="option.value">{{ option.label }}</el-radio>
        </el-radio-group>
        <el-cascader v-else="item.eType === 'cascader'" v-model="fields[item.field]" v-bind="item.props" :options="[]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { toRefs, reactive, watch, computed } from "vue"
import { deepClone } from "../utils/func";
import request from "../utils/request"

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


let props = withDefaults(defineProps<{
  value?: boolean,
  config?: formConfigItem[],
  type?: 'add' | 'edit',
  data?: { [property: string]: any },
  requestType?: 'get' | 'post',
  reflectDicProp?: {
    id: string,
    value: string,
    label: string
  }
}>(), {
  value: false,
  type: 'add',
  data: () => { return {} },
  config: () => { return [] },
  requestType: 'post',
  reflectDicProp: () => {
    return {
      id: 'id',
      value: 'value',
      label: 'label'
    }
  }
})



const getFieldObject = function (array: any, field: string) {
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
//最初没有将fieldsObject设置为响应式，导致响应式丢失,但使用computed会无法直接修改值
let fieldsObject = reactive(getFieldObject(props.config, 'field'))
const handleOpenDialog = function () {
  if (props.type === "edit") {
    Object.keys(props.data).forEach(property => {
      fieldsObject[property] = props.data[property]
    })
  }
}
const reactiveData = reactive({
  visible: props.value,
  formConfig: props.config,
  fields: fieldsObject
})
//转为字典格式
const formatDataArrToDic = function (array: { [property: string]: any }[], propertyReflect: { [property: string]: any }) {
  console.log(array)
  return array.reduce((prev: { [property: string]: any }[], v: { [property: string]: any }) => {
    prev.push({ id: v[propertyReflect.id], value: v[propertyReflect.value], label: v[propertyReflect.label] })
    return prev
  }, [])
}
//获取字典数据
const getWholeConfig = async function (data: formConfigItem[]) {
  let target: formConfigItem[] = []
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let res: any
    if (Object.hasOwn(item, 'dic')) {
      if (Object.hasOwn(item, 'requestParams')) {
        res = await request[props.requestType](item.dic as string, item.requestParams)
      } else {
        res = await request[props.requestType](item.dic as string)
      }
      if (Object.hasOwn(item, 'property-reflect')) {
        item.data = formatDataArrToDic(res, item['property-reflect'] as { [property: string]: any })
      } else {
        item.data = formatDataArrToDic(res, props.reflectDicProp)
      }
    }
    else if (Object.hasOwn(item, 'data')) {//直接以数组显示传入
      res = item.data
      if (Object.hasOwn(item, 'property-reflect')) {
        item.data = formatDataArrToDic(res, item['property-reflect'] as { [property: string]: any })
      } else {
        item.data = formatDataArrToDic(res, props.reflectDicProp)
      }
    }
    target.push(item)
  }
  reactiveData.formConfig = target
}

getWholeConfig(props.config)

const { visible, formConfig, fields } = toRefs(reactiveData)
const emits = defineEmits(['close', 'save'])

const handleCancel = function () {
  emits('close')
  formInit()
}
const handleConfirm = function () {
  const res = deepClone(reactiveData.fields)
  emits('save', res)
  formInit()
}
const formInit = function () {
  let init = getFieldObject(props.config, 'field')
  Object.keys(init).forEach(property => {
    fieldsObject[property] = init[property]
  })
}
</script>

<style lang="scss" scoped></style>