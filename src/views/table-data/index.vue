<template>
  <div>
    <Table :columns="columns" :table-data="tbData"></Table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import Table from "../../components/table.vue"
import { getTableColumns } from "../../utils/func"

import { useRouter } from "vue-router"
//pinia
import { useDBStore } from "../../store"
import { storeToRefs } from "pinia"


const store = useDBStore()
const $router = useRouter()

const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)
const dbInd = store.database.findIndex(db => {
  return db.id === databaseId
})
const tableName: string = $router.currentRoute.value.params.table as string
const tbInd = store.database[dbInd].tables.findIndex(tb => {
  return tb.name === tableName
})
const table = store.database[dbInd].tables[tbInd]
const columns = ref(getTableColumns(table.fields))
const tbData = table.data
</script>

<style scoped></style>