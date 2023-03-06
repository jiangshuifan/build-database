

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header style="display:flex;align-items:center">
      <el-button @click="() => { handleOpenForm('add') }">新建表格</el-button>
      <el-button @click="handleGetFeildTypes">测试</el-button>
      <el-button @click="handleRedirectToCharts">表格关系</el-button>
    </el-header>
    <el-main style="flex: 1;">
      <div v-for="(table, index) in tables" class="table-item">
        <div>{{ table.tbName }}</div>
        <el-button @click.stop="() => { handleOpenTableDesign(table.id as string | number) }" style="margin-left: auto;"
          text><el-icon>
            <Brush />
          </el-icon></el-button>
        <el-button @click.stop="() => { handleDeleteTable(table.id as number, index) }" text><el-icon>
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
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed, onBeforeMount } from "vue"
import { getFieldTypes } from "../../api/index"
import { DatabaseTable, dbField, tableFieldColumnList } from '../../database'
import { formConfigItem, formConfig } from "../../interface/form"
import { getTableList, createTable, updateTable, deleteTable } from "../../api/table"

import Form from "../../components/form.vue"

import { ElNotification } from "element-plus"
import { useRouter } from "vue-router"
//pinia
import { useDBStore } from "../../store"

interface pageInterface {
  formType: 'add' | 'edit',
  formData: { [property: string]: any },
  tables: DatabaseTable[]
}

const $router = useRouter()

const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {},
  tables: []
})
const { tables } = toRefs(pageData)
const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)

const data = reactive(new formConfig())
let { initTableConfig, initFieldsConfig, selectedTableData } = toRefs(data)

let showTableDialog = ref(false)
let showFieldDialog = ref(false)


const handleOpenForm = function (type: 'add' | 'edit', data?: any) {
  showTableDialog.value = true
  pageData.formType = type
  if (type === 'edit') {
    pageData.formData = data
  }
}
const handleOpenTableDesign = function (tableId: string | number) {
  $router.push({
    name: 'tableDesign',
    params: {
      database: databaseId,
      table: tableId
    }
  })
}
//拿到字段类型字典
const handleGetFeildTypes = async function () {
  return await getFieldTypes('mysql')
}
const handleSave = async function (data: any) {
  showTableDialog.value = false
  if (pageData.formType === 'edit') {
    if ((await updateTable(data)).success) {
      ElNotification({
        message: '数据更新成功',
        type: 'success'
      })
      for (let prop in data) {
        pageData.formData[prop] = data[prop]
      }
    }
  } else {
    let table = new DatabaseTable({ tbName: data.tbName, dbId: databaseId })
    let res = await createTable(table)
    if (res.success) {
      pageData.tables.push(new DatabaseTable({ id: res.data.id as number, tbName: data.tbName, dbId: databaseId }))
    }
  }
}
const handleCreateNewField = function (data: any) {
  showFieldDialog.value = false
  pageData.formType = "add"
}

const handleRedirectToCharts = function () {
  $router.push({
    name: 'tablesRelation',
    params: {
      database: databaseId
    }
  })
}

const handleViewTable = function (tableId: number) {
  $router.push({
    name: 'tableData',
    params: {
      database: databaseId,
      table: tableId
    }
  })
}
const handleDeleteTable = async function (id: string | number, index: number) {
  if ((await deleteTable(id)).success) {
    ElNotification({
      message: '数据库表删除成功',
      type: 'success'
    })
    pageData.tables.splice(index, 1)
  }
}

onBeforeMount(async () => {
  pageData.tables = (await getTableList(databaseId)).data
})
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
