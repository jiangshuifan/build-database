<template>
  <div class="form-body">
    <div class="form-left">
      <img style="width:100% ;" src="@/assets/svg/home_pic1.svg" alt="">
    </div>
    <div class="form-right">
      <div style="margin-bottom: 20px;">
        <h1>
          <span style="color:#ccc">你好，</span>
          <span style=" 
                  background: -webkit-linear-gradient(315deg,#42d392 25%,#647eff);
                  background-clip: text;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;">欢迎使用
          </span>
        </h1>
      </div>

      <el-form :model="formData" ref="ruleLoginForm" :rules="loginRules">
        <el-form-item prop="email">
          <div class="form-input">
            <label for="email">Email</label>
            <el-input :spellcheck="false"  v-model="formData.email" id="email" placeholder="请输入邮箱"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class="form-input">
            <label for="password">Password</label>
            <el-input  :spellcheck="false" v-model="formData.password" id="password" @keyup.enter="handleLogin(ruleLoginForm)" autocomplete="off" minlength="6" maxlength="20"
              :show-password="true" type="password" placeholder="请输入密码" ></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div style="margin-top: 20px;display: flex;align-items: center;color:#666">
        <div style="display: flex;align-items: center;">
          <!-- <el-checkbox v-model="formData.isRemember" style="margin-right:10px" id="rpassword"></el-checkbox>
          <label for="rpassword">记住密码</label> -->
        </div>
        <span style="margin-left:auto;cursor: pointer;" @click="handleResetPassword">忘记密码</span>
      </div>
      <div class="opperate-btns" style="display: flex;">
        <el-button class="btn-login" @click="() => handleLogin(ruleLoginForm)">登录</el-button>
        <el-button style="margin-left:auto" @click="() => handleRegister()">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElNotification } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import { HandleLogin } from "@/api/user"
const ruleLoginForm = ref<FormInstance>()
const emits = defineEmits(['login', 'register','reset-password'])
const formData = reactive({
  isRemember: false,
  email: '',
  password: ''
})
const handleLogin = async function (form: FormInstance | undefined) {
  let isValid = await form?.validate()
  if (isValid) {
    let res = await HandleLogin({
      email: formData.email,
      password: formData.password
    })
    if (res.success) {
      ElNotification({
        message: "登录成功！",
        type: "success"
      })
      let token = res.data.token
      localStorage.setItem('app_token', token)
      localStorage.setItem('user', JSON.stringify({
        account: formData.email
      }))
      emits("login", formData.email)
    }
  }
}

const handleRegister = function () {
  emits("register")
}
const handleResetPassword = function (){
  emits("reset-password")
}

const checkEmail = (rule: any, value: any, callback: any) => {
  const mailReg = /([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  if (!value) {
    return callback(new Error('邮箱不能为空'))
  }
  if (mailReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱格式'))
  }
};
const checkPassword = (rule: any, value: any, callback: any) => {
  //必须包含⼤⼩写字母、数字、特殊字符长度再9-16位之间
  if (value === "") {
    callback(new Error("请输⼊密码"));
  } else if (value.length < 6) {
    callback(new Error("密码不得少于6位"));
  } else if (value.length > 16) {
    callback(new Error("密码不得大于16位"));
  } else {
    callback();
  }
};
const loginRules = reactive<FormRules>({
  email: [
    { validator: checkEmail, trigger: 'blur' },
  ],
  password: [
    { validator: checkPassword, trigger: 'blur' },
  ],
})
</script>

<style lang="scss" scoped>
.form-body {
  display: flex;
  height: 100%;
}

.form-left {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 100px;
}

:deep(.form-right) {
  width: 400px;
  padding-right: 40px;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .el-form-item__content {
    line-height: unset;
    display: unset;
  }

  .form-input {
    height: 60px;
    border: 0.2px solid #2222;
    display: flex;
    flex-direction: column;
    justify-content: center;

    label {
      padding: 0 11px;
      color: #ccc;
    }

    .el-input {
      border: none;

      .el-input__wrapper {
        border: none;
        box-shadow: none;
      }
    }
  }

  .opperate-btns {
    font-weight: bold;
    margin-top: 20px;

    .el-button {
      width: 100px;
    }

    .btn-login {
      background-color: #333e;
      border-color: #333;
      color: white;

      &:hover {
        background-color: #333;
      }
    }


  }

  .login-other-way {
    // width: 100%;
    height: 30px;
    margin-top: 20px;
    display: flex;
    align-items: center;

    .way-qq,
    .way-wx {
      height: 100%;

      img {
        height: 100%;
      }
    }

    .way-wx {
      margin-left: 80px;
    }
  }
}
</style>