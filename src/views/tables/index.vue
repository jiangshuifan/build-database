

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header style="display:flex;align-items:center">
      <el-button @click="() => { handleOpenForm('add') }">新建表格</el-button>
      <el-button @click="handleGetFeildTypes">测试</el-button>
      <el-button @click="handleRedirectToCharts">表格关系</el-button>
    </el-header>
  <el-main style="flex: 1;">
    <!-- <el-card v-for="table in tables" class="database-card">
        <template #header>
          <div class="card-header">
            <span>{{ table.name }}</span>
            <el-button @click="() => { handleOpenTableFieldEditDialog(table.fields) }" style="margin-left:auto ;"
              text><el-icon>
                <Edit />
              </el-icon></el-button>
            <el-button @click="handleOpenFieldCreateDialog" text><el-icon>
                <Plus />
              </el-icon></el-button>
            <el-button text><el-icon>
                <DeleteFilled />
              </el-icon></el-button>
          </div>
        </template>
        <div v-for="field in table.fields" class="card-field">
          <div>{{ field.name }}</div>
          <div style="margin-left:auto">
            <el-button text><el-icon>
                <CloseBold />
              </el-icon></el-button>
            <el-button text><el-icon>
                <EditPen />
                                                                      </el-icon></el-button>
                                                                  </div>                                                                                                                      </el-card> -->
      <div v-for="table in tables" @click="() => { handleViewTable(table.name) }" class="table-item">
        <div>{{ table.name }}</div>
        <el-button @click.stop="() => { handleOpenTableDesign(table) }" style="margin-left: auto;" text><el-icon>
            <Brush />
          </el-icon></el-button>
        <el-button @click.stop="() => { handleDeleteTable(table.id) }" text><el-icon>
            <DeleteFilled />
          </el-icon></el-button>
        <el-button @click.stop="() => { handleOpenForm('edit', table) }" text><el-icon>
            <Edit />
          </el-icon></el-button>
      </div>
    </el-main>
  </el-container>
  <Form v-model="showTableDialog" @close="() => { showTableDialog = false }" :type="pageData.formType"
    :data="pageData.formData" @save="handleSave" :config="initTableConfig"></Form>
  <Form v-model="showFieldDialog" @close="() => { showFieldDialog = false }" @save="handleCreateNewField"
    :config="initFieldsConfig">
  </Form>
  <Table v-model="showTableFieldDialog" @close="() => { showTableFieldDialog = false }" :table-data="selectedTableData"
    @save="handleSaveTableFields" :columns="tableFieldColumnList"></Table>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue"
import { getFieldTypes } from "../../api/index"
import { DatabaseTable, dbField, tableFieldColumnList } from '../../database'
import { formConfigItem, formConfig } from "../../interface/form"
import Form from "../../components/form.vue"
import Table from "../../components/dialog-table.vue"

import { useRouter } from "vue-router"
//pinia
import { useDBStore } from "../../store"
import { storeToRefs } from "pinia"

interface pageInterface {
  formType: 'add' | 'edit',
  formData: { [property: string]: any }
}

const store = useDBStore()
const $router = useRouter()

const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {}
})

const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)
const { database, tables } = storeToRefs(store)
const dbInd = database.value.findIndex(db => {
  return db.id === databaseId
})
store.tables = database.value[dbInd].tables

const data = reactive(new formConfig())
let { initTableConfig, initFieldsConfig, selectedTableData } = toRefs(data)

let showTableDialog = ref(false)
let showEditTableDialog = ref(false)
let showTableFieldDialog = ref(false)
let showFieldDialog = ref(false)


const handleOpenForm = function (type: 'add' | 'edit', data?: any) {
  showTableDialog.value = true
  pageData.formType = type
  if (type === 'edit') {
    pageData.formData = data
  }
}
const handleOpenTableDesign = function (table: DatabaseTable) {
  showTableFieldDialog.value = true
  data.selectedTableData = table.fields
}
//拿到字段类型字典
const handleGetFeildTypes = async function () {
  return await getFieldTypes('mysql')
}
const handleSave = function (data: any) {
  showTableDialog.value = false
  console.log(data)
  if (pageData.formType === 'edit') {
    store.tables.forEach((tb, i, tbs) => {
      if (tb.id === data.id) {
        tbs[i].name = data.name
      }
    })
  } else {
    database.value[dbInd].tables.push(new DatabaseTable(data.name, []))
  }
}
const handleCreateNewField = function (data: any) {
  showFieldDialog.value = false
  pageData.formType = "add"
}
const handleSaveTableFields = function (data: any) {
  showTableFieldDialog.value = false
  console.log(data)
}

const handleRedirectToCharts = function () {
  $router.push({
    name: 'tablesRelation',
    params: {
      database: databaseId
    }
  })
}

const handleViewTable = function (table: string) {
  $router.push({
    name: 'tableData',
    params: {
      database: databaseId,
      table: table
    }
  })
}
const handleDeleteTable = function (id: string | number) {
  const index = store.tables.findIndex(tb => {
    return tb.id === id
  })
  store.tables.splice(index, 1)
}
const handleEditTable = function (data: DatabaseTable) {
  pageData.formType = "edit"
  showEditTableDialog.value = true
  pageData.formData = data
}
</script>
<style lang="scss" scoped>
.table-item {
  display: flex;
  align-items: center;
  padding: 20px;

  &:hover {
    background-color: rgba(230, 230, 230, 0.6);
  }
}
</style>
