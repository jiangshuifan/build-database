<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column v-for="column in columns" header-align="center" align="center" :prop="column.field"
      :label="column.title" />
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

<style scoped></style>