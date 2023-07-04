<template>
  <div class="home-container">
    <div class="home-body">
      <div class="background">
        <div class="logon-form">
          <LoginForm @login="handleLogin" @register="handleToRegister" @reset-password="handleToResetPassword" v-show="currentState===StateEnum.login"></LoginForm>
          <RegisterForm v-show="currentState===StateEnum.register" @login="handleToLogin"></RegisterForm>
          <ResetPassword v-show="currentState===StateEnum.resetPassword" @login="handleToLogin"></ResetPassword>
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
import ResetPassword from "./components/reset-password.vue"
import { HandleLogin } from "@/api/user"
import { useRouter } from "vue-router"

enum StateEnum {
  login = 1,
  register = 2,
  resetPassword = 3
}

const currentState = ref<StateEnum>(StateEnum.login)
const $router = useRouter()
const handleLogin = async function () {
  $router.push({
    name: "list"
  })
}

const handleToLogin = function () {
  currentState.value = StateEnum.login
}
const handleToResetPassword = function (){
  currentState.value = StateEnum.resetPassword
}
const handleToRegister = function () {
  currentState.value = StateEnum.register
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