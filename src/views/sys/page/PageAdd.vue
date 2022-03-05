<template>
  <a-modal v-model:visible="modalVisible"
           title="添加页面"
           footer
           :maskClosable="false">
    <a-form
        ref="form"
        :labelCol="{span: 3, offset: 0}"
        @finish="submitBtnClick"
        :model="formData"
        :rules="rules">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="formData.name" allowClear/>
      </a-form-item>
      <a-form-item label="URI" name="uri">
        <a-input v-model:value="formData.uri" allowClear/>
      </a-form-item>
      <a-form-item label="父页面">
        <a-select v-model:value="formData.fatherId"
                  allowClear
                  showSearch
                  :filterOption="filterOption">
          <a-select-option v-for="item of pages" :value="item.id" :key="item.id">{{ item.name }} - {{ item.uri }}
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
import {addPage} from "@/api/sys/page";
import {listAll} from "@/api/sys/page";
import XEUtils from "xe-utils";

const initFormData = {
  name: '',
  uri: '',
  remark: '',
  fatherId: undefined,
}

export default {
  name: "PageAdd",
  data() {
    return {
      pages: [],
      modalVisible: false,
      formData: XEUtils.clone(initFormData, true),
      rules: {
        name: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
        uri: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {whitespace: true, message: '不能为空', trigger: 'blur'},
          {max: 1024, message: '最多为1024个字符', trigger: 'blur'},
        ],
        remark: [
          {max: 1024, message: '最多为1024个字符', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    listAll().then(res => {
      if (res.code != 200) {
        this.$message.error(res.msg)
        return
      }
      this.pages = res.data
    })
  },
  methods: {
    filterOption(inputValue, option) {
      let pageId = option.value
      let page = undefined
      for (const item of this.pages) {
        if (pageId == item.id) {
          page = item
          break
        }
      }
      if (!page) {
        return false
      }
      if (page.name.indexOf(inputValue) >= 0) {
        return true
      }
      if (page.uri.indexOf(inputValue) >= 0) {
        return true
      }
      return false
    },
    show() {
      this.formData = XEUtils.clone(initFormData, true)
      this.modalVisible = true
    },
    resetBtnClick() {
      this.$refs.form.resetFields()
    },
    submitBtnClick() {
      addPage(this.formData).then(res => {
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