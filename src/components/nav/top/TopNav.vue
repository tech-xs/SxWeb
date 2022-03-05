<template>
  <div class="nav">
    <div class="topNav leftTopNav">
      <span class="text logo" @click="$router.push('/home')">{{ web.name }}</span>
      <template v-if="topMenu">
        <template v-for="menu of topMenu" :key="menu">
           <span v-if="!menu.childList" class="text topManu" @click="menuClick(menu)">
              {{ menu.name }}
           </span>
          <a-dropdown class="topManu" overlayClassName="xsTopNavSubMenu" v-if="menu.childList">
            <span class="text" @click.prevent>{{ menu.name }}</span>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="childMenu of menu.childList" :key="childMenu"
                             @click="menuClick(childMenu)">
                  <span class="item">{{ childMenu.name }}</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </template>
    </div>
    <div class="menu">
      <a-dropdown v-if="!isLogin" overlayClassName="xsTopNavSubMenu">
        <span class="text" @click.prevent>登陆</span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$router.push('/login')">
              <span class="item">登陆</span>
            </a-menu-item>
            <a-menu-item v-if="web.accountRegister.enable" @click="$router.push('/register')">
              <span class="item">注册</span>
            </a-menu-item>
            <a-menu-item>
              <span class="item" @click="$router.push('/password/reset')">重置密码</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <a-dropdown v-if="isLogin" overlayClassName="xsTopNavSubMenu">
        <span class="text" @click.prevent>控制台</span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$router.push('/user/info')">
              <span class="item">控制台</span>
            </a-menu-item>
            <a-menu-item @click="logout">
              <span class="item">退出登录</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import global from "@/core/global";
import {logout} from "@/api/sys/user";
import {Modal} from 'ant-design-vue';
import config from "@/config.json";

export default {
  name: "TopNav",
  data() {
    return {
      isLogin: false,
      topMenu: [],
      web: {
        name: '',
        accountRegister: {
          enable: false,
        },
      },
    }
  },
  created() {
    this.web.name = process.env.VUE_APP_WEB_NAME
    const that = this;
    this.isLogin = global.isLogin()
    let webInterval = setInterval(function () {
      if (global.web.name != undefined && global.web.name != '') {
        that.web = global.web
        clearInterval(webInterval)
      }
    }, 100)
    if (config.home && config.home && config.home.topMenu) {
      this.topMenu = config.home.topMenu
    }
  },
  methods: {
    menuClick(menu) {
      if (menu.uriType == 'redirect') {
        window.open(menu.uri, '_blank')
      } else {
        this.$router.push(menu.uri)
      }
    },
    logout() {
      const that = this;
      Modal.confirm({
        title: '退出登陆',
        content: '您是否确认要退出登陆',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          logout().then(() => {
            that.isLogin = global.isLogin()
          })
        },
      });
    }
  }
}
</script>


<style lang="less" scoped>

@navHeight: 60px;
@navBackground: #100903;
@navTextColor: aliceblue;
@navTextHoverColor: #426EB4;

.nav {
  height: @navHeight;
  background-color: @navBackground;
  padding-left: 30%;
  padding-right: 30%;
  display: flex;
  justify-content: space-between;
}

.topNav {
  .text {
    color: @navTextColor;
    font-size: 2em;
    font-weight: bold;
    font-family: "楷体", "楷体_GB2312";
    line-height: @navHeight;
  }

  .topManu:hover {
    color: @navTextHoverColor;
  }
}

.leftTopNav {
  .logo {
    padding-right: 50px;
  }

  .topManu {
    margin-left: 15px;
  }

}

.menu {
  .text {
    color: @navTextColor;
    font-size: 1.5em;
    line-height: @navHeight;
    margin-left: 10px;
  }

  .text:hover {
    color: @navTextHoverColor;
  }
}

</style>

<style lang="less">
@navBackground: #100903;
@navTextColor: aliceblue;
@navTextColor: aliceblue;
@navTextHoverColor: #426EB4;

.xsTopNavSubMenu {
  .ant-dropdown-content {
    margin-top: 13px;
    padding: 10px;
    background-color: @navBackground;
  }

  .item {
    color: @navTextColor;
    font-size: 1.2em;
  }

  .item:hover {
    color: @navTextHoverColor;
  }

  .ant-dropdown-menu {
    background-color: @navBackground;
  }

  .ant-dropdown-menu-item-selected {
    background-color: @navBackground;
  }

  .ant-dropdown-menu-item:hover {
    background-color: @navBackground;
  }
}
</style>