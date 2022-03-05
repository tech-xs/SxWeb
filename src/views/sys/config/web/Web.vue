<template>
  <a-form
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 21 }">
    <a-form-item label="网站Logo">
      <img v-if="!iconSrc" class="icon" @click="showAvatarEdit" src="~@/assets/sys/default/img-add.png"/>
      <img v-if="iconSrc" class="avatar" @click="showAvatarEdit" :src="iconSrc"/>
    </a-form-item>
    <a-form-item label="网站名称">
      <a-input v-model:value="formData.webName"/>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 2 }">
      <a-button type="primary" @click="save">保存</a-button>
    </a-form-item>
    <ImgCropUpload
        v-if="isShowAvatarEdit"
        :url="iconUploadUrl"
        field="iconFile"
        img-format="png"
        :withCredentials="true"
        v-model="isShowAvatarEdit"
        :headers="uploadImgHeaders"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"/>
  </a-form>
</template>

<script>
import ImgCropUpload from '@/components/img-crop-upload/ImgCropUpload'
import AuthConstant from '@/constant/auth'
import global from "@/core/global"
import {setIcon} from "@/utils/WebUtil";
import {modifyWebName} from "@/api/sys/config";

export default {
  name: "Web",
  components: {ImgCropUpload},
  data() {
    return {
      iconSrc: '',
      formData: {
        webName: '',
      },
      isShowAvatarEdit: false,
      iconUploadUrl: '',
      uploadImgHeaders: {},
    }
  },
  created() {
    const token = global.auth.token.getAccessToken()
    if (token) {
      this.uploadImgHeaders[AuthConstant.HEADER_TOKEN_NAME] = token
    }
    this.iconUploadUrl = process.env.VUE_APP_BASE_URL + '/sys/modify/icon'
    if (global.web.icon && global.web.icon != '') {
      this.iconSrc = global.web.resource.root + global.web.icon
    }
    this.formData.webName = global.web.name
  },
  methods: {
    save() {
      modifyWebName(this.formData).then(res => {
        if (res.code == 200) {
          global.web.name = this.formData.webName
          location.reload()
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    showAvatarEdit() {
      this.isShowAvatarEdit = true
    },
    cropUploadSuccess(data) {
      this.isShowAvatarEdit = false
      if (data.code === 200) {
        global.web.icon = data.data
        this.iconSrc = global.web.resource.root + data.data
        setIcon()
        this.$message.success('上传成功')
      } else {
        this.$message.error('上传失败')
      }
    },
    cropUploadFail() {
      this.$message.error('上传失败')
    },
  }
}
</script>

<style lang="less" scoped>

.icon {
  border-radius: 40px;
  width: 80px;
  height: 80px;
  margin-top: 30px;
}

</style>