<template>
  <div class="register-form">
    <div class="form-left">
      <el-form :model="formData" ref="ruleRegisterForm" :rules="registerRules">
        <el-form-item prop="email">
          <div class="form-input">
            <label for="register-email">Email</label>
            <el-input id="register-email" v-model.trim="formData.email"></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class="form-input">
            <label for="register-password">Password</label>
            <el-input id="register-password" minlength=6 maxlength=20 show-password type="password"
              v-model.trim="formData.password" autocomplete="off"></el-input>
          </div>

        </el-form-item>
        <el-form-item prop="checkPass">
          <div class="form-input">
            <label for="register-repeat-password">Repeat Password</label>
            <el-input id="register-repeat-password" show-password type="password" minlength=6 maxlength=20
              v-model.trim="formData.checkPass" autocomplete="off"></el-input>
          </div>

        </el-form-item>
        <el-form-item prop="verificationCode">
          <div>
            <div class="form-input">
              <label for="register-verification-code">Verification Code</label>
              <el-input id="register-verification-code" v-model="formData.verificationCode" autocomplete="off"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="sendVerificationCode(ruleRegisterForm)">发送验证码</el-button>
          <!-- <el-button plain @click="resetForm(ruleRegisterForm)">重置</el-button> -->
        </el-form-item>
      </el-form>
      <div class="opperate-btns" style="display: flex;">
        <el-button class="btn-register" @click="submitRegisterForm(ruleRegisterForm)" plain>注册</el-button>
        <el-button style="margin-left: auto;" @click="returnToLogin">登录</el-button>
      </div>
    </div>
    <div class="form-right">
      <img style="width:100% ;" src="@/assets/svg/home_pic2.svg" alt="">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElNotification } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import { HandleSendVerificationCode, HandleRegister } from "@/api/user"
const ruleRegisterForm = ref<FormInstance>()
const emits = defineEmits(['login'])

const formData = reactive({
  email: '',
  password: '',
  checkPass: '',
  verificationCode: ""
})
const submitRegisterForm = async (form: FormInstance | undefined) => {
  let isValid = await form?.validate();
  if (isValid) {
    const { data, success } = await HandleRegister({
      email: formData.email,
      password: formData.password,
      code: formData.verificationCode
    })
    if (success) {
      ElNotification({
        message: data as string,
        type: 'success'
      })
    }
  }
}
const resetForm = (form: FormInstance | undefined) => {
  form?.resetFields()
}
const sendVerificationCode = async (form: FormInstance | undefined) => {
  let isValid = await form?.validateField(['email']);
  if (isValid) {
    let res = (await HandleSendVerificationCode({
      email: formData.email,
      password: formData.password
    }))
    if (res.success) {
      ElNotification({
        type: 'success',
        message: "验证码已发送、注意查收"
      })
    }
  }
}
const returnToLogin = () => {
  emits('login')
}

//#region  规则校验
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
  var regex = new RegExp(/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/);
  if (value === "") {
    callback(new Error("请输⼊密码"));
  } else if (value.length < 6) {
    callback(new Error("密码不得少于6位"));
  } else if (value.length > 16) {
    callback(new Error("密码不得大于16位"));
  } else if (!regex.test(value)) {
    callback(new Error("密码必须同时包含字母、数字和特殊字符其中三项"));
  } else {
    callback();
  }
};
const checkPassRepeat = (rule: any, value: any, callback: any) => {
  //必须包含⼤⼩写字母、数字、特殊字符长度再9-16位之间
  if (value !== formData.password) {
    callback(new Error("两次输入的密码不一致！"));
  } else {
    callback();
  }
};
const checkVerificationCode = (rule: any, value: any, callback: any) => {
  //必须包含⼤⼩写字母、数字、特殊字符长度再9-16位之间
  if (value === '') {
    callback(new Error("请输入验证码"));
  } else {
    callback();
  }
};
const registerRules = reactive<FormRules>({
  email: [
    { validator: checkEmail, trigger: 'blur' },
  ],
  password: [
    { validator: checkPassword, trigger: 'blur' },
  ],
  checkPass: [
    { validator: checkPassRepeat, trigger: 'blur' },
  ],
  verificationCode: [
    { validator: checkVerificationCode, trigger: 'blur' }
  ]
})
//#endregion
</script>

<style lang="scss" scoped>
.register-form {
  height: 100%;
  width: 100%;
  display: flex;

  .form-right {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 100px;
  }

  :deep(.form-left) {
    width: 400px;
    padding-left: 40px;
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

      .el-button {
        width: 100px;
      }

      .btn-register {
        background-color: #333e;
        border-color: #333;
        color: white;

        &:hover {
          background-color: #333;
        }
      }


    }

    .login-other-way {
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
        margin-left: 10px;
      }
    }
  }
}
</style>