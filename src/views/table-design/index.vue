

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header style="display:flex;align-items:center">
      <el-button @click="() => { handleOpenDialog('add') }">新建字段</el-button>
    </el-header>
    <el-main style="flex: 1;">
      <el-table :data="selectedTableData" style="width: 100%">
        <el-table-column v-for="column in tableFieldColumnList" header-align="center" align="center" :prop="column.field"
          :label="column.title"></el-table-column>
        <el-table-column header-align="center" align="center">
          <template #default="scoped">
            <el-button @click="() => { handleOpenDialog('edit', scoped.row) }" text><el-icon>
                <Edit />
              </el-icon></el-button>
            <el-button @click="() => {
              handleRemoveField(scoped.row.field)
            }" text><el-icon>
                <DeleteFilled />
              </el-icon></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
  <Form v-model="showFieldDialog" @close="() => { showFieldDialog = false }" :type="pageData.formType"
    :data="pageData.formData" @save="handleSave" :config="initFieldsConfig">
  </Form>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue"
import { getFieldTypes } from "../../api/index"
import { DatabaseTable, dbField, tableFieldColumnList } from '../../database'
import { formConfigItem, formConfig } from "../../interface/form"
import Form from "../../components/form.vue"


import { useRouter } from "vue-router"
//pinia
import { useDBStore } from "../../store"
import { storeToRefs } from "pinia"


interface pageInterface {
  formType: 'add' | 'edit',
  formData: { [property: string]: any }
}

const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {}
})

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

const data = reactive(new formConfig())
data.initFieldsConfig.forEach(field => {

})
data.selectedTableData = store.database[dbInd].tables[tbInd].fields
let { initTableConfig, initFieldsConfig, selectedTableData } = toRefs(data)

let showFieldDialog = ref(false)

const handleSave = function (params: any) {
  if (pageData.formType === "edit") {
    store.database[dbInd].tables[tbInd].fields.forEach((field, index, target: any) => {
      if (field.field === params.field) {
        Object.keys(params).forEach((key) => {
          target[index][key] = params[key]
        })
      }
    })
  } else {
    store.database[dbInd].tables[tbInd].fields.push(params)
  }

  showFieldDialog.value = false
}

const handleOpenDialog = function (type: "add" | "edit", data?: any) {
  showFieldDialog.value = true
  pageData.formType = type
  if (type === "edit") {
    pageData.formData = data
  }
}

const handleRemoveField = function (field: string) {
  store.database[dbInd].tables[tbInd].fields.forEach((fieldObj, index, target) => {
    if (fieldObj.field === field) {
      target.splice(index, 1)
    }
  })
} 
</script>
<style lang="scss" scoped>
.database-card {
  width: 300px;
  display: inline-block;

  :deep(.el-card__body) {
    padding: 0
  }

  .card-header {
    display: flex;
  }

  .card-field {
    padding: 10px 20px;
    display: flex;
    align-items: center;

    &:hover {
      background-color: rgb(219, 219, 219);
    }
  }
}
</style>
