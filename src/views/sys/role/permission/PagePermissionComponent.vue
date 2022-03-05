<template>
  <vxe-grid ref="tree" v-bind="tableOption" v-on="gridEvents">
    <template #expandPageDefault="{row}">
      <span>{{ row.name }}</span>
    </template>
    <template #expandPage="{row}">
      <a-card v-show="row.permissionList.length>0" title="权限" class="permission-list">
        <vxe-checkbox class="permission" v-for="item of row.permissionList"
                      :key="item.id" v-model="item.checked"
                      @change="permissionCheckBoxChange(row)"
                      :content="item.permissionName"
                      :disabled="!isEdit"/>
      </a-card>
      <a-card v-show="row.childList.length >0" title="子页面" class="page-list" bodyStyle="padding: 0px;">
        <PagePermissionComponent :ref="'childPage'+row.id" :key="row.id"
                                 @pageCheckEvent="childPageCheckedEvent"
                                 :checkedPageList="checkedPageList"
                                 :checkedPermissionsList="checkedPermissionsList"
                                 :isEdit="isEdit"
                                 :pageList="row.childList"/>
      </a-card>
    </template>
  </vxe-grid>
</template>

<script>
import {toRaw} from '@vue/reactivity'

export default {
  name: "PagePermissionComponent",
  props: ['pageList', 'isEdit', 'checkedPageList', 'checkedPermissionsList'],
  data() {
    return {
      tableOption: {
        rowId: 'id',
        expandConfig: {
          visibleMethod: this.treeVisibleMethod,
          toggleMethod: this.treeVisibleMethod
        },
        data: this.pageList,
        checkboxConfig: {
          checkRowKeys: this.checkedPageIdList,
          checkMethod: () => {
            return this.isEdit
          }
        },
        treeConfig: {
          transform: true,
          rowField: 'id',
          parentField: 'fatherId'
        },
        columns: [
          {type: 'checkbox', width: 50, align: 'center'},
          {field: 'name', title: '页面名称', type: 'expand', slots: {content: 'expandPage', default: 'expandPageDefault'}},
          {field: 'uri', title: '页面路径'},
        ]
      },
      gridEvents: {
        checkboxChange: this.pageCheckboxChange,
        checkboxAll: this.checkboxAll
      }
    }
  },
  setup(prop) {
    let row = toRaw(prop)
    let checkRowKeys = []
    for (let page of prop.pageList) {
      for (let menuPage of prop.checkedPageList) {
        if (page.id == menuPage.pageId) {
          checkRowKeys.push(page.id)
        }
      }
      if (page.permissionList && page.permissionList.length > 0) {
        for (let permission of page.permissionList) {
          permission.checked = false
        }
        if (row.checkedPermissionsList && row.checkedPermissionsList.length > 0) {
          for (let permission of page.permissionList) {
            for (let checkedPermissions of row.checkedPermissionsList) {
              if (permission.id == checkedPermissions.permissionId) {
                permission.checked = true
              }
            }
          }
        }
      }
    }
    row.checkedPageIdList = checkRowKeys
    return prop
  },
  methods: {
    checkboxAll({checked}) {
      const tableData = this.$refs.tree.getTableData().tableData
      for (const page of tableData) {
        if (page.permissionList && page.permissionList.length > 0) {
          for (let permission of page.permissionList) {
            permission.checked = checked
          }
        }
        const childPageItem = this.$refs['childPage' + page.id]
        if (!childPageItem) {
          continue
        }
        childPageItem.setCheckedAll(checked)
      }
      this.$emit('pageCheckEvent', tableData[0])
    },
    permissionCheckBoxChange(row) {
      this.$refs.tree.setCheckboxRow(row, true)
      this.$emit('pageCheckEvent', row)
    },
    getCheckedPermissionList() {
      let menuPagePermissionList = []
      const tableData = this.$refs.tree.getTableData().tableData
      for (const item of tableData) {
        if (item.permissionList && item.permissionList.length > 0) {
          for (let permission of item.permissionList) {
            if (permission.checked) {
              menuPagePermissionList.push({
                pageId: item.id,
                permissionId: permission.id
              })
            }
          }
        }
        const childPageItem = this.$refs['childPage' + item.id]
        if (!childPageItem) {
          continue
        }
        let checkedData = childPageItem.getCheckedPermissionList()
        for (const item of checkedData) {
          menuPagePermissionList.push(item)
        }
      }
      return menuPagePermissionList
    },
    getCheckedRowList() {
      let res = [];
      let checkedTableData = this.$refs.tree.getCheckboxRecords()
      for (const item of checkedTableData) {
        res.push(item)
      }
      const tableData = this.$refs.tree.getTableData().tableData
      for (const item of tableData) {
        const childPageItem = this.$refs['childPage' + item.id]
        if (!childPageItem) {
          continue
        }
        let checkedData = childPageItem.getCheckedRowList()
        for (const item of checkedData) {
          res.push(item)
        }
      }
      return res
    },
    setCheckedAll(checked) {
      this.$refs.tree.setAllCheckboxRow(checked)
      const tableData = this.$refs.tree.getTableData().tableData
      for (const item of tableData) {
        if (item.permissionList && item.permissionList.length > 0) {
          for (let permission of item.permissionList) {
            permission.checked = checked
          }
        }
        const childPageItem = this.$refs['childPage' + item.id]
        if (!childPageItem) {
          continue
        }
        childPageItem.setCheckedAll(checked)
      }
    },
    childPageCheckedEvent(child) {
      const tableData = this.$refs.tree.getTableData().tableData
      for (let item of tableData) {
        if (item.id == child.fatherId) {
          this.$refs.tree.setCheckboxRow(item, true)
          this.$emit('pageCheckEvent', item)
          return
        }
      }
    },
    pageCheckboxChange({row}) {
      this.$emit('pageCheckEvent', row)
    },
    setAllRowExpand() {
      this.$refs.tree.setAllRowExpand(true).then(() => {
        const tableData = this.$refs.tree.getTableData().tableData
        for (const page of tableData) {
          const childPageItem = this.$refs['childPage' + page.id]
          if (!childPageItem) {
            continue
          }
          childPageItem.setAllRowExpand()
        }
      })
    },
    treeVisibleMethod({row}) {
      if (row.permissionList && row.permissionList.length > 0) {
        return true
      }
      if (row.childList && row.childList.length > 0) {
        return true
      }
      return false
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