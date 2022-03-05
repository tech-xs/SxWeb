<template>
  <Mgr>
    <a-page-header
        :title="role.name"
        @back="$router.push('/system/role/mgr')"/>
    <vxe-grid ref="menuTree" v-bind="tableOption" v-on="gridEvents">
      <template #expandPageDefault="{row}">
        <span>{{ formatterMenuTreePageName({row}) }}</span>
      </template>
      <template #expandPage="{row}">
        <a-card v-show="row.page.permissionList.length>0" title="权限" class="permission-list">
          <vxe-checkbox class="permission" v-for="item of row.page.permissionList" :key="item.id" v-model="item.checked"
                        :content="item.permissionName"
                        @change="permissionCheckBoxChange(row)"
                        :disabled="!isEdit"/>
        </a-card>
        <a-card v-show="row.page.childList.length >0" title="子页面" class="page-list" bodyStyle="padding: 0px;">
          <PagePermissionComponent :ref="'childPage'+row.id" :key="row.id"
                                   @pageCheckEvent="childPageCheckedEvent"
                                   :checkedPageList="checkedPageList"
                                   :checkedPermissionsList="checkedPermissionsList"
                                   :isEdit="isEdit"
                                   :pageList="row.page.childList"/>
        </a-card>
      </template>
    </vxe-grid>
  </Mgr>
</template>

<script>
import Mgr from "@/components/mgr/Mgr";
import PagePermissionComponent from "./PagePermissionComponent"
import {listAll as listMenuAll} from "@/api/sys/menu";
import {listAll as listAllPage} from "@/api/sys/page";
import {listAll as listAllPagePermission} from "@/api/sys/pagePermission";
import {getById as getRoleById, modifyRoleAuthById} from "@/api/sys/role";
import {roleMenuListAll} from "@/api/sys/roleMenu";
import {roleMenuPageListAll} from "@/api/sys/roleMenuPage";
import {roleMenuPagePermissionListAll} from "@/api/sys/roleMenuPagePermission";

