

<template>
  <div style="height:100%;width:100%">
    <Echart :option="option"></Echart>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, toRefs, computed } from "vue"
import { DatabaseTable } from '../../database'
import Echart from "../../components/echarts.vue"
import { outPutOption, getGraphNodes } from "../../utils/format-data/graph-nodes"

interface dbTableData {
  tables: DatabaseTable[],
}
const dbTableData = reactive<dbTableData>({
  tables: [
    new DatabaseTable('User',
      [
        { field: 'username', name: '用户名', type: 'string' },
        { field: 'tel', name: '电话', type: 'string' },
        { field: 'email', name: '邮箱', type: 'string' },
        { field: 'github', name: 'github', type: 'string' },
        { field: 'headicon', name: '头像', type: 'string' },
        { field: 'position', name: '职位', type: 'string' },
        { field: 'education', name: '教育经历', type: 'string' },
        { field: 'projects', name: '项目', type: 'string' },
        { field: 'work_experience', name: '工作经历', type: 'string' },

      ], []),
    new DatabaseTable('experience',
      [
        { field: 'username', name: '用户名', type: 'string' },
        { field: 'tel', name: '电话', type: 'string' },
        { field: 'email', name: '邮箱', type: 'string' },
        { field: 'github', name: 'github', type: 'string' },
        { field: 'headicon', name: '头像', type: 'string' },
        { field: 'position', name: '职位', type: 'string' },
        { field: 'education', name: '教育经历', type: 'string' },
        { field: 'projects', name: '项目', type: 'string' },

      ], []),
    new DatabaseTable('school',
      [
        { field: 'username', name: '用户名', type: 'string' },
        { field: 'tel', name: '电话', type: 'string' },
        { field: 'email', name: '邮箱', type: 'string' },
        { field: 'github', name: 'github', type: 'string' },
        { field: 'headicon', name: '头像', type: 'string' },
        { field: 'position', name: '职位', type: 'string' },
        { field: 'education', name: '教育经历', type: 'string' },
        { field: 'projects', name: '项目', type: 'string' },

      ], []),
    new DatabaseTable('project',
      [
        { field: 'username', name: '用户名', type: 'string' },
        { field: 'tel', name: '电话', type: 'string' },
        { field: 'email', name: '邮箱', type: 'string' },
        { field: 'github', name: 'github', type: 'string' },
        { field: 'headicon', name: '头像', type: 'string' },
        { field: 'position', name: '职位', type: 'string' },
        { field: 'education', name: '教育经历', type: 'string' },
        { field: 'projects', name: '项目', type: 'string' },

      ], []),
    new DatabaseTable('table1',
      [
        { field: 'username', name: '用户名', type: 'string' },
        { field: 'tel', name: '电话', type: 'string' },
        { field: 'email', name: '邮箱', type: 'string' },
        { field: 'github', name: 'github', type: 'string' },
        { field: 'headicon', name: '头像', type: 'string' },
        { field: 'position', name: '职位', type: 'string' },
        { field: 'education', name: '教育经历', type: 'string' },
        { field: 'projects', name: '项目', type: 'string' },

      ], []),
    new DatabaseTable('table2',
      [
        { field: 'username', name: '用户名', type: 'string' },
        { field: 'tel', name: '电话', type: 'string' },
        { field: 'email', name: '邮箱', type: 'string' },
        { field: 'github', name: 'github', type: 'string' },
        { field: 'headicon', name: '头像', type: 'string' },
        { field: 'position', name: '职位', type: 'string' },
        { field: 'education', name: '教育经历', type: 'string' },
        { field: 'projects', name: '项目', type: 'string' },

      ], []),
    new DatabaseTable('table3',
      [
        { field: 'username', name: '用户名', type: 'string' },
        { field: 'tel', name: '电话', type: 'string' },
        { field: 'email', name: '邮箱', type: 'string' },
        { field: 'github', name: 'github', type: 'string' },
        { field: 'headicon', name: '头像', type: 'string' },
        { field: 'position', name: '职位', type: 'string' },
        { field: 'education', name: '教育经历', type: 'string' },
        { field: 'projects', name: '项目', type: 'string' },

      ], []),
  ]
})
const option = outPutOption(getGraphNodes(dbTableData.tables))
</script>
<style lang="scss" scoped></style>
