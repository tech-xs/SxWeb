<template>
  <a-modal v-model:visible="modalVisible"
           title="添加用户"
           footer
           :maskClosable="false">
    <a-form
        ref="form"
        :labelCol="{span: 3, offset: 0}"
        @finish="submitBtnClick"
        :model="formData"
        :rules="rules">
      <a-form-item label="用户名" name="userName">
        <a-input v-model:value="formData.userName"/>
      </a-form-item>
      <a-form-item label="角色" name="sex">
        <a-select v-model:value="formData.roleIdList" mode="multiple">
          <a-select-option v-for="item of roleList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="昵称" name="nickName">
        <a-input v-model:value="formData.nickName"/>
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="formData.phone"/>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formData.email"/>
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <DictSelect
            v-model:value="formData.sex"
            :dict="sexDict"/>
      </a-form-item>
      <a-form-item label="状态" name="accountStatus">
        <DictSelect
            v-model:value="formData.accountStatus"
            :dict="accountStatusDict"/>
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formData.password"/>
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
import {addUser} from "@/api/sys/user";
import {listAll as roleListAll} from "@/api/sys/role";
import XEUtils from 'xe-utils'

const initFormData = {
  userName: '',
  nickName: '',
  phone: '',
  email: '',
  sex: 3,
  accountStatus: 1,
  password: '',
  roleIdList: [],
}

export default {
  name: "UserAdd",
  components: {DictSelect},
  data() {
    return {
      modalVisible: false,
      sexDict: {},
      roleList: [],
      accountStatusDict: {},
      formData: XEUtils.clone(initFormData, true),
      rules: {
        userName: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 32, message: '最多为32个字符', trigger: 'blur'},
        ],
        phone: [
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
        email: [
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
        nickName: [
          {max: 32, message: '最多为32个字符', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 32, message: '最多为32个字符', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    Promise.all([cache.dict.getByCode('sex', 'accountStatus'), roleListAll()]).then(res => {
      // 获取字典
      const dictRes = res[0]
      this.sexDict = dictRes.sex
      this.accountStatusDict = dictRes.accountStatus
      //获取角色列表
      const roleRes = res[1]
      if (roleRes.code != 200) {
        this.$message.error('角色信息获取失败')
        return
      }
      this.roleList = roleRes.data
    })
  },
  methods: {
    show() {
      this.formData = XEUtils.clone(initFormData, true)
      this.modalVisible = true
    },
    resetBtnClick() {
      this.$refs.form.resetFields()
      this.formData.sex = 3
      this.formData.accountStatus = 1
    },
    submitBtnClick() {
      addUser(this.formData).then(res => {
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