

<template>
  <el-container class="content-container">
    <el-header>
      <div style="flex: 1;">
        <h1>TABLE</h1>
      </div>
      <div class="tb-tool">
        <el-button link @click="() => { handleOpenForm('add') }">新建表格</el-button>
        <el-button link @click="handleRedirectToCharts">表格关系</el-button>
      </div>
    </el-header>
    <el-main style="flex: 1;">
      <div class="content-main">
        <div class="tb-list">
          <div v-for="(table, index) in tables" class="table-item">
            <div>{{ table.name }}</div>
            <el-button @click.stop="() => { handleOpenTableDesign(table.id as string | number) }"
              style="margin-left: auto;" link><el-icon>
                <Brush />
              </el-icon></el-button>
            <el-button @click.stop="() => { handleDeleteTable(table.id as number, index) }" link><el-icon>
                <DeleteFilled />
              </el-icon></el-button>
            <el-button @click.stop="() => { handleOpenForm('edit', table) }" link><el-icon>
                <Edit />
              </el-icon></el-button>
          </div>
        </div>

      </div>
      <div class="content-aside">
        <Form ref="editform" :type="pageData.formType" :data="pageData.formData" @save="handleSave"
          :config="initTableConfig"></Form>
      </div>
    </el-main>
  </el-container>
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
let { initTableConfig } = toRefs(data)

const editform = ref()
let showTableDialog = ref(false)
let showFieldDialog = ref(false)


const handleOpenForm = function (type: 'add' | 'edit', data?: any) {
  showTableDialog.value = true
  pageData.formType = type
  if (type === 'edit') {
    pageData.formData = data
  }
  editform.value.init()
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
    let table = new DatabaseTable({ name: data.name, dbId: databaseId })
    let res = await createTable(table)
    if (res.success) {
      ElNotification({
        message: '数据创建成功',
        type: 'success'
      })
      pageData.tables.push(new DatabaseTable({ id: res.data.id as number, name: data.name, dbId: databaseId }))
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
$gap: 30px;
$padding: 10px;

.content-container {
  flex-direction: column;
  height: 100%;

  font-family: 'Ma Shan Zheng';

  :deep(.el-header) {
    height: 160px !important;
    background-color: #fff;
    color: #333333;
    height: auto;
    display: flex;
    padding: $gap;
    box-shadow: 0 0 $padding #33333344;
    // border-radius: $padding;


    .tb-tool {
      flex: 1;
      display: flex;
      align-items: end;
      justify-content: end;

      & .el-button {
        font-weight: bold;

        &:hover {
          background-color: inherit;
        }
      }
    }
  }

  :deep(.el-main) {
    display: flex;
    overflow: auto;
    padding: $gap;


    .content-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      box-shadow: 0 0 $padding #33333344;
      overflow: auto;
      // border-radius: $padding;
      padding: 20px;


      .db-query {
        // background-color: #6f6f6f;
        padding: 20px;

        .el-input {
          outline: none;
          border-radius: 0;

          .el-input__wrapper {
            border-radius: 0;

            &.is-focus {
              box-shadow: 0 0 0 1px #dcdfe6 inset;
            }
          }
        }

        .el-input-group__append {
          border-radius: 0;
        }

      }

      .tb-list {
        height: 100%;
        padding: 20px;
        background-color: #fff;
        overflow: auto;

        .table-item {
          display: flex;
          align-items: center;
          padding-left: 10px;
          padding-right: 10px;
          border: 0.2px solid #33333333;
          margin-bottom: $padding;
          cursor: pointer;

          .el-button {
            padding-top: 10px;
            padding-bottom: 10px;
          }

          &:last-child {
            margin-bottom: $padding;
          }
        }
      }


    }

    .content-aside {
      width: 300px;
      margin-left: $gap;
      background-color: #fff;
      box-shadow: 0 0 $padding #33333344;
      padding: 20px;
      // border-radius: $padding;
      overflow: auto;
    }
  }
}

.three-d-font-effect {
  font-size: 60px;
  color: #444;
  text-shadow:
    -1px 0 #888,
    -2px 0 #888,
    -3px 0 #888,
    -4px 0 #888,
}

.three-d-box-effect {
  box-shadow:
    1px -1px #aaa,
    2px -2px #aaa,
    3px -3px #aaa,
    4px -4px #aaa,
    5px -5px #aaa,
    6px -6px #aaa,
    7px -7px #aaa,
}
</style>
