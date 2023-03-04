<template>
  <el-dialog v-model="visible" title="Tips" width="40%" :before-close="handleClose">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.field"
        :label="column.title" />
      <el-table-column header-align="center" align="center">
        <template #default>

        </template>
      </el-table-column>
    </el-table>
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
import { ElMessageBox } from 'element-plus';
import { columnItem } from "../database"

const { value = false, tableData = [] } = defineProps<{
  value?: Boolean,
  tableData?: any[],
  columns: columnItem[]
}>()
const emits = defineEmits(['close', 'save'])

const data = reactive({
  visible: value,
})
const { visible } = toRefs(data)

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
  emits('save', { data: '' })
}
</script>

<style scoped></style>