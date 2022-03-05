<template>
  <a-modal v-model:visible="modalVisible"
           title="修改密码"
           footer
           :maskClosable="false">
    <a-form
        ref="form"
        @finish="submitBtnClick"
        :rules="rules"
        :labelCol="{span: 3, offset: 0}"
        :model="formData">
      <a-form-item label="用户名">
        <span>{{ user.userName }}</span>
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formData.password"/>
      </a-form-item>
      <a-form-item :wrapper-col="{offset: 17}">
        <a-button type="primary" html-type="submit">修改</a-button>
        <a-button style="margin-left: 10px" @click="resetBtnClick">重置</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {modifyPasswordById} from "@/api/sys/user";

export default {
  name: "ResetUserPassword",
  props: ['user'],
  data() {
    return {
      modalVisible: false,
      formData: {
        password: '',
      },
      rules: {
        password: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 32, message: '最多为32个字符', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    show() {
      this.modalVisible = true
    },
    resetBtnClick() {
      this.$refs.form.resetFields()
    },
    submitBtnClick() {
      let data = {
        id: this.user.id,
        password: this.formData.password
      }
      modifyPasswordById(data).then(res => {
        if (res.code == 200) {
          this.$message.success('修改成功')
          this.modalVisible = false
          this.$emit('result', true)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>