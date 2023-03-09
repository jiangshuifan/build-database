

<template>
  <el-container class="content-container">
    <el-header>
      <div>
        <h1>FIELD</h1>
      </div>
      <div class="fd-tool">
        <div @click="() => { handleOpenDialog('add') }">新建字段</div>
      </div>

    </el-header>
    <el-main style="flex: 1;">
      <div class="content-main">
        <el-table :data="fields" border style="width: 100%">
          <el-table-column v-for="column in tableFieldColumnList" header-align="center" align="center"
            :prop="column.field" :label="column.title"></el-table-column>
          <el-table-column width="130px" header-align="center" align="center">
            <template #default="scoped">
              <el-button @click="() => { handleOpenDialog('edit', scoped.row) }" text><el-icon>
                  <Edit />
                </el-icon></el-button>
              <el-button @click="() => {
                handleRemoveField(scoped.row.id, scoped.$index as number)
              }" text><el-icon>
                  <DeleteFilled />
                </el-icon></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content-aside">
        <Form ref="editForm" :type="pageData.formType" :init-data="formInitData" :data="pageData.formData"
          @save="handleSave" :config="initFieldsConfig">
        </Form>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed, onBeforeMount } from "vue"
import { getFieldList, createField, updateField, deleteField } from "../../api/field"
import { dbField, tableFieldColumnList, TableField } from '../../database'
import { getFieldFormConfig } from "../../interface/form"
import Form from "../../components/form.vue"
import { ElNotification } from "element-plus"

import { useRouter } from "vue-router"


interface pageInterface {
  formType: 'add' | 'edit',
  formData: { [property: string]: any },
  fields: TableField[]
}
const editForm = ref()
const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {},
  fields: []
})
const formInitData = {
  isMarjorkey: 'false',
  isForeignkey: 'false'
}
const $router = useRouter()

const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)
const tableId: number | string = parseInt($router.currentRoute.value.params.table as string)

const data = reactive({
  initFieldsConfig: getFieldFormConfig({ databaseId, tableId })
})

const { fields } = toRefs(pageData)
let { initFieldsConfig } = toRefs(data)
console.log(initFieldsConfig)
let showFieldDialog = ref(false)

const handleSave = async function (params: any) {
  if (pageData.formType === "edit") {
    let res = await updateField(params)
    if (res.success) {
      ElNotification({
        message: '字段数据更新成功！',
        type: "success"
      })
      Object.keys(params).forEach((key) => {
        pageData.formData[key] = params[key]
      })
    }

  } else {
    params.tbId = tableId
    let res = await createField(params)
    if (res.success) {
      ElNotification({
        message: '字段新建成功！',
        type: "success"
      })
      params.id = res.data.id
      pageData.fields.push(params)
    }
  }
  showFieldDialog.value = false
}

const handleOpenDialog = function (type: "add" | "edit", data?: any) {
  showFieldDialog.value = true
  pageData.formType = type
  if (type === "edit") {
    pageData.formData = data
  }
  editForm.value.init()
}

const handleRemoveField = async function (id: string | number, index: number) {
  let res = await deleteField(id)
  if (res.success) {
    ElNotification({
      message: '字段删除成功！',
      type: "success"
    })
    pageData.fields.splice(index, 1)
  }
}

onBeforeMount(async () => {
  pageData.fields = (await getFieldList(tableId)).data
  console.log(pageData.fields)
})
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
    box-shadow: 0 0 $padding #33333344;
    // border-radius: $padding;

    & div:first-child {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center
    }

    .fd-tool {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;


      & div {
        font-weight: bold;
        display: grid;
        place-content: center;
        cursor: pointer;

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
          padding: 10px;
          border: 0.2px solid #33333333;
          margin-bottom: $padding;
          cursor: pointer;

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
