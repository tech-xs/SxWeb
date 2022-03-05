<template>
  <a-form
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 21 }">
    <a-form-item :wrapper-col="{ offset: 2 }">
      <a-button type="primary" @click="save">保存</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import {modifyMailConfig} from "@/api/sys/config";

export default {
  name: "Empty",
  data() {
    return {}
  },
  methods: {
    save() {
      const data = {
        mailType: 'empty',
      };
      modifyMailConfig(data).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功')
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