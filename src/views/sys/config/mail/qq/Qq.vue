<template>
  <div>
    <a-form
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 21 }"
        @finish="save"
        :model="formData"
        :rules="rules">
      <a-form-item label="邮箱" name="userName">
        <a-input v-model:value="formData.userName" allowClear placeholder="示例: 88888888@qq.com"/>
      </a-form-item>
      <a-form-item label="授权码" name="password">
        <a-input-password v-model:value="formData.password"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 2 }">
        <a-button type="primary" html-type="submit">保存</a-button>
        <a-button style="margin-left: 10px" @click="test">测试</a-button>
      </a-form-item>
    </a-form>
    <a-modal
        title="测试邮箱配置"
        v-model:visible="testModalVisible"
        :confirm-loading="sendConfirmLoading"
        okText="发送"
        cancelText="取消"
        @ok="sendTestMail">
      <p>请输入收件人邮箱</p>
      <a-input v-model:value="testMail"/>
    </a-modal>
  </div>
</template>

<script>
import {modifyMailConfig} from "@/api/sys/config";
import {mailTest} from "@/api/sys/notice";
import {Modal} from "ant-design-vue";

export default {
  name: "Qq",
  data() {
    return {
      testModalVisible: false,
      sendConfirmLoading: false,
      testMail: '',
      formData: {
        userName: '',
        password: '',
      },
      rules: {
        userName: [
          {required: true, message: '不能为空', trigger: ['change', 'blur']},
          {whitespace: true, message: '不能为空', trigger: ['change', 'blur']},
        ],
        password: [
          {required: true, message: '不能为空', trigger: ['change', 'blur']},
          {whitespace: true, message: '不能为空', trigger: ['change', 'blur']},
        ],
      }
    }
  },
  methods: {
    init() {
      this.sendConfirmLoading = false
    },
    setFormData(data) {
      this.formData.userName = data.userName
      this.formData.password = data.password
    },
    test() {
      this.testModalVisible = true
    },
    save() {
      const data = {
        mailType: 'qq',
        userName: this.formData.userName,
        password: this.formData.password,
      };
      modifyMailConfig(data).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    sendTestMail() {
      if (!this.testMail || this.testMail == '') {
        return
      }
      this.sendConfirmLoading = true
      mailTest({
        to: this.testMail
      }).then(res => {
        if (res.code == 200) {
          this.$message.success('发送成功')
          this.testModalVisible = false
          this.sendConfirmLoading = false
          return
        } else {
          this.$message.error(res.msg)
        }
        this.testModalVisible = false
        this.sendConfirmLoading = false
        Modal.error({
          width: '60%',
          title: () => '异常信息',
          okText: '确认',
          content: () => res.data,
        });
      })
    },
  }
}
</script>

<style scoped>

</style>