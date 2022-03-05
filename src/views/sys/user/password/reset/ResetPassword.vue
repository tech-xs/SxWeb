<template>
  <div class="title" @click="this.$router.push('/home')">
    重置密码
  </div>
  <a-row class="label">
    <a-col :span="10" :offset="7">
      <span>重置方式:</span>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="10" :offset="7">
      <a-select size="large" v-model:value="resetType">
        <a-select-option value="email">邮箱</a-select-option>
        <a-select-option value="phone">手机号</a-select-option>
      </a-select>
    </a-col>
  </a-row>
  <Email v-if="resetType === 'email'"/>
  <Phone v-if="resetType === 'phone'"/>
</template>

<script>
import Email from '@/views/sys/user/password/reset/email/Email'
import Phone from '@/views/sys/user/password/reset/phone/Phone'

export default {
  name: "ResetPassword",
  components: {Email, Phone},
  data() {
    return {
      resetType: 'email'
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