

<template>
  <el-container class="content-container">
    <el-main>
      <div class="content-main">
        <h1>
          <span>数据库表管理</span>
        </h1>
        <div class="db-query">
          <el-input v-model="inputText" placeholder="查找数据库名称"> <template #append>
              <el-button @click="handleFuzzyQuery"><el-icon>
                  <Search />
                </el-icon></el-button>
            </template></el-input>
          <el-tooltip placement="left" content="新建数据库" effect="dark">
            <el-button style="margin-left: auto;" circle @click="() => { handleOpenForm('add') }"><el-icon>
                <Plus />
              </el-icon></el-button>
          </el-tooltip>
          <el-tooltip placement="left" content="查看表格关系" effect="dark">
            <el-button circle @click="handleRedirectToCharts">
              <img style="height: 14px;width: 14px;" src="./svg/relation.svg" alt="" srcset="">
            </el-button>
          </el-tooltip>
        </div>
        <div class="tb-list">
          <div v-for="(table, index) in tables" class="table-item"
            :style="{ 'background-color': colors[index % colors.length] }"
            @click.stop="() => { handleOpenTableDesign(table.id as string | number) }">
            <div style="margin: auto;font-size:24px">{{ table.name }}</div>
            <div class="tb-mask">
              <div class="item-tool">
                <el-button circle @click.stop="() => { handleDeleteTable(table.id as number, index) }"><el-icon>
                    <DeleteFilled />
                  </el-icon></el-button>
                <el-button circle @click.stop="() => { handleOpenForm('edit', table) }"><el-icon>
                    <Edit />
                  </el-icon></el-button>
              </div>
            </div>
          </div>
          <div v-if="tables.length === 0" style="position: absolute;top:0;left:0;right:0;bottom: 0;display: grid;">
            <img style="width: 400px;margin: auto;" src="@/assets/svg/blank.svg" alt="" srcset="">
          </div>
        </div>
        <div class="content-aside" v-show="pageData.isOpen">
          <h1 style="margin:20px 0;padding: 0;">
            <span>
              {{ `数据库表${pageData.formType === 'add' ? '新建' : '编辑'}` }}
            </span>
            <el-button style="margin-left:auto ;" circle @click="handleHiddenForm"><el-icon>
                <CloseBold />
              </el-icon></el-button>
          </h1>
          <div style="flex:1;overflow: auto;">
            <Form ref="editform" :type="pageData.formType" :data="pageData.formData" @save="handleSave"
              :config="initTableConfig"></Form>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed, onBeforeMount } from "vue"
import { DatabaseTable, dbField, tableFieldColumnList } from '@/database'
import { formConfigItem, formConfig } from "@/interface/form"
import { getTableList, createTable, updateTable, deleteTable } from "@/api/table"
import { fuzzyQueryTbs } from "@/api/table";
import Form from "@/components/form.vue"
import { ElNotification } from "element-plus"
import { useRouter } from "vue-router"
import { randowArray } from "@/utils/func"
//pinia
// import { useBaseStore } from "@/store/index"
// import { storeToRefs } from "pinia"
// const $store = useBaseStore()
// const { database } = storeToRefs($store)
let colors: readonly string[] = randowArray(['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'])

interface pageInterface {
  isOpen: boolean,
  formType: 'add' | 'edit',
  formData: { [property: string]: any },
  tables: DatabaseTable[]
}
const $router = useRouter()

const pageData = reactive<pageInterface>({
  formType: 'add',
  formData: {},
  tables: [],
  isOpen: false,
})
const { tables } = toRefs(pageData)
const databaseId: number | string = parseInt($router.currentRoute.value.params.database as string)

const data = reactive(new formConfig())
let { initTableConfig } = toRefs(data)

const editform = ref()
let showTableDialog = ref(false)
const inputText = ref('')

const handleHiddenForm = () => {
  pageData.isOpen = false
}

const handleOpenForm = function (type: 'add' | 'edit', data?: any) {
  showTableDialog.value = true
  pageData.isOpen = true
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

const handleRedirectToCharts = function () {
  $router.push({
    name: 'tablesRelation',
    params: {
      database: databaseId
    }
  })
}

const handleFuzzyQuery = async () => {
  pageData.tables = (await fuzzyQueryTbs(inputText.value, databaseId)).data
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
  height: 100%;
  padding: 10px;

  :deep(.el-main) {
    display: flex;
    overflow: auto;
    flex-direction: column;
    padding: 0;


    .content-main {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
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


      .tb-list {
        position: relative;
        flex: 1;
        overflow: auto;
        padding: 0 20px;
        display: grid;
        grid-template-columns: repeat(auto-fill, 240px);
        column-gap: 25px;
        row-gap: 25px;

        .table-item {
          height: 240px;
          display: inline-flex;
          position: relative;
          flex-direction: column;
          color: #fff;
          border-radius: $padding;
          padding: 0 20px;
          cursor: pointer;
          overflow: hidden;

          .tb-mask {
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

            .tb-mask {
              background-color: rgba(0, 0, 0, 0.4);
            }
          }
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
