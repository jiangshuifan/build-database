<template>
  <el-dialog v-model="visible" title="Tips" width="40%" :before-close="handleCancel">
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
          <el-radio v-for="option in item.data" :label="option.label" />
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
import { getFieldObject } from "../utils/func"
import { formConfigItem } from "../interface/form"
let props = withDefaults(defineProps<{
  value?: boolean,
  config?: formConfigItem[],
  type?: 'add' | 'edit',
  data?: { [property: string]: any }
}>(), {
  value: false,
  type: 'add',
  data: () => { return {} },
  config: () => { return [] }
})
//最初没有将fieldsObject设置为响应式，导致响应式丢失,但使用computed会无法直接修改值
let fieldsObject = reactive(getFieldObject(props.config, 'field'))

watch(() => [props.type, props.data], () => {
  if (props.type === 'edit') {
    Object.keys(props.data).forEach(property => {
      fieldsObject[property] = props.data[property]
    })
  } else {
    let init = getFieldObject(props.config, 'field')
    Object.keys(init).forEach(property => {
      fieldsObject[property] = init[property]
    })
  }
  console.log(fieldsObject)
  console.log(reactiveData.fields)
})
const reactiveData = reactive({
  visible: props.value,
  formConfig: props.config,
  fields: fieldsObject
})
const { visible, formConfig, fields } = toRefs(reactiveData)
const emits = defineEmits(['close', 'save'])

const handleCancel = function () {
  emits('close')
}
const handleConfirm = function () {
  emits('save', reactiveData.fields)
}
</script>

<style lang="scss" scoped></style>