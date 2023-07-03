

<template>
  <el-container class="content-container">
    <el-main>
      <div class="content-main">
        <h1>
          <span>数据库管理</span>
        </h1>
        <div class="db-query">
          <el-input v-model="inputText" placeholder="查找数据库名称"> <template #append>
              <el-button @click="handleFuzzyQuery"><el-icon>
                  <Search />
                </el-icon></el-button>
            </template></el-input>
          <el-tooltip placement="left" content="新建数据库" effect="dark">
            <el-button circle style="margin-left: auto;" @click="() => { handleCreateDB() }"><el-icon>
                <Plus />
              </el-icon></el-button>
          </el-tooltip>
        </div>
        <div class="db-list">
          <div v-for="(db, index) in database" :style="{ 'background-color': colors[index % colors.length] }"
            @click="() => { handleViewDB(db.id as number) }" class="db-item">
            <div style="display: flex;align-items: center;position: relative;;height:100%;">
              <div style="margin-left: 16px;">
                <div style="font-size: 30px;">
                  {{ db.name }}
                </div>
                <p style="font-size:13px;color: #ccc;">2021-2</p>
              </div>
            </div>
            <div class="db-mask">
              <div class="item-tool">
                <el-button @click.stop="() => { handleDownloadZip(db) }" circle><el-icon>
                    <Files />
                  </el-icon></el-button>
                <el-button @click.stop="() => { handleDownloadDB(db) }" circle>
                  <el-icon>
                    <Download />
                  </el-icon></el-button>
                <el-button circle @click.stop="() => { handleDeleteDB(db.id as number, index, db.name) }"><el-icon>
                    <DeleteFilled />
                  </el-icon></el-button>
                <el-button circle @click.stop="() => { handleEditDB(db) }"><el-icon>
                    <Edit />
                  </el-icon></el-button>
              </div>
            </div>
          </div>
          <div v-if="database.length === 0" style="position: absolute;top:0;left:0;right:0;bottom: 0;display: grid;">
            <img style="width: 400px;margin: auto;" src="@/assets/svg/blank.svg" alt="" srcset="">
          </div>
        </div>

        <div class="content-aside" v-show="isOpen">
          <h1 style="margin:20px 0;padding: 0;">
            <span>
              {{ `数据库${formType === 'add' ? '新建' : '编辑'}` }}
            </span>
            <el-button style="margin-left:auto ;" circle @click="handleHiddenForm"><el-icon>
                <CloseBold />
              </el-icon></el-button>
          </h1>
          <div style="flex:1;overflow: auto;">
            <Form ref="editform" :type="formType" :data="formData" @save="handleCreateNewTable" :config="initDBConfig">
            </Form>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount } from "vue"
import { getUser } from "@/global"
import { getDatabaseList, createDatabase, updateDatabase, deleteDatabase, downloadDb, fuzzyQueryDbs, downloadDbZip } from "@/api/database"
import { ElNotification, ElMessageBox } from "element-plus"
import { Database } from "@/database"
import { formConfig } from "@/interface/form"
import Form from "@/components/form.vue"
import { randowArray } from "@/utils/func"
//pinia
import { useBaseStore } from "@/store/index"
import { storeToRefs } from "pinia"
//路由
import { useRouter } from "vue-router"
const editform = ref()
const inputText = ref('')

const $store = useBaseStore()
const { account: currentAccount } = storeToRefs($store)
let colors: readonly string[] = randowArray(['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'])
const $router = useRouter()
interface pageInterface {
  isOpen: boolean,
  formType: 'add' | 'edit',
  formData: { [property: string]: any },
  database: Database[]
}
const data = reactive({
  ...new formConfig()
})
const pageData = reactive<pageInterface>({
  isOpen: false,
  formType: 'add',
  formData: {},
  database: []
})
let { initDBConfig } = toRefs(data)
let { formData, formType, database, isOpen } = toRefs(pageData)
let showTableDialog = ref(false)
//打开编辑、新增数据库窗口
const handleEditDB = async function (db: any) {
  pageData.formType = "edit"
  pageData.isOpen = true
  showTableDialog.value = true
  pageData.formData = db
  editform.value.init()
}
const handleHiddenForm = function () {
  pageData.isOpen = false
}
const handleCreateDB = async function () {
  pageData.formType = "add"
  pageData.isOpen = true
  editform.value.init()
}
const handleDownloadDB = function (database: Database) {
  downloadDb(database.id as number, database.name)
}
const handleDownloadZip = function (database: Database) {
  downloadDbZip(database.id as number, database.name)
}
//新建、完成编辑数据库
const handleCreateNewTable = async function (data: any) {
  showTableDialog.value = false
  if (pageData.formType === 'add') {
    const db = new Database({
      name: data.name,
      type: data.type,
      description: data.description,
      account: currentAccount.value
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

//模糊查询
const handleFuzzyQuery = async function () {
  pageData.database = (await fuzzyQueryDbs(inputText.value)).data
}

//移除数据库
const handleDeleteDB = async function (id: number | string, index: number, dbName: string) {
  ElMessageBox.confirm("将删除当前数据库及其下面所有表格数据，是否继续？", `当前数据库：${dbName}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
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
  }).catch(() => {
    ElNotification({
      message: '操作取消！',
      type: "info"
    })
  })

}

const handleViewDB = function (id: number | string) {
  let params = {
    database: id,
  }
  $router.push({
    name: 'tables',
    params
  })
}


onBeforeMount(async () => {
  let user = getUser()
  pageData.database = (await getDatabaseList(user.account)).data
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
    display: flex;
    overflow: auto;
    flex-direction: column;

    .content-main {
      display: flex;
      flex-direction: column;
      overflow: auto;
      height: 100%;
      position: relative;

      h1 {
        padding-left: 20px;
        padding-right: 20px;
        margin: 0;
        display: flex;
        white-space: nowrap;
        margin-top: 20px;
      }

      .db-query {
        // background-color: #6f6f6f;
        padding: 0 20px;
        margin: 20px 0;
        display: flex;

        .el-input {
          outline: none;
          width: 560px;
          height: 36px;


          // border-radius: 8px;
          .el-input__wrapper {
            border-top-left-radius: 16px;
            border-bottom-left-radius: 16px;
            padding: 0 16px;
            background-color: #e9e9e9;
          }

          .el-input__wrapper.is-focus {
            background-color: #383838;
            box-shadow: 0 0 0 1px #383838 inset;

            &+.el-input-group__append {
              background-color: #383838;
              box-shadow: 1px 0 0 1px #383838 inset;
            }
          }

          .el-input-group__append {
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
          }
        }
      }

      .db-list {
        position: relative;
        flex: 1;
        overflow: auto;
        padding: 0 20px;
        display: grid;
        grid-template-columns: repeat(auto-fill, 240px);
        column-gap: 25px;
        row-gap: 25px;

        .db-item {
          height: 240px;
          display: inline-flex;
          position: relative;
          flex-direction: column;
          color: #fff;
          border-radius: $padding;
          padding: 0 20px;
          cursor: pointer;
          overflow: hidden;



          .db-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            .item-tool {
              position: absolute;
              bottom: 0;
              padding: 20px;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              visibility: hidden;
            }
          }

          &:hover {
            .item-tool {
              visibility: visible;
            }

            .db-mask {
              background-color: rgba(0, 0, 0, 0.4);
            }
          }


          .el-button {
            padding-top: 10px;
            padding-bottom: 10px;
          }

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
