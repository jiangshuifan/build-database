

<template>
  <el-container class="content-container">
    <el-header class="db-header">
      <div>
        <h1 class="db-title">DATABASE</h1>
      </div>
      <div class="db-tool">
        <div @click="() => { handleCreateDB() }">新建数据库</div>
        <div>导入数据库</div>
      </div>
    </el-header>
    <el-main>
      <div class="content-main">
        <div class="db-query">
          <el-input> <template #append>
              <el-button><el-icon>
                  <Search />
                </el-icon></el-button>
            </template></el-input>
        </div>
        <div class="db-list">
          <div v-for="(db, index) in database" @click="() => { handleViewDB(db.id as number) }" class="db-item">
            <div style="width:200px;">{{ db.name }}</div>
            <div style="margin-left: 20px;">{{ db.type }}</div>
            <el-button @click.stop="() => { handleDeleteDB(db.id as number, index) }" style="margin-left: auto;"
              text><el-icon>
                <DeleteFilled />
              </el-icon></el-button>
            <el-button @click.stop="() => { handleEditDB(db) }" text><el-icon>
                <Edit />
              </el-icon></el-button>
          </div>
        </div>
      </div>
      <div class="content-aside">
        <Form ref="editform" :type="formType" :data="formData" @save="handleCreateNewTable" :config="initDBConfig"></Form>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount } from "vue"
import { getDatabaseList, createDatabase, updateDatabase, deleteDatabase } from "../../api/database"
import { ElNotification } from "element-plus"

import { Database } from "../../database"
import { formConfig } from "../../interface/form"
import Form from "../../components/form.vue"

//路由
import { useRouter } from "vue-router"

const editform = ref()

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

//打开编辑、新增数据库窗口
const handleEditDB = async function (db: any) {
  pageData.formType = "edit"
  showTableDialog.value = true
  pageData.formData = db
  editform.value.init()
}
const handleCreateDB = async function () {
  pageData.formType = "add"
  editform.value.init()
}

//新建、完成编辑数据库
const handleCreateNewTable = async function (data: any) {
  showTableDialog.value = false
  if (pageData.formType === 'add') {
    const db = new Database({
      name: data.name,
      type: data.type
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
    padding: 10px;
    // border-radius: $padding;

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
    padding: 0;
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

      .db-list {
        height: 100%;
        padding: 20px;
        background-color: #fff;

        .db-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border: 0.2px solid #33333333;
          margin-bottom: $padding;
          cursor: pointer;

          &:last-child {
            margin-bottom: $padding;
          }


          // &:hover {
          //   background-color: rgba(230, 230, 230, 0.6);
          // }
        }
      }


    }

    .content-aside {
      width: 300px;
      margin-left: $gap;
      background-color: #fff;
      box-shadow: 0 0 $padding #33333344;
      padding: 20px;
      overflow: auto;
      // border-radius: $padding;
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
