<template>
  <a-modal v-model:visible="modalVisible"
           title="添加可访问接口"
           footer
           :maskClosable="false">
    <a-form
        ref="form"
        :labelCol="{span: 3, offset: 0}"
        @finish="submitBtnClick"
        :model="formData"
        :rules="rules">
      <a-form-item label="接口" name="apiId">
        <a-select v-model:value="formData.apiId" showSearch :filterOption="apiFilterOption">
          <a-select-option v-for="item of apiList" :value="item.id" :key="item.id">
            {{ formatterApiOption(item) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="权限" name="permissionId">
        <a-select v-model:value="formData.permissionId" showSearch :filterOption="permissionFilterOption">
          <a-select-option v-for="item of permissionList" :value="item.id" :key="item.id">
            {{ formatterPermissionOption(item) }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-input v-model:value="formData.remark" allowClear/>
      </a-form-item>
      <a-form-item :wrapper-col="{offset: 17}">
        <a-button type="primary" html-type="submit">添加</a-button>
        <a-button style="margin-left: 10px" @click="resetBtnClick">重置</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import XEUtils from "xe-utils";
import {listAll as listAllApi} from "@/api/sys/api";
import {listAll as listAllPermission} from "@/api/sys/pagePermission";
import cache from "@/core/cache";
import {addApi} from "@/api/sys/pageApi";

const initFormData = {
  apiId: undefined,
  permissionId: undefined,
  remark: ''
}

export default {
  name: "PageApiAdd",
  props: ['page'],
  data() {
    return {
      modalVisible: false,
      formData: XEUtils.clone(initFormData, true),
      rules: {},
      apiList: [],
      httpMethodDict: {},
      permissionList: [],
    }
  },
  created() {
    Promise.all([listAllApi(), cache.dict.getByCode('httpMethod'), listAllPermission({pageId: this.page.id})]).then(res => {
      this.apiList = res[0].data
      const dictRes = res[1]
      this.httpMethodDict = dictRes.httpMethod
      this.permissionList = res[2].data
    })
  },
  methods: {
    permissionFilterOption(inputValue, option) {
      let permissionId = option.value
      let permission = undefined
      for (const item of this.permissionList) {
        if (permissionId == item.id) {
          permission = item
          break
        }
      }
      if (!permission) {
        return false
      }
      if (permission.permissionName.indexOf(inputValue) >= 0) {
        return true
      }
      if (permission.permissionCode.indexOf(inputValue) >= 0) {
        return true
      }
      return false
    },
    apiFilterOption(inputValue, option) {
      let apiId = option.value
      let api = undefined
      for (const item of this.apiList) {
        if (apiId == item.id) {
          api = item
          break
        }
      }
      if (!api) {
        return false
      }
      if (api.uri.indexOf(inputValue) >= 0) {
        return true
      }
      if (this.httpMethodDict.valueMap[api.method]) {
        if (this.httpMethodDict.valueMap[api.method].name.indexOf(inputValue) >= 0) {
          return true
        }
      }
      return false
    },
    show() {
      this.formData = XEUtils.clone(initFormData, true)
      this.modalVisible = true
    },
    submitBtnClick() {
      let data = {
        pageId: this.page.id,
        ...this.formData
      }
      addApi(data).then(res => {
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
    formatterPermissionOption(permission) {
      return permission.permissionName + ' - ' + permission.permissionCode
    },
    formatterApiOption(api) {
      if (this.httpMethodDict.valueMap[api.method]) {
        return this.httpMethodDict.valueMap[api.method].name + ' - ' + api.uri
      }
      return api.uri
    }
  }
}
</script>

<style scoped>

</style>