export default {
  name: "RolePermissionMgr",
  components: {Mgr, PagePermissionComponent},
  data() {
    return {
      role: {
        id: undefined,
        name: ''
      },
      checkedPageList: [],
      expandStatus: false,
      pages: [],
      pagePermissions: [],
      checkedPermissionsList: [],
      isEdit: false,
      tableOption: {
        rowId: 'id',
        checkboxConfig: {
          checkRowKeys: [],
          checkMethod: () => {
            return this.isEdit
          }
        },
        expandConfig: {
          showIcon: true,
          visibleMethod: this.menuTreeVisibleMethod,
          toggleMethod: this.menuTreeVisibleMethod
        },
        pagerConfig: {
          enabled: false
        },
        toolbarConfig: {
          buttons: [
            {code: 'expandTree', name: '展开/收缩'},
            {code: 'edit', name: '编辑'},
            {code: 'save', name: '保存', visible: false},
            {code: 'cancelSave', name: '取消', visible: false},
          ],
        },
        treeConfig: {
          transform: true,
          rowField: 'id',
          children: 'childList',
          parentField: 'fatherId'
        },
        columns: [
          {type: 'checkbox', width: 50, align: 'center'},
          {
            field: 'name',
            title: '菜单名称',
            treeNode: true
          },
          {
            title: '页面名称',
            type: 'expand',
            slots: {content: 'expandPage', default: 'expandPageDefault'}
          },
          {title: '页面路径', formatter: this.formatterMenuTreePageUri,},
        ],
        proxyConfig: {
          form: false,
          autoLoad: false,
          ajax: {
            query: () => {
              return new Promise((resolve, reject) => {
                Promise.all([listMenuAll({}),
                  roleMenuListAll({roleId: this.role.id}),
                  roleMenuPageListAll({roleId: this.role.id}),
                  roleMenuPagePermissionListAll({roleId: this.role.id})]).then(res => {
                  // 展示的菜单列表
                  const menusRes = res[0]
                  if (menusRes.code != 200) {
                    reject(new Error("菜单数据获取失败"))
                    return;
                  }
                  const menus = menusRes.data
                  for (const menu of menus) {
                    for (const page of this.pages) {
                      if (page.id == menu.pageId) {
                        menu.page = page
                        break
                      }
                    }
                  }
                  // 选中的菜单
                  const checkedMenuRes = res[1]
                  if (checkedMenuRes.code != 200) {
                    reject(new Error("角色菜单数据获取失败"))
                    return;
                  }
                  const checkedRowIds = []
                  for (const menu of menus) {
                    for (const roleMenu of checkedMenuRes.data) {
                      if (menu.id == roleMenu.menuId) {
                        let isExistChild = false
                        for (const child of menus) {
                          if (child.fatherId == menu.id) {
                            isExistChild = true
                            break
                          }
                        }
                        if (!isExistChild) {
                          checkedRowIds.push(menu.id)
                        }
                        break
                      }
                    }
                  }
                  this.tableOption.checkboxConfig.checkRowKeys = checkedRowIds
                  // 选中的子页面
                  const checkedMenuPageRes = res[2]
                  if (checkedMenuPageRes.code != 200) {
                    reject(new Error("角色子页面数据获取失败"))
                    return;
                  }
                  this.checkedPageList = checkedMenuPageRes.data
                  const checkedMenuPagePermissionRes = res[3]
                  if (checkedMenuPagePermissionRes.code != 200) {
                    reject(new Error("角色权限数据获取失败"))
                    return;
                  }
                  this.checkedPermissionsList = checkedMenuPagePermissionRes.data
                  for (let menu of menus) {
                    if (menu.page && menu.page.permissionList && menu.page.permissionList.length > 0) {
                      for (let permission of menu.page.permissionList) {
                        permission.checked = false
                      }
                      for (let permission of menu.page.permissionList) {
                        for (let checkedPermissions of this.checkedPermissionsList) {
                          if (permission.id == checkedPermissions.permissionId) {
                            permission.checked = true
                          }
                        }
                      }
                    }
                  }
                  resolve(menus)
                  this.expandStatus = !this.expandStatus
                  setTimeout(() => {
                    this.menuTreeToolbarButtonClick({code: 'expandTree'})
                  }, 300)
                })
              })
            }
          }
        }
      },
      gridEvents: {
        toolbarButtonClick: this.menuTreeToolbarButtonClick,
        checkboxAll: this.checkboxAll
      }
    }
  },
  created() {
    this.role.id = this.$route.query.roleId
    if (!this.role.id) {
      this.$router.push('/system/role/mgr',)
    }
    Promise.all([getRoleById(this.role.id), listAllPage(), listAllPagePermission()]).then(res => {
      const roleRes = res[0]
      if (roleRes.code != 200) {
        this.$message.error('角色数据获取失败')
      }
      this.role = roleRes.data
      const pageRes = res[1]
      if (pageRes.code != 200) {
        this.$message.error('页面数据获取失败')
      }
      this.pages = pageRes.data
      const pagePermissionsRes = res[2]
      if (pagePermissionsRes.code != 200) {
        this.$message.error('页面权限数据获取失败')
      }
      this.pagePermissions = pagePermissionsRes.data
      this.buildPagePermissions();
      this.buildPageChildList()
      this.$refs.menuTree.commitProxy('reload')
    })
  },
  methods: {
    permissionCheckBoxChange(row) {
      this.$refs.menuTree.setCheckboxRow(row, true)
    },
    checkboxAll({checked}) {
      const tableData = this.$refs.menuTree.getTableData().tableData
      for (const menu of tableData) {
        if (menu.page && menu.page.permissionList && menu.page.permissionList.length > 0) {
          for (let permission of menu.page.permissionList) {
            permission.checked = checked
          }
        }
        const childPageItem = this.$refs['childPage' + menu.id]
        if (!childPageItem) {
          continue
        }
        childPageItem.setCheckedAll(checked)
      }
    },
    childPageCheckedEvent(child) {
      const tableData = this.$refs.menuTree.getTableData().tableData
      for (let item of tableData) {
        if (item.pageId == child.fatherId) {
          this.$refs.menuTree.setCheckboxRow(item, true)
          return
        }
      }
    },
    buildPageChildList() {
      for (const page of this.pages) {
        page.childList = []
      }
      for (const father of this.pages) {
        for (const page of this.pages) {
          if (father.id == page.fatherId) {
            father.childList.push(page)
          }
        }
      }
    },
    buildPagePermissions() {
      for (const page of this.pages) {
        page.permissionList = []
      }
      for (const permission of this.pagePermissions) {
        for (const page of this.pages) {
          if (permission.pageId == page.id) {
            page.permissionList.push(permission)
            break
          }
        }
      }
    },
    menuTreeVisibleMethod({row}) {
      if (row.childList && row.childList.length > 0) {
        return false
      }
      if (row.page) {
        const page = row.page
        if (page.permissionList && page.permissionList.length > 0) {
          return true
        }
        if (page.childList && page.childList.length > 0) {
          return true
        }
      }
      return false
    },
    menuTreeToolbarButtonClick({code}) {
      switch (code) {
        case 'expandTree': {
          this.setTreeExpand();
          return;
        }
        case 'cancelSave': {
          this.tableOption.toolbarConfig.buttons[0].visible = true
          this.tableOption.toolbarConfig.buttons[1].visible = true
          this.tableOption.toolbarConfig.buttons[2].visible = false
          this.tableOption.toolbarConfig.buttons[3].visible = false
          this.tableOption.expandConfig.showIcon = true
          this.isEdit = false
          return;
        }
        case 'edit': {
          this.tableOption.toolbarConfig.buttons[0].visible = false
          this.tableOption.toolbarConfig.buttons[1].visible = false
          this.tableOption.toolbarConfig.buttons[2].visible = true
          this.tableOption.toolbarConfig.buttons[3].visible = true
          this.expandStatus = false
          this.tableOption.expandConfig.showIcon = false
          this.isEdit = true
          this.setTreeExpand()
          return;
        }
        case 'save': {
          this.saveRoleAuth();
          return;
        }
        default: {
          return
        }
      }
    },
    setTreeExpand() {
      this.$refs.menuTree.setAllTreeExpand(!this.expandStatus).then(() => {
        this.expandStatus = !this.expandStatus
        if (!this.expandStatus) {
          return
        }
        const tableData = this.$refs.menuTree.getTableData().tableData
        const setRowExpandPromiseList = []
        for (const row of tableData) {
          setRowExpandPromiseList.push(this.$refs.menuTree.setRowExpand(row, true))
        }
        Promise.all(setRowExpandPromiseList).then(() => {
          for (const menu of tableData) {
            const childPageItem = this.$refs['childPage' + menu.id]
            if (!childPageItem) {
              continue
            }
            childPageItem.setAllRowExpand()
          }
        })
      })
    },
    saveRoleAuth() {
      // 获取选中菜单数据
      let menuIdList = [];
      let menuPagePermissionList = []
      let checkMenuList = this.$refs.menuTree.getCheckboxRecords();
      for (const menu of checkMenuList) {
        menuIdList.push(menu.id)
        if (menu.page && menu.page.permissionList && menu.page.permissionList.length > 0) {
          for (let permission of menu.page.permissionList) {
            if (permission.checked) {
              menuPagePermissionList.push({
                menuId: menu.id,
                pageId: menu.page.id,
                permissionId: permission.id
              })
            }
          }
        }
      }
      checkMenuList = this.$refs.menuTree.getCheckboxIndeterminateRecords()
      for (const menu of checkMenuList) {
        menuIdList.push(menu.id)
      }
      // 获取选中子页面数据
      let menuPageList = []
      const tableData = this.$refs.menuTree.getTableData().tableData
      for (const menu of tableData) {
        const childPageItem = this.$refs['childPage' + menu.id]
        if (!childPageItem) {
          continue
        }
        let checkedData = childPageItem.getCheckedRowList()
        for (const item of checkedData) {
          menuPageList.push({
            menuId: menu.id,
            pageId: item.id
          })
        }
        let checkedPermissionData = childPageItem.getCheckedPermissionList()
        for (const item of checkedPermissionData) {
          menuPagePermissionList.push({
            menuId: menu.id,
            pageId: item.pageId,
            permissionId: item.permissionId
          })
        }
      }

      modifyRoleAuthById({
        roleId: this.role.id,
        menuIdList: menuIdList,
        menuPageList: menuPageList,
        menuPagePermissionIdList: menuPagePermissionList,
      }).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
        this.tableOption.toolbarConfig.buttons[0].visible = true
        this.tableOption.toolbarConfig.buttons[1].visible = true
        this.tableOption.toolbarConfig.buttons[2].visible = false
        this.tableOption.toolbarConfig.buttons[3].visible = false
        this.tableOption.expandConfig.showIcon = true
        this.isEdit = false
        return;
      })
    },
    formatterMenuTreePageName({row}) {
      if (!row.pageId) {
        return
      }
      for (const page of this.pages)
        if (page.id == row.pageId) {
          return page.name
        }
    },
    formatterMenuTreePageUri({row}) {
      if (!row.pageId) {
        return
      }
      for (const page of this.pages)
        if (page.id == row.pageId) {
          return page.uri
        }
    }
  }
}
</script>

<style lang="less" scoped>
.permission-list {
  margin: 15px 50px;

  .permission {
    font-size: 1.2em;
  }
}

.page-list {
  margin: 15px 50px;
}
</style>