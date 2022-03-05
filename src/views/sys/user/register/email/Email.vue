<template>
  <div>
    <a-form layout="vertical"
            class="form"
            ref="form"
            @finish="register"
            :rules="rules"
            :model="formData"
            :label-col="{ span: 10, offset: 7 }"
            :wrapper-col="{ span: 10, offset: 7 }">
      <a-form-item label="邮箱:" name="email">
        <a-input size="large" v-model:value="formData.email"/>
      </a-form-item>
      <a-form-item label="密码:" name="password">
        <a-input-password size="large" v-model:value="formData.password"/>
      </a-form-item>
      <a-form-item label="再次输入密码:" name="rePassword">
        <a-input-password size="large" v-model:value="formData.rePassword"/>
      </a-form-item>
      <a-form-item label="验证码:" name="verificationCode">
        <a-input-group size="large">
          <a-row type="flex">
            <a-col flex="auto">
              <a-input v-model:value="formData.verificationCode"/>
            </a-col>
            <a-col>
              <a-button :disabled="getEmailCodeBtnDisable" size="large" @click="getEmailCode">
                获取验证码
                <span v-if="getEmailCodeCountDown>0">({{ getEmailCodeCountDown }})</span>
              </a-button>
            </a-col>
          </a-row>
        </a-input-group>
      </a-form-item>
      <a-form-item>
        <a-button size="large" type="primary" html-type="submit">注册</a-button>
        <a-button size="large" style="margin-left: 10px" @click="reset">重置</a-button>
        <a-button size="large" style="margin-left: 10px" @click="$router.go(-1)">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {isEmail} from "@/utils/RegExpUtil";
import {getRegisterEmailVerificationCode, registerEmail} from "@/api/sys/user"

export default {
  name: "Email",
  data() {
    return {
      formData: {
        email: '',
        verificationCode: '',
        password: '',
        rePassword: '',
      },
      getEmailCodeCountDown: -1,
      getEmailCodeBtnDisable: false,
      getEmailCodeInterval: undefined,
      rules: {
        email: [
          {required: true, message: '邮箱不能为空', trigger: ['change', 'blur']},
          {whitespace: true, message: '邮箱不能为空', trigger: ['change', 'blur']},
          {max: 128, message: '邮箱最多为128个字符', trigger: ['change', 'blur']},
          {validator: this.checkEmail, trigger: ['change', 'blur']}
        ],
        verificationCode: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {whitespace: true, message: '密码不能为空', trigger: 'blur'},
          {min: 6, max: 6, message: '验证码为6个字符', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {whitespace: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {min: 6, message: '密码为最少6个字符', trigger: 'blur'},
          {max: 32, message: '密码为最多32个字符', trigger: 'blur'},
        ],
        rePassword: [
          {required: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {whitespace: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {min: 6, message: '密码为最少6个字符', trigger: 'blur'},
          {max: 32, message: '密码为最多32个字符', trigger: 'blur'},
          {validator: this.checkPassword, trigger: ['change', 'blur']}
        ],
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    register() {
      const data = {
        email: this.formData.email,
        verificationCode: this.formData.verificationCode,
        password: this.formData.password
      };
      registerEmail(data).then(res => {
        if (res.code == 200) {
          this.$message.success('注册成功')
          this.$router.push('/home')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkPassword(rule, value) {
      if (value === '') {
        return Promise.reject("不能为空");
      }
      if (value == this.formData.password) {
        return Promise.resolve();
      }
      return Promise.reject("两次密码输入不一致");
    },
    checkEmail(rule, value) {
      if (value === '') {
        return Promise.resolve();
      }
      if (!isEmail(value)) {
        return Promise.reject("邮箱格式错误");
      }
      return Promise.resolve();
    },
    /**
     * 获取邮箱验证码,并且设置按钮倒计时
     */
    getEmailCode() {
      const email = this.formData.email
      if (email == '') {
        return
      }
      if (!isEmail(email)) {
        return
      }
      this.getEmailCodeBtnDisable = true
      this.getEmailCodeCountDown = 59
      this.getEmailCodeInterval = setInterval(() => {
        this.getEmailCodeCountDown--
        if (this.getEmailCodeCountDown <= 0) {
          clearInterval(this.getEmailCodeInterval)
          this.getEmailCodeBtnDisable = false
          return
        }
      }, 1000)
      getRegisterEmailVerificationCode(email)
    }
  }
}
</script>

<style lang="less" scoped>

.form {
  margin-top: 23px;

  :deep(.ant-form-item-label label) {
    font-size: 1.5em;
    font-weight: bold;
  }

}

</style>