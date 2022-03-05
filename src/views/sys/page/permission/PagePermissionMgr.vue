<template>
  <Mgr>
    <a-page-header
        :title="page.name"
        @back="$router.push('/system/page/mgr')"/>
    <h2 class="table-title">权限管理</h2>
    <vxe-grid ref="permissionTable" v-bind="permissionTableOption" v-on="permissionGridEvents">
      <template #option="{ row }">
        <div class="table-option">
          <template v-if="$refs.permissionTable.isActiveByRow(row)">
            <vxe-button status="primary" content="保存" @click="savePermissionRowEvent(row)"/>
          </template>
          <template v-else>
            <vxe-button content="修改" @click="editPermissionRowEvent(row)"/>
          </template>
        </div>
      </template>
      <template #nameEdit="{ row }">
        <vxe-input v-model="row.permissionName"/>
      </template>
      <template #codeEdit="{ row }">
        <vxe-input v-model="row.permissionCode"/>
      </template>
      <template #remarkEdit="{ row }">
        <vxe-input v-model="row.remark"/>
      </template>
    </vxe-grid>
    <h2 class="table-title">接口管理</h2>
    <vxe-grid ref="apiTable" v-bind="apiTableOption" v-on="apiGridEvents">
      <template #option="{ row }">
        <template v-if="$refs.apiTable.isActiveByRow(row)">
          <vxe-button status="primary" content="保存" @click="saveApiRowEvent(row)"/>
        </template>
        <template v-else>
          <vxe-button content="修改" @click="editApiRowEvent(row)"/>
        </template>
      </template>
      <template #permissionNameEdit="{ row }">
        <vxe-select v-model="row.permissionId" transfer>
          <vxe-option v-for="item in permissionList" :key="item.id" :value="item.id"
                      :label="item.permissionName"/>
        </vxe-select>
      </template>
      <template #permissionCodeEdit="{ row }">
        <vxe-select v-model="row.permissionId" transfer>
          <vxe-option v-for="item in permissionList" :key="item.id" :value="item.id"
                      :label="item.permissionCode"/>
        </vxe-select>
      </template>
    </vxe-grid>
    <PagePermissionAdd ref="permissionAdd" :page="page" @result="addPermissionResult"/>
    <PageApiAdd ref="apiAdd" :page="page" @result="addApiResult"/>
  </Mgr>
</template>

<script>
import Mgr from '@/components/mgr/Mgr'
import {
  listPage as listPagePermission,
  deletePagePermissionDetails,
  modifyPagePermissionById
} from "@/api/sys/pagePermission";
import {listPage as listPageApi, deletePageApiDetails, modifyPageApiById} from "@/api/sys/pageApi";
import {listAll as listAllApi} from "@/api/sys/api";
import {getById} from "@/api/sys/page";
import PagePermissionAdd from "./PagePermissionAdd";
import {deleteProxy} from "@/utils/TableUtil";
import cache from "@/core/cache";
import PageApiAdd from "./PageApiAdd";
import {listAll as listAllPermission} from "@/api/sys/pagePermission";

