

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header style="display:flex;align-items:center">
      <el-button @click="() => { handleOpenDialog('add') }">新建字段</el-button>
    </el-header>
    <el-main style="flex: 1;">
      <el-table :data="fields" style="width: 100%">
        <el-table-column v-for="column in tableFieldColumnList" header-align="center" align="center" :prop="column.field"
          :label="column.title"></el-table-column>
        <el-table-column header-align="center" align="center">
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
    </el-main>
  </el-container>
  <Form v-model="showFieldDialog" @close="() => { showFieldDialog = false }" :type="pageData.formType"
    :data="pageData.formData" @save="handleSave" :config="initFieldsConfig">
  </Form>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed, onBeforeMount } from "vue"
import { getFieldList, createField, updateField, deleteField } from "../../api/field"
import { dbField, tableFieldColumnList, TableField } from '../../database'
import { formConfigItem, formConfig } from "../../interface/form"

import Form from "../../components/form.vue"
import { ElNotification } from "element-plus"

import { useRouter } from "vue-router"


interface pageInterface {
  formType: 'add' | 'edit',
  formData: { [property: string]: any },
  fields: TableField[]
}

const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {},
  fields: []
})

const $router = useRouter()

const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)
const tableId: number | string = parseInt($router.currentRoute.value.params.table as string)

const data = reactive(new formConfig())

const { fields } = toRefs(pageData)
let { initTableConfig, initFieldsConfig } = toRefs(data)

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
</style>
