

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header style="display:flex;align-items:center">
      <el-button @click="() => { showTableDialog = true }">新建表格</el-button>
      <el-button>生成数据库</el-button>
      <el-button @click="handleGetFeildTypes">测试</el-button>
    </el-header>
    <el-main style="flex: 1;">
      <el-card v-for="table in tables" class="database-card">
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
          </div>
        </div>
      </el-card>
    </el-main>
  </el-container>
  <Form v-model="showTableDialog" @close="() => { showTableDialog = false }" @save="handleCreateNewTable"
    :config="initTableConfig"></Form>
  <Form v-model="showFieldDialog" @close="() => { showFieldDialog = false }" @save="handleCreateNewField"
    :config="initFieldsConfig">
  </Form>
  <Table v-model="showTableFieldDialog" @close="() => { showTableFieldDialog = false }" :table-data="selectedTableData"
    @save="handleSaveTableFields" :columns="tableFieldColumnList"></Table>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue"
import { getFieldTypes } from "./api/index"
import { DatabaseTable, dbField, tableFieldColumnList } from './database'
import { formConfigItem, formConfig } from "./interface/form"
import Form from "./components/form.vue"
import Table from "./components/table.vue"


const data = reactive(new formConfig())
let { initTableConfig, initFieldsConfig, selectedTableData } = toRefs(data)
let fieldTypeData: any

let showTableDialog = ref(false)
let showTableFieldDialog = ref(false)
let showFieldDialog = ref(false)
const tables: DatabaseTable[] = [
  new DatabaseTable('用户表',
    [
      { field: 'username', name: '用户名', type: 'string' },
      { field: 'tel', name: '电话', type: 'string' },
      { field: 'email', name: '邮箱', type: 'string' },
      { field: 'github', name: 'github', type: 'string' },
      { field: 'headicon', name: '头像', type: 'string' },
      { field: 'position', name: '职位', type: 'string' },
      { field: 'education', name: '教育经历', type: 'string' },
      { field: 'projects', name: '项目', type: 'string' },
      { field: 'work_experience', name: '工作经历', type: 'string' },

    ], 'tel')
]

//拿到字段类型字典
const handleGetFeildTypes = async function () {
  return await getFieldTypes('mysql')
}
const handleCreateNewTable = function (data: any) {
  showTableDialog.value = false
}
const handleCreateNewField = function (data: any) {
  showFieldDialog.value = false
  console.log(data)
}
const handleSaveTableFields = function (data: any) {
  showTableFieldDialog.value = false
  console.log(data)
}
//新建字段
const handleOpenFieldCreateDialog = async function () {
  fieldTypeData = await handleGetFeildTypes()
  data.initFieldsConfig.forEach((item, ind, arr) => {
    if (item.field === "type") {
      arr[ind].data = fieldTypeData
    }
  })
  showFieldDialog.value = true
}
//
const handleOpenTableFieldEditDialog = function (arr: dbField[]) {
  showTableFieldDialog.value = true
  data.selectedTableData = arr
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
