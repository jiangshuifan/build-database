<template>
  <div class="form-box">
    <el-form ref="form" class="form-body" v-model="fields" v-bind="props.props">
      <el-form-item v-for="item in formConfig" :label="item.label">
        <el-input v-if="item.eType === 'input'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props" />
        <el-select v-else-if="item.eType === 'select'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props">
          <el-option v-for="option in item.data" :label="option.label" :value="option.value" />
        </el-select>
        <el-date-picker v-else-if="item.eType === 'date-picker'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props" placeholder="Pick a date" style="width: 100%" />
        <el-time-picker v-else-if="item.eType === 'time-picker'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props" placeholder="Pick a time" style="width: 100%" />
        <el-switch v-else-if="item.eType === 'switch'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props" />
        <el-checkbox-group v-else-if="item.eType === 'checkbox'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props">
          <el-checkbox v-for="option in item.data" :label="option.label" :name="option.value" />
        </el-checkbox-group>
        <el-radio-group v-else-if="item.eType === 'radio'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props">
          <el-radio v-for="option in item.data" :label="option.value">{{ option.label }}</el-radio>
        </el-radio-group>
        <el-cascader v-else-if="item.eType === 'cascader'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" v-bind="item.props" :options="item.data" />
        <el-tree-select v-else="item.eType === 'tree-select'" :disabled="computedConditions[`disable${item.field}`]"
          v-model="fields[item.field]" :data="item.data" />
      </el-form-item>
    </el-form>
    <div>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, ref, computed, nextTick } from "vue"
import { deepClone } from "../utils/func";
import request from "../utils/request"
import { formConfigItem } from "../interface/form"

let form = ref()


let props = withDefaults(defineProps<{
  config?: formConfigItem[],
  type?: 'add' | 'edit',
  data?: { [property: string]: any },
  requestType?: 'get' | 'post',
  reflectDicProp?: {
    id: string,
    value: string,
    label: string
  },
  initData?: { [property: string]: any },
  props?: { [property: string]: any },
}>(), {
  type: 'add',
  data: () => { return {} },
  config: () => { return [] },
  requestType: 'post',
  reflectDicProp: () => {
    return {
      id: 'id',
      value: 'value',
      label: 'label',
      children: 'children'
    }
  },
  initData: undefined
})

const computedConditions = reactive<{
  [prop: string]: any
}>({})

//拿到form数据对象的方法
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
formInit(props.initData)

//页面响应式数据
const reactiveData = reactive({
  formConfig: props.config,
  fields: fieldsObject
})
//转为字典格式
const formatDataArrToDic = function (array: { [property: string]: any }[], propertyReflect: { [property: string]: any }) {
  if (array.length > 0) {
    let dicList = array.reduce((prev: { [property: string]: any }[], v: { [property: string]: any }) => {
      let target: any = { id: v[propertyReflect.id], value: v[propertyReflect.value], label: v[propertyReflect.label] }
      if (Object.hasOwn(v, 'children') && v.children.constructor === Array) {
        target.children = formatDataArrToDic(v.children, propertyReflect)
      }
      prev.push(target)
      return prev
    }, [])
    return dicList
  } else {
    return []
  }
}
//获取字典数据
const getWholeConfig = async function (data: formConfigItem[]) {
  let target: formConfigItem[] = []
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let res: any
    if (Object.hasOwn(item, 'dic')) {
      if (Object.hasOwn(item, 'requestParams')) {
        res = (await request[props.requestType](item.dic as string, item.requestParams)).data
      } else {
        res = (await request[props.requestType](item.dic as string)).data
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
    if (Object.hasOwn(item, 'appearWhen')) {
      let FieldName = item.field
      computedConditions[`disable${FieldName}`] = computed(() => {
        let condition = item.appearWhen
        let num = 0
        for (let prop in condition) {
          if (Object.hasOwn(reactiveData.fields, prop) && condition[prop] !== reactiveData.fields[prop]) {
            num += 1
            if (props.initData !== undefined) {
              reactiveData.fields[FieldName] = props.initData[FieldName]
            } else {
              reactiveData.fields[FieldName] = ''
            }
          }
        }
        return num !== 0
      })
    }
    if (Object.hasOwn(item, 'requiredWhen')) {
      let FieldName = item.field
      computedConditions[`required${FieldName}`] = computed(() => {
        let condition = item.requiredWhen
        let num = 0
        for (let prop in condition) {
          if (Object.hasOwn(reactiveData.fields, prop) && condition[prop] !== reactiveData.fields[prop]) {
            num += 1
            if (props.initData !== undefined) {
              reactiveData.fields[FieldName] = props.initData[FieldName]
            } else {
              reactiveData.fields[FieldName] = ''
            }
          }
        }
        return num !== 0
      })
    }
    target.push(item)
  }
  reactiveData.formConfig = target
}

getWholeConfig(props.config)


const { formConfig, fields } = toRefs(reactiveData)
const emits = defineEmits(['close', 'save'])

const handleCancel = function () {
  emits('close')
  formInit(props.initData)
}
const handleConfirm = function () {
  const res = deepClone(reactiveData.fields)
  emits('save', res)
  formInit(props.initData)
}
function formInit(data?: { [prop: string]: any }) {
  let init = getFieldObject(props.config, 'field')
  Object.keys(init).forEach(property => {
    fieldsObject[property] = init[property]
  })
  if (data) {
    Object.keys(data).forEach(property => {
      fieldsObject[property] = data[property]
    })
  }
}


const handleInit = async function (data?: { [prop: string]: any }) {
  await nextTick()
  if (props.type === "edit") {
    Object.keys(props.data).forEach(property => {
      fieldsObject[property] = props.data[property]
    })
  } else {
    formInit(props.initData)
  }
}
defineExpose({
  init: handleInit
})
</script>

<style lang="scss" scoped>
$color: #919397;

.el-form {
  :deep(.el-form-item) {
    flex-direction: column;
    margin-bottom: 10px;

    .el-form-item__label {
      justify-content: flex-start;
      font-weight: bold;
    }

    .el-input__wrapper,
    .el-textarea__inner {
      border-radius: 0;

      &.is-focus {
        box-shadow: 0 0 0 1px $color inset !important;
      }
    }

    .el-textarea__inner:focus {
      box-shadow: 0 0 0 1px $color inset !important;
    }

    .is-focus .el-input__wrapper {
      box-shadow: 0 0 0 1px $color inset !important;
    }

    .el-radio__input.is-checked {
      & .el-radio__inner {
        border-color: $color;
        background-color: $color;
      }

      &+.el-radio__label {
        color: $color;
        font-weight: bold;
      }
    }
  }
}

.form-box {
  display: flex;
  flex-direction: column;
  height: 100%;

  .form-body {
    flex: 1;
    overflow: auto;
  }
}
</style>