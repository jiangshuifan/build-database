

<template>
  <el-container style="flex-direction: column;height:100%">
    <el-header style="display:flex;align-items:center ;">
      <el-button text @click="() => { showTableDialog = true }">新建数据库</el-button>
      <el-button text>导入数据库</el-button>
      <el-button text @click="handleGetFeildTypes">测试</el-button>
    </el-header>
    <el-main style="flex: 1;">
      <div v-for="i in 10" class="db-item">
        {{ `数据库${i}` }}
      </div>
    </el-main>
  </el-container>
  <Form v-model="showTableDialog" @close="() => { showTableDialog = false }" @save="handleCreateNewTable"
    :config="initDBConfig"></Form>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue"
import { getFieldTypes } from "../../api/index"
import { formConfig } from "../../interface/form"
import Form from "../../components/form.vue"

const data = reactive(new formConfig())
let { initDBConfig } = toRefs(data)
let showTableDialog = ref(false)

//拿到字段类型字典
const handleGetFeildTypes = async function () {
  return await getFieldTypes('mysql')
}
const handleCreateNewTable = function (data: any) {
  showTableDialog.value = false
}
</script>
<style lang="scss" scoped>
.db-item {
  display: flex;
  padding: 20px;

  &:hover {
    background-color: rgb(230, 230, 230);
  }
}
</style>
