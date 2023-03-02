<template>
  <el-dialog v-model="visible" title="Tips" width="40%" :before-close="handleClose">
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
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { toRefs, reactive } from "vue"
import { getFieldObject } from "../utils/func"
import { ElMessageBox } from 'element-plus';
import { formConfigItem } from "../interface/form"

const { value = false, config = [] } = defineProps<{
  value?: Boolean,
  config?: formConfigItem[]
}>()
const fieldsObject = getFieldObject(config, 'field')
const data = reactive({
  visible: value,
  formConfig: config,
  fields: fieldsObject
})

const { visible, formConfig, fields } = toRefs(data)
const emits = defineEmits(['close', 'save'])

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
const handleCancel = function () {
  emits('close')
}
const handleConfirm = function () {
  emits('save', { data: data.fields })
}
</script>

<style lang="scss" scoped></style>