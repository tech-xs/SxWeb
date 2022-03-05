<template>
  <a-form layout="vertical"
          class="form">
    <a-form-item label="用户名:" name="email">
      <a-input size="large" v-model:value="formData.userName"/>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: "Password",
  data() {
    return {
      formData: {
        userName: ''
      }
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