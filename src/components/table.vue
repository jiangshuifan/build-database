<template>
  <el-table class="table" border :data="tableData" style="width: 100%">
    <el-table-column :fixed="index === 0 ? true : undefined" v-for="(column, index) in columns" header-align="center"
      align="center" :prop="column.field" :label="column.title">
      <template #default="scoped">
        <el-input class="field-edit-input" v-model="scoped.row[column.field]"></el-input>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { toRefs, reactive } from "vue"
import { columnItem } from "../database"

const { tableData = [] } = defineProps<{
  tableData?: any[],
  columns: columnItem[]
}>()

</script>

<style lang="scss" scoped>
.table {
  :deep(.cell) {
    padding: 0;
  }
}

.field-edit-input {
  :deep(.el-input__wrapper) {
    border: none;
    box-shadow: none;

    .el-input__inner {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px #ff4444 inset;
    }
  }
}
</style>