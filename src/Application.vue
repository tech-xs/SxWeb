<template>
  <router-view></router-view>
</template>

<script>

import {getPublicInitWebConfig} from "@/api/sys/config"
import global from "@/core/global";
import {loginInit} from "@/api/sys/web";
import {setIcon} from "./utils/WebUtil";

export default {
  name: 'Application',
  created() {
    this.getPublicInitWebConfig()
    loginInit()
  },
  methods: {
    getPublicInitWebConfig() {
      getPublicInitWebConfig().then(res => {
        if (res.code != 200) {
          return
        }
        for (const config of res.data) {
          if (config.configKey == 'web:name' && config.configName == 'web:name') {
            global.web.name = config.configValue
            document.title = global.web.name
          } else if (config.configName === 'account:register' && config.configKey === 'account:register:email:enable' && config.configValue === '1') {
            global.web.accountRegister.enable = true
            global.web.accountRegister.emailRegister = true
          } else if (config.configName === 'account:register' && config.configKey === 'account:register:phone:enable' && config.configValue === '1') {
            global.web.accountRegister.enable = true
            global.web.accountRegister.phoneRegister = true
          } else if (config.configName === 'web:icon' && config.configKey === 'web:icon' && config.configValue && config.configValue != '') {
            global.web.icon = config.configValue
          } else if (config.configName === 'storage:web:root' && config.configKey === 'storage:web:root') {
            global.web.resource.root = config.configValue
          }
        }
        setIcon()
      })
    }
  }
}
</script>

<style lang="less">

</style>

