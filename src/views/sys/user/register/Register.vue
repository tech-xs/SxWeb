<template>
  <div class="title" @click="this.$router.go(-1)">
    账号注册
  </div>
  <a-row class="label">
    <a-col :span="10" :offset="7">
      <span>注册方式:</span>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="10" :offset="7">
      <a-select size="large" v-model:value="registerType">
        <a-select-option v-if="emailRegister" value="email">邮箱</a-select-option>
        <a-select-option v-if="phoneRegister" value="phone">手机号</a-select-option>
      </a-select>
    </a-col>
  </a-row>
  <Email v-if="registerType === 'email'"/>
  <Phone v-if="registerType === 'phone'"/>
</template>

<script>
import Email from "@/views/sys/user/register/email/Email";
import Phone from "@/views/sys/user/register/phone/Phone";
import global from "@/core/global";

export default {
  name: "Register",
  components: {Email, Phone},
  created() {
    this.emailRegister = global.web.accountRegister.emailRegister
    this.phoneRegister = global.web.accountRegister.phoneRegister
  },
  data() {
    return {
      registerType: 'email',
      emailRegister: false,
      phoneRegister: false
    }
  }
}
</script>

<style lang="less" scoped>

.title {
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.label {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 8px;
}
</style>