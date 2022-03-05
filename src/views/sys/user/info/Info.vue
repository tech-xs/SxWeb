<template>
  <Mgr>
    <div class="center">
      <img v-if="!avatarSrc" class="avatar" src="~@/assets/sys/default/avatar.png"/>
    </div>
    <div class="center userName">
      <h1>{{ user.userName }}</h1>
    </div>
    <div class="info">
      <div class="body">
        <a-row class="text">
          <a-col :span="5">昵称:</a-col>
          <a-col :span="15">{{ user.nickName }}</a-col>
        </a-row>
        <a-row class="text">
          <a-col :span="5">性别:</a-col>
          <a-col :span="15">{{ user.sexStr }}</a-col>
        </a-row>
        <a-row class="text">
          <a-col :span="5">手机号:</a-col>
          <a-col :span="15">{{ user.phone }}</a-col>
        </a-row>
        <a-row class="text">
          <a-col :span="5">邮箱:</a-col>
          <a-col :span="15">{{ user.email }}</a-col>
        </a-row>
        <a-row class="text">
          <a-col :span="5">角色:</a-col>
          <a-col :span="15">{{ rolesStr }}</a-col>
        </a-row>
      </div>
    </div>
  </Mgr>
</template>

<script>
import Mgr from "@/components/mgr/Mgr";
import global from "@/core/global";
import { sex } from "@/constant/dict"


export default {
  name: "Info",
  components: { Mgr },
  data() {
    return {
      avatarSrc: undefined,
      rolesStr: '',
      user: {
        userName: '',
        nickName: '',
        phone: '',
        email: ''
      },
    }
  },
  created() {
    this.user = global.user
    this.user.sexStr = sex(global.user.sex)
    this.rolesStr = ''
    let rolesStr = ''
    for (const item of global.roles) {
      rolesStr = rolesStr + item.name + ','
    }
    if (rolesStr.length > 0) {
      this.rolesStr = rolesStr.slice(0, rolesStr.length - 1)
    }
  }
}
</script>

<style lang="less" scoped>

.center {
  display: flex;
  width: 100%;
  justify-content: center
}

.avatar {
  border-radius: 40px;
  width: 80px;
  height: 80px;
  margin-top: 30px;
}

.userName {
  margin-top: 10px
}

.info {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .body {
    width: 350px
  }

  .text {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    font-size: 1.17em;
    margin-top: 10px;
  }
}

</style>