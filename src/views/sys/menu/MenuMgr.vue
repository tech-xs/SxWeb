<template>
  <Mgr>
    <vxe-grid ref="tree" v-bind="tableOption" v-on="gridEvents">
      <template #option="{ row }">
        <div class="table-option">
          <template v-if="$refs.tree.isActiveByRow(row)">
            <vxe-button status="primary" content="保存" @click="saveRowEvent(row)"/>
          </template>
          <template v-else>
            <vxe-button content="修改" @click="editRowEvent(row)"/>
          </template>
          <vxe-button content="添加子菜单"
                      @click="addMenu(row)"/>
          <vxe-button content="删除" :disabled="row.childList && row.childList.length >0"
                      @click="deleteMenuDetails(row)"/>
        </div>
      </template>
      <template #defaultIcon="{ row }">
        <i v-if="row.icon" :class="row.icon"/>
      </template>
      <template #nameEdit="{ row }">
        <vxe-input v-model="row.name"/>
      </template>
      <template #codeEdit="{ row }">
        <vxe-input v-model="row.code"/>
      </template>
      <template #iconEdit="{ row }">
        <vxe-input v-model="row.icon"/>
      </template>
      <template #sortEdit="{ row }">
        <vxe-input type="number" min="0" max="1000000" v-model="row.sort"/>
      </template>
      <template #pageNameEdit="{ row }">
        <vxe-select v-model="row.page" transfer clearable>
          <vxe-option v-for="item in rootPages"
                      :key="item.id"
                      :value="item"
                      :label="item.name"/>
        </vxe-select>
      </template>
      <template #pageUriEdit="{ row }">
        <vxe-select v-model="row.page" transfer clearable>
          <vxe-option v-for="item in rootPages"
                      :key="item.id"
                      :value="item"
                      :label="item.uri"/>
        </vxe-select>
      </template>
    </vxe-grid>
    <MenuAdd ref="add" @result="addResult"/>
  </Mgr>
</template>

<script>
import Mgr from "@/components/mgr/Mgr";
import {listAllRoot as listAllPageRoot} from "@/api/sys/page";
import MenuAdd from "./MenuAdd";
import {Modal} from "ant-design-vue";
import {deleteDetails, modifyMenuById, listAll} from "@/api/sys/menu";

export default {
  name: "MenuMgr",
  components: {MenuAdd, Mgr},
  data() {
    return {
      expandStatus: false,
      rootPages: [],
      tableOption: {
        pagerConfig: {
          enabled: false
        },
        columns: [
          {
            field: 'name',
            title: '名称',
            treeNode: true,
            slots: {edit: 'nameEdit'},
            editRender: {autofocus: '.vxe-input--inner'}
          },
          {
            field: 'code',
            title: '编码',
            slots: {edit: 'codeEdit'},
            editRender: {autofocus: '.vxe-input--inner'}
          },
          {
            title: '图标',
            slots: {default: 'defaultIcon'},
          },
          {
            field: 'icon',
            title: '图标值',
            slots: {edit: 'iconEdit'},
            editRender: {autofocus: '.vxe-input--inner'}
          },
          {field: 'sort', title: '排序值', editRender: {}, slots: {edit: 'sortEdit'}},
          {field: 'page.name', title: '页面名称', editRender: {}, slots: {edit: 'pageNameEdit'}},
          {field: 'page.uri', title: '页面路径', editRender: {}, slots: {edit: 'pageUriEdit'}},
          {title: '操作', width: 270, slots: {default: 'option'}}
        ],
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        },
        toolbarConfig: {
          buttons: [
            {code: 'add', name: '新增'},
            {code: 'expandTree', name: '展开/收缩'},
          ],
        },
        treeConfig: {
          transform: true,
          rowField: 'id',
          children: 'childList',
          parentField: 'fatherId'
        },
        proxyConfig: {
          autoLoad: false,
          form: false,
          ajax: {
            query: () => {
              return new Promise((resolve, reject) => {
                listAll({}).then(res => {
                  if (res.code != 200) {
                    reject(new Error("数据获取失败"))
                    return
                  }
                  const menus = res.data
                  if (!menus || menus.length <= 0) {
                    resolve(res)
                  }
                  for (const menu of menus) {
                    if (!menu.pageId) {
                      continue
                    }
                    for (const page of this.rootPages) {
                      if (menu.pageId == page.id) {
                        menu.page = page
                      }
                    }
                  }
                  resolve(menus)
                  this.expandStatus = !this.expandStatus
                  setTimeout(this.toolbarButtonClick, 200, {code: 'expandTree'})
                })
              })
            },
          }
        },
      },
      gridEvents: {
        toolbarButtonClick: this.toolbarButtonClick
      }
    }
  },
  created() {
    listAllPageRoot().then(res => {
      if (res.code != 200) {
        this.$message.error('页面数据获取失败')
      }
      this.rootPages = res.data
      this.$refs.tree.commitProxy('reload')
    })
  },
  methods: {
    saveRowEvent(row) {
      let data = {
        ...row
      }
      if (row.page) {
        data.pageId = row.page.id
      } else {
        data.pageId = undefined
      }
      modifyMenuById(data).then(res => {
        if (res.code == 200) {
          this.$refs.tree.clearActived()
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    editRowEvent(row) {
      this.$refs.tree.setActiveRow(row)
    },
    addMenu(menu) {
      this.$refs.add.show(menu.id)
    },
    addResult() {
      this.$refs.tree.commitProxy('reload')
    },
    deleteMenuDetails(menu) {
      let that = this
      Modal.confirm({
        title: '删除菜单',
        content: '您确认需要删除菜单?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          deleteDetails({
            id: menu.id
          }).then(res => {
            if (res.code == 200) {
              that.$message.success('删除成功')
              that.$refs.tree.commitProxy('reload')
            } else {
              that.$message.error(res.msg)
            }
          })
        },
      });
    },
    toolbarButtonClick({code}) {
      switch (code) {
        case 'add': {
          this.$refs.add.show()
          return;
        }
        case 'expandTree': {
          this.$refs.tree.setAllTreeExpand(!this.expandStatus)
          this.expandStatus = !this.expandStatus
          return;
        }
        default: {
          return
        }
      }
    },
  }
}
</script>

<style scoped>

</style>