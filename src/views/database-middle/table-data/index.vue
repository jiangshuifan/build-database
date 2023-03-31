<template>
  <div style="height: 100%;overflow: auto;">
    <Table style="height: 100%;" :columns="columns" :table-data="[]"></Table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import Table from "../../components/table.vue"
import { getTableColumns } from "../../utils/func"

import { useRouter } from "vue-router"
//pinia
import { useDBStore } from "../../store"

const store = useDBStore()
const $router = useRouter()

const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)
const dbInd = store.database.findIndex(db => {
  return db.id === databaseId
})
const tableName: string = $router.currentRoute.value.params.table as string
const columns = ref(getTableColumns([]))

</script>

<style scoped></style>
