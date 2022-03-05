<template>
  <div>
    <div class="top">
      <div class="logo" @click="$router.push('/home')">{{ web.name }}</div>
      <a-dropdown overlayClassName="xsMgrSubMenu" :trigger="['click']">
        <span class="text" @click.prevent>{{ user.name }}</span>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="$router.push('/user/info')">
              <span class="item">个人中心</span>
            </a-menu-item>
            <a-menu-item @click="$router.push('/password/modify')">
              <span class="item">修改密码</span>
            </a-menu-item>
            <a-menu-item @click="logout">
              <span class="item">退出登陆</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div class="body">
      <div>
        <a-menu
            :openKeys="openMenus"
            :selectedKeys="menuSelectedKeyList"
            @openChange="menuOpenChange"
            mode="inline">
          <menu-tree-component :menu-tree="menuTree"/>
        </a-menu>
      </div>
      <div class="main">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import global from "@/core/global";
import cache from "@/core/cache";
import {treeCurrMenu} from "@/api/sys/menu"
import {logout} from "@/api/sys/user"
import MenuTreeComponent from "./MenuTreeComponent";

export default {
  name: "Mgr",
  components: {MenuTreeComponent},
  data() {
    return {
      web: {
        name: ''
      },
      menuTree: [],
      menuList: [],
      openMenus: [],
      menuSelectedKeyList: [],
      user: {
        name: ''
      }
    }
  },
  created() {
    const that = this;
    this.isLogin = global.isLogin()
    let webInterval = setInterval(function () {
      that.web = global.web
      if (global.web.name != undefined && global.web.name != '') {
        clearInterval(webInterval)
      }
    }, 100)
    let userNameInterval = setInterval(function () {
      that.user.name = global.user.userName
      if (global.user.userName != undefined && global.user.userName != '') {
        clearInterval(userNameInterval)
      }
    }, 100)
    if (cache.menu.menuTree) {
      this.menuTree = cache.menu.menuTree
      this.openMenus = cache.menu.openMenus
      this.buildMenuList()
      this.initCurrSelectedMenu()
    } else {
      treeCurrMenu().then((res) => {
        if (res.code !== 200) {
          return
        }
        this.menuTree = res.data
        cache.menu.menuTree = res.data
        cache.menu.openMenus = this.openMenus
        this.buildMenuList()
        this.initCurrSelectedMenu()
      })
    }
  },
  methods: {
    buildMenuList() {
      let menuList = []
      this.getMenuList(this.menuTree, menuList)
      this.menuList = menuList
    },
    getMenuList(menuTree, menuList) {
      for (let item of menuTree) {
        menuList.push(item)
        if (item.childList && item.childList.length > 0) {
          this.getMenuList(item.childList, menuList)
        }
      }
    },
    initCurrSelectedMenu() {
      for (let menu of this.menuList) {
        if (!menu.page) {
          continue
        }
        if (this.matchCurrentPage(menu.page)) {
          if (menu.fatherId && this.openMenus.length <= 0) {
            this.openMenus = [menu.fatherId]
            this.menuOpenChange(this.openMenus)
          }
          this.menuSelectedKeyList = [menu.id]
          break
        }
      }
    },
    matchCurrentPage(page) {
      if (!page) {
        return false
      }
      const path = this.$route.path
      if (page.uri == path) {
        return true
      }
      if (page.childList && page.childList.length > 0) {
        for (const item of page.childList) {
          if (this.matchCurrentPage(item)) {
            return true;
          }
        }
      }
      return false
    },
    menuOpenChange(openKeys) {
      cache.menu.openMenus = openKeys
    },
    logout() {
      logout().then(() => {
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>

@topHeight: 60px;
@navBackground: #23262E;
@topTextColor: aliceblue;
@topTextHoverColor: #426EB4;

.top {
  display: flex;
  height: @topHeight;
  background-color: @navBackground;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;

  .logo {
    color: @topTextColor;
    font-size: 2em;
    font-weight: bold;
    font-family: "楷体", "楷体_GB2312";
    line-height: @topHeight;
  }

  .menu {
    color: @topTextColor;
    font-size: 1.5em;
    font-weight: bold;
    font-family: "楷体", "楷体_GB2312";
    line-height: @topHeight;
  }

  .text {
    color: @topTextColor;
    font-size: 1.5em;
    line-height: @topHeight;
    margin-left: 10px;
  }

  .text:hover {
    color: @topTextHoverColor;
  }

}

.body {
  display: flex;
  min-height: calc(~"100vh - @{topHeight}");;
  height: calc(~"100% - @{topHeight}");

  .main {
    padding: 10px 10px 30px;
    background-color: white;
    width: 100%;
  }

}

:deep(.ant-menu) {
  height: 100%;
  background-color: #393D49;
  min-width: 180px;

  .ant-menu-item-selected {
    background-color: rgb(0, 143, 209);
  }

  .ant-menu-title-content {
    color: @topTextColor;
  }
}
</style>

<style lang="less">
@navBackground: #23262E;
@navTextColor: aliceblue;
@navTextColor: aliceblue;
@navTextHoverColor: #426EB4;

.xsMgrSubMenu {
  .ant-dropdown-content {
    padding: 5px;
    margin-top: -4px;
    background-color: @navBackground;
  }

  .item {
    color: @navTextColor;
  }

  .item:hover {
    color: @navTextHoverColor;
  }

  .ant-dropdown-menu {
    background-color: @navBackground;
  }

  .ant-dropdown-menu-item:hover {
    background-color: @navBackground;
  }
}

</style>

