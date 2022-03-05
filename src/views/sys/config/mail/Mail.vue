<template>
  <a-form
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 21 }">
    <a-form-item label="服务类型">
      <a-select v-model:value="mailType">
        <a-select-option value="empty">无</a-select-option>
        <a-select-option value="qq">QQ邮箱</a-select-option>
        <a-select-option value="netease">163邮箱</a-select-option>
        <a-select-option value="aliYunEnterprise">阿里云企业邮箱</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
  <Empty v-show="mailType === 'empty'"/>
  <AliYunEnterprise ref="aliYunEnterprise" v-show="mailType === 'aliYunEnterprise'"/>
  <Qq ref="qq" v-show="mailType === 'qq'"/>
  <Netease ref="netease" v-show="mailType === 'netease'"/>
</template>

<script>
import AliYunEnterprise from '@/views/sys/config/mail/aliyun/enterprise/AliYunEnterprise'
import Empty from '@/views/sys/config/mail/empty/Empty'
import Qq from "@/views/sys/config/mail/qq/Qq";
import Netease from "@/views/sys/config/mail/netease/Netease";
import {getMailConfig} from "@/api/sys/config";

export default {
  name: "Mail",
  components: {Empty, AliYunEnterprise, Qq, Netease},
  data() {
    return {
      mailType: 'empty'
    }
  },
  created() {
    getMailConfig().then(res => {
      if (res.code == 200) {
        this.mailType = res.data.mailType
        switch (this.mailType) {
          case 'aliYunEnterprise': {
            this.$refs.aliYunEnterprise.init()
            this.$refs.aliYunEnterprise.setFormData(res.data)
            break
          }
          case 'qq': {
            this.$refs.qq.init()
            this.$refs.qq.setFormData(res.data)
            break
          }
          case 'netease': {
            this.$refs.netease.init()
            this.$refs.netease.setFormData(res.data)
            break
          }
          default: {
            break;
          }
        }
        this.$forceUpdate()
      }
    })
  }
}
</script>

<style scoped>

</style>