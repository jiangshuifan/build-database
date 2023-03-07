

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header class="db-header">
      <div>
        <h1>数据库</h1>
      </div>
      <div class="db-tool">
        <el-button text @click="() => { handleCreateDB() }">新建数据库</el-button>
        <el-button text>导入数据库</el-button>
        <el-button text @click="handleTest">查询测试</el-button>
        <el-button text @click="handleAddTest">新建测试</el-button>
      </div>
    </el-header>
    <el-main style="flex: 1;">

      <div v-for="(db, index) in database" @click="() => { handleViewDB(db.id as number) }" class="db-item">
        <div style="width:200px;">{{ db.dbName }}</div>
        <div style="margin-left: 20px;">{{ db.dbType }}</div>
        <el-button @click.stop="() => { handleDeleteDB(db.id as number, index) }" style="margin-left: auto;"
          text><el-icon>
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
import { ref, reactive, toRefs, computed, onBeforeMount } from "vue"
import { getFieldTypes } from "../../api/index"
import { getDatabaseList, createDatabase, updateDatabase, deleteDatabase } from "../../api/database"
import { ElNotification } from "element-plus"

import { Database } from "../../database"
import { formConfig } from "../../interface/form"
import Form from "../../components/form.vue"

//路由
import { useRouter } from "vue-router"
const $router = useRouter()

interface pageInterface {
  formType: 'add' | 'edit',
  formData: { [property: string]: any },
  database: Database[]
}

const data = reactive({
  ...new formConfig()
})
const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {},
  database: []
})
let { initDBConfig } = toRefs(data)
let { formData, formType, database } = toRefs(pageData)
let showTableDialog = ref(false)

//拿到字段类型字典
const handleTest = async function () {
  return await getDatabaseList()

}
const handleAddTest = async function () {
  pageData.formType = 'add'
  return await handleCreateNewTable({
    dbName: '数据库',
    dbType: 'MySQL',
    isPrivate: false,
    password: '88888888'
  })
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
const handleCreateNewTable = async function (data: any) {
  showTableDialog.value = false
  if (pageData.formType === 'add') {
    const db = new Database({
      dbName: data.dbName,
      dbType: data.dbType
    })
    let res = await createDatabase(db)
    if (res.success) {
      db.id = res.data.id as number
      pageData.database.push(db)
      ElNotification({
        message: '数据库新建成功',
        type: 'success'
      })
    }
  } else {
    if ((await updateDatabase(data)).success) {
      ElNotification({
        message: '数据更新成功',
        type: 'success'
      })
      for (let prop in data) {
        pageData.formData[prop] = data[prop]
      }
    }
  }
}


//移除数据库
const handleDeleteDB = async function (id: number | string, index: number) {
  let res = await deleteDatabase(id)
  if (res.success) {
    ElNotification({
      message: '数据库删除成功！',
      type: 'success'
    })
    pageData.database.splice(index, 1)
  } else {
    ElNotification({
      message: '数据库删除失败！',
      type: 'error'
    })
  }
}

const handleViewDB = function (id: number | string) {
  $router.push({
    name: 'tables',
    params: {
      database: id
    }
  })
}


onBeforeMount(async () => {
  pageData.database = (await getDatabaseList()).data
})
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

:deep(.el-header) {
  height: 160px !important;
  background-image: linear-gradient(90deg, rgb(227, 238, 252), rgb(172, 210, 253));
  color: #333333;
  height: auto;
  display: flex;
  box-shadow: 0 10px 10px #33333344;

  & div:first-child {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .db-tool {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;

    .el-button {
      font-weight: bold;

      &:hover {
        background-color: inherit;
      }
    }
  }
}
</style>
