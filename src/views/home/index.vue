<template>
  <div class="home-container">
    <div class="home-body">
      <div class="background">
        <div class="logon-form">
          <LoginForm @login="handleLogin" @register="handleToRegister" v-show="isLogin"></LoginForm>
          <RegisterForm v-show="!isLogin" @login="handleToLogin"></RegisterForm>
        </div>
      </div>
    </div>
    <footer class="home-footer">
      {{ `Copyright ©2022 - ${new Date().getFullYear()} Yuweiran. All Rights Reserved. Yuweiran 版权所有` }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue"
import { ElNotification } from "element-plus"
import RegisterForm from "./components/register.vue"
import LoginForm from "./components/login.vue"
import { HandleLogin } from "@/api/user"
import { useRouter } from "vue-router"
const isLogin = ref(true)
const $router = useRouter()
const handleLogin = async function () {
  $router.push({
    name: "list"
  })
}
const handleToLogin = function () {
  isLogin.value = true
}

const handleToRegister = function () {
  isLogin.value = false
}
</script>

<style lang="scss" scoped>
$color-dark: #333;
$color-light: #ccc;

.home-container {
  height: 100%;
  overflow: auto;
  background-color: #fff;
  position: relative;

  .home-body {
    height: 100vh;
    padding: 0 40px;

    .background {
      height: 100%;
      width: 100%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url('../../assets/images/bg.png');
      display: flex;

      .logon-form {
        height: 680px;
        width: 1100px;
        margin: auto;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px #3333;
      }
    }


  }

  .home-footer {
    padding: 20px 0;
    text-align: center;
    background-color: $color-dark;
    color: $color-light;
  }
}
</style>