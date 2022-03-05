<template>
  <a-modal v-model:visible="modalVisible"
           title="添加角色"
           footer
           :maskClosable="false">
    <a-form
        ref="form"
        :labelCol="{span: 3, offset: 0}"
        @finish="submitBtnClick"
        :model="formData"
        :rules="rules">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formData.name"/>
      </a-form-item>
      <a-form-item label="编码" name="code">
        <a-input v-model:value="formData.code"/>
      </a-form-item>
      <a-form-item label="状态" name="status">
        <DictSelect
            v-model:value="formData.status"
            :dict="roleStatusDict"/>
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
import cache from "@/core/cache";
import DictSelect from "@/components/DictSelect";
import {addRole} from "@/api/sys/role";
import XEUtils from "xe-utils";

const initFormData = {
  name: '',
  code: '',
  status: 1,
  remark: ''
}

export default {
  name: "RoleAdd",
  components: {DictSelect},
  data() {
    return {
      modalVisible: false,
      roleStatusDict: {},
      formData: XEUtils.clone(initFormData, true),
      rules: {
        name: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
        code: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    cache.dict.getByCode('roleStatus').then(res => {
      this.roleStatusDict = res.roleStatus
    })
  },
  methods: {
    show() {
      this.formData = XEUtils.clone(initFormData, true)
      this.modalVisible = true
    },
    resetBtnClick() {
      this.$refs.form.resetFields()
    },
    submitBtnClick() {
      addRole(this.formData).then(res => {
        if (res.code == 200) {
          this.$message.success('添加成功')
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