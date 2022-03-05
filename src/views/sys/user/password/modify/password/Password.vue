<template>
  <a-form
      layout="vertical"
      class="form"
      @finish="modifyPassword"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 10, offset: 7 }"
      :wrapper-col="{ span: 10, offset: 7 }">
    <a-form-item label="登陆密码" name="oldPassword">
      <a-input-password size="large" v-model:value="formData.oldPassword"/>
    </a-form-item>
    <a-form-item label="新密码" name="newPassword">
      <a-input-password size="large" v-model:value="formData.newPassword"/>
    </a-form-item>
    <a-form-item label="再次输入新密码" name="reNewPassword">
      <a-input-password size="large" v-model:value="formData.reNewPassword"/>
    </a-form-item>
    <a-form-item>
      <a-button size="large" type="primary" html-type="submit">修改密码</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import {modifyPasswordByOldPassword} from "@/api/sys/user";

export default {
  name: "Password",
  data() {
    return {
      formData: {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
      },
      rules: {
        oldPassword: [
          {required: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {whitespace: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {min: 6, message: '密码为最少6个字符', trigger: 'blur'},
          {max: 32, message: '密码为最多32个字符', trigger: 'blur'},
        ],
        newPassword: [
          {required: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {whitespace: true, message: '密码不能为空', trigger: ['change', 'blur']},
          {min: 6, message: '密码为最少6个字符', trigger: 'blur'},
          {max: 32, message: '密码为最多32个字符', trigger: 'blur'},
        ],
        reNewPassword: [
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
    modifyPassword() {
      const data = {
        oldPassword: this.formData.oldPassword,
        newPassword: this.formData.newPassword,
      };
      modifyPasswordByOldPassword(data).then(res => {
        if (res.code == 200) {
          this.$message.success('修改成功')
          this.$router.push('/user/info')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkPassword(rule, value) {
      if (value === '') {
        return Promise.reject("不能为空");
      }
      if (value == this.formData.newPassword) {
        return Promise.resolve();
      }
      return Promise.reject("两次密码输入不一致");
    },
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