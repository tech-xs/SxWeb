<template>
  <Mgr>
    <a-collapse>
      <a-collapse-panel header="网站设置">
        <Web></Web>
      </a-collapse-panel>
      <a-collapse-panel header="邮件服务设置">
        <Mail></Mail>
      </a-collapse-panel>
    </a-collapse>
  </Mgr>
</template>

<script>
import Mgr from '@/components/mgr/Mgr'
import Web from "@/views/sys/config/web/Web";
import Mail from "@/views/sys/config/mail/Mail";

export default {
  name: "Config",
  components: { Mgr, Web ,Mail}
}
</script>

<style scoped>

</style>

