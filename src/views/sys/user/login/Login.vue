<template>
  <div class="title" @click="this.$router.push('/home')">
    用户登陆
  </div>
  <div>
    <a-form layout="vertical"
            class="form"
            ref="form"
            @finish="login"
            :model="loginForm"
            :rules="rules"
            :label-col="{ span: 10, offset: 7 }"
            :wrapper-col="{ span: 10, offset: 7 }">
      <a-form-item label="用户名:" name="account">
        <a-input size="large" v-model:value="loginForm.account"/>
      </a-form-item>
      <a-form-item label="密码:" name="password">
        <a-input-password size="large" v-model:value="loginForm.password"/>
      </a-form-item>
      <a-form-item>
        <a-button size="large" type="primary" html-type="submit">登陆</a-button>
        <a-button size="large" style="margin-left: 10px" @click="reset">重置</a-button>
        <a-button size="large" style="margin-left: 10px" @click="$router.go(-1)">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {getCurrentUser, login} from "@/api/sys/user";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userName: '',
        password: '',
      },
      rules: {
        account: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {whitespace: true, message: '用户名不能为空', trigger: 'blur'},
          {max: 32, message: '用户名最多为32个字符', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'},
          {whitespace: true, message: '密码不能为空', trigger: 'blur'},
          {max: 32, message: '密码最多为32个字符', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    login() {
      login(this.loginForm).then(res => {
        if (res.code == 200) {
          getCurrentUser().then(() => {
            this.$router.push('/home')
          })
          return
        }
        switch (res.code) {
          case 1002: {
            this.$message.error('账号或密码不正确')
            break
          }
          default: {
            this.$message.error(res.msg)
            break
          }
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    },
  }
}
</script>

<style lang="less" scoped>

.title {
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.form {
  margin-top: 30px;

  :deep(.ant-form-item-label label) {
    font-size: 1.5em;
    font-weight: bold;
  }

}

</style>