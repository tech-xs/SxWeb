<template>
  <a-modal v-model:visible="modalVisible"
           title="添加权限"
           footer
           :maskClosable="false">
    <a-form
        ref="form"
        :labelCol="{span: 3, offset: 0}"
        @finish="submitBtnClick"
        :model="formData"
        :rules="rules">
      <a-form-item label="名称" name="permissionName">
        <a-input v-model:value="formData.permissionName"/>
      </a-form-item>
      <a-form-item label="编码" name="permissionCode">
        <a-input v-model:value="formData.permissionCode"/>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-input v-model:value="formData.remark"/>
      </a-form-item>
      <a-form-item :wrapper-col="{offset: 17}">
        <a-button type="primary" html-type="submit">添加</a-button>
        <a-button style="margin-left: 10px" @click="resetBtnClick">重置</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {addPermission} from "@/api/sys/pagePermission";
import XEUtils from "xe-utils";

const initFormData = {
  permissionName: '',
  permissionCode: '',
  remark: ''
}

export default {
  name: "PagePermissionAdd",
  props: ['page'],
  data() {
    return {
      modalVisible: false,
      formData: XEUtils.clone(initFormData, true),
      rules: {
        permissionCode: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
        permissionName: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    show() {
      this.formData = XEUtils.clone(initFormData, true)
      this.modalVisible = true
    },
    submitBtnClick() {
      let formData = {
        ...this.formData,
        pageId: this.page.id
      }
      addPermission(formData).then(res => {
        if (res.code == 200) {
          this.$message.success('添加成功')
          this.modalVisible = false
          this.$emit('result', true)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    resetBtnClick() {
      this.$refs.form.resetFields()
    },
  }
}
</script>

<style scoped>

</style>