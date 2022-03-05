<template>
  <div>
    <a-form layout="vertical"
            class="form"
            ref="form"
            :label-col="{ span: 10, offset: 7 }"
            :wrapper-col="{ span: 10, offset: 7 }">
      <a-form-item label="手机号:" name="email">
        <a-input size="large" v-model:value="formData.phone"/>
      </a-form-item>
      <a-form-item label="验证码:" name="verificationCode">
        <a-input-group size="large">
          <a-row type="flex">
            <a-col flex="auto">
              <a-input v-model:value="formData.verificationCode"/>
            </a-col>
            <a-col>
              <a-button :disabled="getPhoneCodeBtnDisable" size="large" @click="getPhoneCode">
                获取验证码
                <span v-if="getPhoneCodeCountDown>0">({{ getPhoneCodeCountDown }})</span>
              </a-button>
            </a-col>
          </a-row>
        </a-input-group>
      </a-form-item>
      <a-form-item>
        <a-button size="large" type="primary" html-type="submit">注册</a-button>
        <a-button size="large" style="margin-left: 10px" @click="reset">重置</a-button>
        <a-button size="large" style="margin-left: 10px" @click="$router.go(-1)">返回</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {isPhone} from "@/utils/RegExpUtil";

export default {
  name: "Phone",
  data() {
    return {
      formData: {
        phone: '',
        verificationCode: ''
      },
      getPhoneCodeCountDown: -1,
      getPhoneCodeBtnDisable: false,
      getPhoneCodeInterval: undefined,
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    getPhoneCode() {
      const phone = this.formData.phone
      if (phone == '') {
        return
      }
      if (!isPhone(phone)) {
        return
      }
      this.getPhoneCodeBtnDisable = true
      this.getPhoneCodeCountDown = 59
      this.getPhoneCodeInterval = setInterval(() => {
        this.getPhoneCodeCountDown--
        if (this.getPhoneCodeCountDown <= 0) {
          clearInterval(this.getPhoneCodeInterval)
          this.getPhoneCodeBtnDisable = false
          return
        }
      }, 1000)
    }
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