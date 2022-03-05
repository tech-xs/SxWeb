<template>
  <template v-for="menu of menuTree" :key="menu.id">
    <a-sub-menu v-if="menu.childList && menu.childList.length>0" :key="menu.id">
      <template #icon v-if="menu.icon">
        <span>
          <i :class="menu.icon" class="menu-icon"/>
        </span>
      </template>
      <template #title>{{ menu.name }}</template>
      <menu-tree-component :menu-tree="menu.childList"/>
    </a-sub-menu>
    <a-menu-item v-else @click="$router.push(menu.page.uri)" :key="menu.id">
      <template #icon v-if="menu.icon">
        <span>
          <i :class="menu.icon" class="menu-icon"/>
        </span>
      </template>
      {{ menu.name }}
    </a-menu-item>
  </template>

</template>

<script>
export default {
  name: "MenuTreeComponent",
  props: ['menuTree']
}
</script>

<style lang="less" scoped>
@topTextColor: aliceblue;

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

.menu-icon {
  color: white;
}

</style>