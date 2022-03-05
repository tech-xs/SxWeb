<template>
  <Mgr>
    <div class="title">
      修改密码
    </div>
    <a-row class="label">
      <a-col :span="10" :offset="7">
        <span>修改方式</span>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="10" :offset="7">
        <a-select size="large" v-model:value="modifyType">
          <a-select-option value="password">登陆密码</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <Password v-if="modifyType === 'password'"/>
  </Mgr>
</template>

<script>
import Mgr from "@/components/mgr/Mgr";
import Password from '@/views/sys/user/password/modify/password/Password'

export default {
  name: "ModifyPassword",
  components: {Mgr, Password},
  data() {
    return {
      modifyType: 'password'
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