export default {
  name: "PagePermissionMgr",
  components: {PageApiAdd, PagePermissionAdd, Mgr},
  data() {
    return {
      page: {
        name: '',
      },
      apiList: [],
      httpMethodDict: {},
      permissionList: [],
      apiTableOption: {
        toolbarConfig: {
          buttons: [
            {code: 'add', name: '新增'},
            {code: 'delete', name: '删除'},
          ],
        },
        pagerConfig: {
          pageSize: 10
        },
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        },
        columns: [
          {type: 'checkbox', width: 50, align: 'center'},
          {title: '请求方式', formatter: this.formatterApiMethod,},
          {title: '请求路径', formatter: this.formatterApiUri},
          {title: '权限名称', formatter: this.formatterPermissionName, editRender: {}, slots: {edit: 'permissionNameEdit'}},
          {title: '权限编码', formatter: this.formatterPermissionCode, editRender: {}, slots: {edit: 'permissionCodeEdit'}},
          {field: 'remark', title: '备注'},
          {title: '操作', width: 80, slots: {default: 'option'}}
        ],
        formConfig: {
          items: [
            {field: 'likePermissionName', title: '接口：', itemRender: {name: 'input'}},
            {field: 'likePermissionCode', title: '权限：', itemRender: {name: 'input'}},
            {itemRender: {name: '$button', props: {content: '查询', type: 'submit', status: 'primary'}}},
            {itemRender: {name: '$button', props: {content: '重置', type: 'reset'}}}
          ]
        },
        proxyConfig: {
          form: true,
          autoLoad: false,
          ajax: {
            query: ({page, form}) => {
              return listPageApi({
                pageIndex: page.currentPage,
                pageSize: page.pageSize,
                pageId: this.page.id,
                ...form
              })
            },
            delete({body}) {
              return deleteProxy(body, deletePageApiDetails)
            }
          }
        }
      },
      apiGridEvents: {
        toolbarButtonClick: this.apiToolbarButtonClick
      },
      permissionTableOption: {
        pagerConfig: {
          pageSize: 10
        },
        columns: [
          {type: 'checkbox', width: 50},
          {
            field: 'permissionName',
            title: '名称',
            slots: {edit: 'nameEdit'},
            editRender: {autofocus: '.vxe-input--inner'}
          },
          {
            field: 'permissionCode',
            title: '编码',
            slots: {edit: 'codeEdit'},
            editRender: {autofocus: '.vxe-input--inner'}
          },
          {
            field: 'remark',
            title: '备注',
            slots: {edit: 'remarkEdit'},
            editRender: {autofocus: '.vxe-input--inner'}
          },
          {title: '操作', width: 80, slots: {default: 'option'}}
        ],
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        },
        formConfig: {
          items: [
            {field: 'likePermissionName', title: '名称：', itemRender: {name: 'input'}},
            {field: 'likePermissionCode', title: '编码：', itemRender: {name: 'input'}},
            {itemRender: {name: '$button', props: {content: '查询', type: 'submit', status: 'primary'}}},
            {itemRender: {name: '$button', props: {content: '重置', type: 'reset'}}}
          ]
        },
        toolbarConfig: {
          buttons: [
            {code: 'add', name: '新增'},
            {code: 'delete', name: '删除'},
          ],
        },
        proxyConfig: {
          form: true,
          autoLoad: false,
          ajax: {
            query: ({page, form}) => {
              return listPagePermission({
                pageIndex: page.currentPage,
                pageSize: page.pageSize,
                pageId: this.page.id,
                ...form
              })
            },
            delete({body}) {
              return deleteProxy(body, deletePagePermissionDetails)
            }
          }
        }
      },
      permissionGridEvents: {
        toolbarButtonClick: this.permissionToolbarButtonClick
      }
    }
  },
  created() {
    this.page.id = this.$route.query.pageId
    if (!this.page.id) {
      this.$router.push('/system/page/mgr',)
    }
    Promise.all([getById(this.page.id), listAllApi(), cache.dict.getByCode('httpMethod'), listAllPermission({pageId: this.page.id})]).then(res => {
      const pageRes = res[0]
      if (pageRes.code == 200 && pageRes.data) {
        this.page = pageRes.data
      } else {
        this.$router.push('/system/page/mgr')
        return
      }
      this.apiList = res[1].data
      const dictRes = res[2]
      this.httpMethodDict = dictRes.httpMethod
      this.permissionList = res[3].data
      this.$refs.permissionTable.commitProxy('reload')
      this.$refs.apiTable.commitProxy('reload')
    })
  },
  methods: {
    formatterPermissionCode({row}) {
      if (!row.permissionId) {
        return
      }
      for (const permission of this.permissionList) {
        if (permission.id == row.permissionId) {
          return permission.permissionCode
        }
      }
    },
    formatterPermissionName({row}) {
      if (!row.permissionId) {
        return
      }
      for (const permission of this.permissionList) {
        if (permission.id == row.permissionId) {
          return permission.permissionName
        }
      }
    },
    formatterApiUri({row}) {
      for (const api of this.apiList) {
        if (api.id == row.apiId) {
          return api.uri
        }
      }
    },
    formatterApiMethod({row}) {
      for (const api of this.apiList) {
        if (api.id == row.apiId) {
          return this.httpMethodDict.valueMap[api.method].name
        }
      }
    },
    addApiResult() {
      this.$refs.apiTable.commitProxy('reload')
    },
    updatePermissionList() {
      listAllPermission({pageId: this.page.id}).then(res => {
        this.permissionList = res.data
        this.$refs.apiTable.commitProxy('reload')
      })
    },
    addPermissionResult() {
      this.$refs.permissionTable.commitProxy('reload')
      this.updatePermissionList()
    },
    editApiRowEvent(row) {
      this.$refs.apiTable.setActiveRow(row)
    },
    editPermissionRowEvent(row) {
      this.$refs.permissionTable.setActiveRow(row)
    },
    saveApiRowEvent(row) {
      let data = {
        ...row
      }
      modifyPageApiById(data).then(res => {
        if (res.code == 200) {
          this.$refs.apiTable.commitProxy('reload')
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    savePermissionRowEvent(row) {
      let data = {
        ...row
      }
      modifyPagePermissionById(data).then(res => {
        if (res.code == 200) {
          this.$refs.permissionTable.clearActived()
          this.$message.success('保存成功')
          this.updatePermissionList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    apiToolbarButtonClick({code}) {
      switch (code) {
        case 'add': {
          this.$refs.apiAdd.show()
          return;
        }
        default: {
          return
        }
      }
    },
    permissionToolbarButtonClick({code}) {
      switch (code) {
        case 'add': {
          this.$refs.permissionAdd.show()
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

<style scoped lang="less">
.table-title {
  font-weight: bold;
}
</style>