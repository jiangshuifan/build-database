<template>
  <div class="app-container">
    <div
      style="display: flex;align-items: center;justify-content: center;font-weight: bold;background-color: rgb(240,240,240);">
      数据库设计</div>
    <div style="display: flex;align-items: center;padding: 0 20px;">
      <el-button :disabled="isRoot" @click="handleRouterBack" link><el-icon>
          <ArrowLeft />
        </el-icon></el-button>
      <el-button @click="handleRouterForward" link><el-icon>
          <ArrowRight />
        </el-icon></el-button>
      <span>晚上好呀！于未然</span>
      <div style="margin-left: auto">
        <el-dropdown split-button type="primary">
          于未然
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

    </div>
    <div class="app-menu">
      <el-menu default-active="list">
        <el-menu-item index="list">
          <el-icon>
            <Menu />
          </el-icon>
          <span>数据库列表</span>
        </el-menu-item>
        <el-menu-item index="profile">
          <el-icon>
            <User />
          </el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon>
            <setting />
          </el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div style="display: flex;flex-direction: column;  height: 100%;overflow: auto;">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import { useBaseStore } from "@/store/index"
import { storeToRefs } from "pinia"

let $router = useRouter()
const $store = useBaseStore()
const { isRoot } = storeToRefs($store)
const handleRouterBack = () => {
  $router.go(-1)
}
const handleRouterForward = () => {
  $router.go(1)
}
const refreshBtnState = () => {
  console.log($router.currentRoute.value.fullPath)
  if ($router.currentRoute.value.fullPath === "/") {
    isRoot.value = true
  } else {
    isRoot.value = false
  }
}
refreshBtnState()
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  width: 100%;
  background-color: #fff;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: 60px 1fr;

  .app-menu {
    background-color: rgb(240, 240, 240);

    :deep(.el-menu) {
      font-size: 16px;
      background-color: inherit;
      padding: 10px 30px;

      .el-menu-item {
        padding: 10px 18px;
        height: auto;
        line-height: unset;
        border-radius: 4px;


        &:hover {
          background-color: rgb(216, 216, 216);
        }

        &.is-active {
          background-color: rgb(34, 34, 34);
          color: #fff;

          &hover {
            background-color: rgb(34, 34, 34);
          }
        }

        margin-top: 14px;

      }

      .el-menu-item:first-child {
        margin-top: unset;
      }
    }
  }

}
</style>