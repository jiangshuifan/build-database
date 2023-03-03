

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header style="display:flex;align-items:center ;">
      <el-button text @click="() => { handleCreateDB() }">新建数据库</el-button>
      <el-button text>导入数据库</el-button>
      <el-button text @click="handleGetFeildTypes">测试</el-button>
    </el-header>
    <el-main style="flex: 1;">
      <div v-for="db in database" @click="() => { handleViewDB(db.id) }" class="db-item">
        <div>{{ db.name }}</div>
        <el-button @click.stop="() => { handleDeleteDB(db.id) }" style="margin-left: auto;" text><el-icon>
            <DeleteFilled />
          </el-icon></el-button>
        <el-button @click.stop="() => { handleEditDB(db) }" text><el-icon>
            <Edit />
          </el-icon></el-button>
      </div>
    </el-main>
  </el-container>
  <Form v-model="showTableDialog" @close="() => { showTableDialog = false }" :type="formType" :data="formData"
    @save="handleCreateNewTable" :config="initDBConfig"></Form>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue"
import { getFieldTypes } from "../../api/index"

import { Database } from "../../database"
import { formConfig } from "../../interface/form"
import Form from "../../components/form.vue"
//状态管理
import { useDBStore } from "../../store/index"
import { storeToRefs } from "pinia"
//路由
import { useRouter } from "vue-router"
const $router = useRouter()

interface pageInterface {
  formType: 'add' | 'edit',
  formData: { [property: string]: any }
}

const store = useDBStore()
const data = reactive(new formConfig())
const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {}
})
let { initDBConfig } = toRefs(data)
let { formData, formType } = toRefs(pageData)
let showTableDialog = ref(false)
const { database } = storeToRefs(store)

//拿到字段类型字典
const handleGetFeildTypes = async function () {
  return await getFieldTypes('mysql')
}
//打开编辑、新增数据库窗口
const handleEditDB = function (db: any) {
  pageData.formType = "edit"
  showTableDialog.value = true
  pageData.formData = db
}
const handleCreateDB = function () {
  pageData.formType = "add"
  showTableDialog.value = true
}

//新建、完成编辑数据库
const handleCreateNewTable = function (data: any) {
  showTableDialog.value = false
  let ind = database.value.findIndex((db) => {
    return data.id === db.id
  })
  if (pageData.formType === 'add') {
    const db = new Database(data.name, data.type)
    store.database.push(db)
  } else {
    store.database[ind].name = data.name
    store.database[ind].type = data.type
  }
}


//移除数据库
const handleDeleteDB = function (id: number | string) {
  const ind = database.value.findIndex((db) => {
    return db.id === id
  })
  store.database.splice(ind, 1)
}

const handleViewDB = function (id: number | string) {
  $router.push({
    name: 'tables',
    params: {
      database: id
    }
  })
}
</script>
<style lang="scss" scoped>
.db-item {
  display: flex;
  align-items: center;
  padding: 20px;

  &:hover {
    background-color: rgba(230, 230, 230, 0.6);
  }
}
</style>
