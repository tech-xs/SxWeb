<template>
  <a-modal v-model:visible="modalVisible"
           title="添加菜单"
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
      <a-form-item label="编码" name="code">
        <a-input v-model:value="formData.code" allowClear/>
      </a-form-item>
      <a-form-item label="图标" name="icon">
        <a-input v-model:value="formData.icon" allowClear/>
      </a-form-item>
      <a-form-item label="排序" name="sort">
        <a-input-number style="width: 100%" v-model:value="formData.sort" :min="0" :max="1000000"/>
      </a-form-item>
      <a-form-item label="页面">
        <a-select v-model:value="formData.pageId"
                  allowClear
                  showSearch
                  :filterOption="pageFilterOption">
          <a-select-option v-for="item of rootPages" :value="item.id" :key="item.id">
            {{ item.name }} - {{ item.uri }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="父菜单">
        <a-select v-model:value="formData.fatherId"
                  allowClear
                  showSearch
                  :filterOption="menuFilterOption">
          <a-select-option v-for="item of menus" :value="item.id" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{offset: 17}">
        <a-button type="primary" html-type="submit">添加</a-button>
        <a-button style="margin-left: 10px" @click="resetBtnClick">重置</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {listAllRoot} from "@/api/sys/page";
import {addMenu} from "@/api/sys/menu";
import {listAll as listMenuAll} from "@/api/sys/menu";
import XEUtils from "xe-utils";

const initFormData = {
  name: '',
  code: '',
  sort: 0,
  pageId: undefined,
  fatherId: undefined
}

export default {
  name: "MenuAdd",
  data() {
    return {
      menus: [],
      rootPages: [],
      modalVisible: false,
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
        icon: [
          {max: 128, message: '最多为128个字符', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    listAllRoot().then(res => {
      if (res.code != 200) {
        this.$message.error('页面数据获取失败')
      }
      this.rootPages = res.data
    })
    listMenuAll().then(res => {
      if (res.code != 200) {
        this.$message.error('菜单数据获取失败')
      }
      this.menus = res.data
    })
  },
  methods: {
    show(fatherId) {
      this.formData = XEUtils.clone(initFormData, true)
      this.formData.fatherId = fatherId
      this.modalVisible = true
    },
    submitBtnClick() {
      addMenu(this.formData).then(res => {
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
    menuFilterOption(inputValue, option) {
      let menuId = option.value
      let menu = undefined
      for (const item of this.menus) {
        if (menuId == item.id) {
          menu = item
          break
        }
      }
      if (!menu) {
        return false
      }
      if (menu.name.indexOf(inputValue) >= 0) {
        return true
      }
      return false
    },
    pageFilterOption(inputValue, option) {
      let pageId = option.value
      let page = undefined
      for (const item of this.rootPages) {
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
  }
}
</script>

<style scoped>

</style>