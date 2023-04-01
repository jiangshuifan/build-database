

<template>
  <el-container class="content-container">
    <el-main>
      <div class="content-main">
        <h1>
          <span>字段管理</span>
          <el-tooltip placement="left" content="新建字段" effect="dark">
            <el-button circle style="margin-left: auto;" @click="() => { handleOpenForm('add') }"><el-icon>
                <Plus />
              </el-icon></el-button>
          </el-tooltip>
        </h1>
        <el-table :data="fields" border class="field-table">
          <el-table-column v-for="column in tableFieldColumnList" header-align="center" align="center"
            :prop="column.field" :label="column.title"></el-table-column>
          <el-table-column width="130px" header-align="center" align="center">
            <template #default="scoped">
              <el-button @click="() => { handleOpenForm('edit', scoped.row) }" link><el-icon>
                  <Edit />
                </el-icon></el-button>
              <el-button @click="() => {
                handleRemoveField(scoped.row.id, scoped.$index as number)
              }" link><el-icon>
                  <DeleteFilled />
                </el-icon></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content-aside" v-show="pageData.isOpen">
        <h1 style="margin:20px 0;padding: 0;display: flex;">
          <span>
            {{ `字段${pageData.formType === 'add' ? '新建' : '编辑'}` }}
          </span>
          <el-tooltip content="关闭" placement="left">
            <el-button style="margin-left:auto ;" circle @click="handleHiddenForm"><el-icon>
                <CloseBold />
              </el-icon></el-button>
          </el-tooltip>
        </h1>
        <Form ref="editForm" :type="pageData.formType" :init-data="formInitData" :data="pageData.formData"
          @save="handleSave" :config="initFieldsConfig">
        </Form>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed, onBeforeMount } from "vue"
import { getFieldList, createField, updateField, deleteField } from "@/api/field"
import { dbField, tableFieldColumnList, TableField } from '@/database'
import { getFieldFormConfig } from "@/interface/form"
import Form from "@/components/form.vue"
import { ElNotification } from "element-plus"
import { deepClone } from "@/utils/func"

import { useRouter } from "vue-router"


interface pageInterface {
  isOpen: boolean,
  formType: 'add' | 'edit',
  formData: { [property: string]: any },
  fields: TableField[]
}
const editForm = ref()
const pageData = reactive<pageInterface>({
  isOpen: false,
  formType: 'add',
  formData: {},
  fields: []
})
const formInitData = {
  isMarjorKey: 0,
  isForeignKey: 0,
  targetKey: null,
  allowNull: 1,
  unique: 0
}
const $router = useRouter()

const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)
const tableId: number | string = parseInt($router.currentRoute.value.params.table as string)

const data = reactive({
  initFieldsConfig: getFieldFormConfig({ databaseId, tableId })
})

const { fields } = toRefs(pageData)
let { initFieldsConfig } = toRefs(data)
let showFieldDialog = ref(false)

const handleSave = async function (params: any) {
  if (pageData.formType === "edit") {
    let res = await updateField(params)
    if (res.success) {
      ElNotification({
        message: '字段数据更新成功！',
        type: "success"
      })
    }
  } else {
    params.tbId = tableId
    params.dbId = databaseId
    if (params.targetKey) {
      params.targetKey = JSON.stringify(params.targetKey)
    }
    let res = await createField(params)
    if (res.success) {
      ElNotification({
        message: '字段新建成功！',
        type: "success"
      })
    }
  }
  showFieldDialog.value = false
  pageData.fields = (await getFieldList(tableId)).data
}
const handleHiddenForm = function () {
  pageData.isOpen = false
}
const handleOpenForm = function (type: "add" | "edit", data?: any) {
  showFieldDialog.value = true
  pageData.formType = type
  pageData.isOpen = true
  data = deepClone(data)
  if (type === "edit") {
    data.targetKey = JSON.parse(data.targetKey)
    data.isForeignKey = data.isForeignKey === false ? 0 : 1
    data.isMarjorKey = data.isMarjorKey === false ? 0 : 1
    data.allowNull = data.allowNull === false ? 0 : 1
    data.unique = data.unique === false ? 0 : 1
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
$gap: 30px;
$padding: 10px;

.content-container {
  height: 100%;
  padding: 10px;

  :deep(.el-main) {
    padding: 0;
    overflow: auto;
    position: relative;

    .content-main {
      display: flex;
      flex-direction: column;
      overflow: auto;

      h1 {
        padding-left: 20px;
        padding-right: 20px;
        margin: 0;
        display: flex;
        white-space: nowrap;
        margin-top: 20px;
      }

      .field-table {
        width: 100%;
        margin-top: 20px;
      }


    }

    .content-aside {
      display: flex;
      flex-direction: column;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: #fff;
      padding: 0 20px;
      overflow: auto;
      z-index: 99;
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
