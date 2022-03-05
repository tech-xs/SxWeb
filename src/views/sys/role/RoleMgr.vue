<template>
  <Mgr>
    <vxe-grid ref="table" v-bind="tableOption" v-on="gridEvents">
      <template #option="{ row }">
        <div class="table-option">
          <template v-if="$refs.table.isActiveByRow(row)">
            <vxe-button status="primary" content="保存" @click="saveRowEvent(row)"/>
          </template>
          <template v-else>
            <vxe-button content="修改" @click="editRowEvent(row)"/>
          </template>
          <vxe-button content="权限管理" @click="permissionMgrButtonClick(row)" :disabled="permissionEditDisabled({row})"/>
        </div>
      </template>
      <template #nameEdit="{ row }">
        <vxe-input v-model="row.name"/>
      </template>
      <template #codeEdit="{ row }">
        <vxe-input v-model="row.code"/>
      </template>
      <template #remarkEdit="{ row }">
        <vxe-input v-model="row.remark"/>
      </template>
      <template #roleStatusEdit="{ row }">
        <vxe-select v-model="row.status" transfer>
          <vxe-option v-for="item in roleStatusDict.valueList" :key="item.value" :value="item.value"
                      :label="item.name"/>
        </vxe-select>
      </template>
    </vxe-grid>
    <RoleAdd ref="add" @result="addResult"/>
  </Mgr>
</template>

<script>
import Mgr from "@/components/mgr/Mgr";
import {listPage, deleteRoleDetails, modifyRoleById} from "@/api/sys/role";
import cache from "@/core/cache";
import RoleAdd from "./RoleAdd";
import {deleteProxy} from "@/utils/TableUtil";

export default {
  name: "RoleMgr",
  components: {RoleAdd, Mgr},
  data() {
    return {
      roleStatusDict: {
        valueList: []
      },
      tableOption: {
        toolbarConfig: {
          buttons: [
            {code: 'add', name: '新增'},
            {code: 'delete', name: '删除'},
          ],
        },
        pagerConfig: {
          pageSize: 10
        },
        columns: [
          {type: 'checkbox', width: 50, align: 'center'},
          {field: 'name', title: '名称', slots: {edit: 'nameEdit'}, editRender: {autofocus: '.vxe-input--inner'}},
          {field: 'code', title: '编码', slots: {edit: 'codeEdit'}, editRender: {autofocus: '.vxe-input--inner'}},
          {
            field: 'status',
            title: '状态',
            formatter: this.formatterRoleStatus,
            editRender: {},
            slots: {edit: 'roleStatusEdit'}
          },
          {field: 'remark', title: '备注', slots: {edit: 'remarkEdit'}, editRender: {autofocus: '.vxe-input--inner'}},
          {title: '操作', width: 180, slots: {default: 'option'}}
        ],
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        },
        formConfig: {
          items: [
            {field: 'likeName', title: '名称：', itemRender: {name: 'input'}},
            {field: 'likeCode', title: '编码：', itemRender: {name: 'input'}},
            {itemRender: {name: '$button', props: {content: '查询', type: 'submit', status: 'primary'}}},
            {itemRender: {name: '$button', props: {content: '重置', type: 'reset'}}}
          ]
        },
        proxyConfig: {
          autoLoad: false,
          form: true,
          ajax: {
            query: ({page, form}) => {
              return listPage({
                pageIndex: page.currentPage,
                pageSize: page.pageSize,
                ...form
              })
            },
            delete({body}) {
              return deleteProxy(body, deleteRoleDetails)
            }
          }
        }
      },
      gridEvents: {
        toolbarButtonClick: this.toolbarButtonClick,
      }
    }
  },
  created() {
    cache.dict.getByCode('roleStatus').then(res => {
      this.roleStatusDict = res.roleStatus
      this.$refs.table.commitProxy('reload')
    })
  },
  methods: {
    permissionEditDisabled({row}) {
      if (row.code == "superAdmin") {
        return true
      }
      return false
    },
    permissionMgrButtonClick({id}) {
      this.$router.push({
        path: '/system/role/permission/mgr',
        query: {
          roleId: id
        }
      })
    },
    saveRowEvent(row) {
      modifyRoleById(row).then(res => {
        if (res.code == 200) {
          this.$refs.table.clearActived()
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    editRowEvent(row) {
      this.$refs.table.setActiveRow(row)
    },
    addResult() {
      this.$refs.table.commitProxy('reload')
    },
    formatterRoleStatus({cellValue}) {
      if (this.roleStatusDict.valueMap) {
        return this.roleStatusDict.valueMap[cellValue].name
      }
      return cellValue
    },
    toolbarButtonClick({code}) {
      switch (code) {
        case 'add': {
          this.$refs.add.show()
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