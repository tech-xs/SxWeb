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
          <vxe-button content="修改密码" @click="resetPasswordBtnClick(row)"/>
        </div>
      </template>
      <template #userNameEdit="{ row }">
        <vxe-input v-model="row.userName"/>
      </template>
      <template #nickNameEdit="{ row }">
        <vxe-input v-model="row.nickName"/>
      </template>
      <template #sexEdit="{ row }">
        <vxe-select v-model="row.sex" transfer>
          <vxe-option v-for="item in sexDict.valueList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.name"/>
        </vxe-select>
      </template>
      <template #phoneEdit="{ row }">
        <vxe-input v-model="row.phone"/>
      </template>
      <template #emailEdit="{ row }">
        <vxe-input v-model="row.email"/>
      </template>
      <template #accountStatusEdit="{ row }">
        <vxe-select v-model="row.accountStatus" transfer>
          <vxe-option v-for="item in accountStatusDict.valueList" :key="item.value" :value="item.value"
                      :label="item.name"/>
        </vxe-select>
      </template>
      <template #roleEdit="{ row }">
        <vxe-select v-model="row.roleIdList" transfer multiple>
          <vxe-option v-for="item in roleList" :key="item.id" :value="item.id"
                      :label="item.name"/>
        </vxe-select>
      </template>
    </vxe-grid>
    <UserAdd ref="add" @result="addResult"/>
    <ResetUserPassword ref="resetPassword" :user="resetPasswordUser"/>
  </Mgr>
</template>

<script>
import Mgr from '@/components/mgr/Mgr'
import cache from "@/core/cache";
import {listPage, modifyUserById, deleteUserDetails} from "@/api/sys/user";
import UserAdd from "./UserAdd";
import {deleteProxy} from "@/utils/TableUtil";
import ResetUserPassword from "./ResetUserPassword";
import {listAll as roleListAll} from "@/api/sys/role";

export default {
  name: "UserMgr",
  components: {ResetUserPassword, UserAdd, Mgr},
  data() {
    return {
      roleList: [],
      resetPasswordUser: undefined,
      sexDict: {
        valueList: []
      },
      accountStatusDict: {
        valueList: []
      },
      gridEvents: {
        toolbarButtonClick: this.toolbarButtonClick
      },
      tableOption: {
        pagerConfig: {
          pageSize: 10
        },
        formConfig: {
          items: [
            {field: 'likeUserName', title: '用户名：', itemRender: {name: 'input'}},
            {field: 'likePhone', title: '手机号：', itemRender: {name: 'input'}},
            {field: 'likeEmail', title: '邮箱：', itemRender: {name: 'input'}},
            {itemRender: {name: '$button', props: {content: '查询', type: 'submit', status: 'primary'}}},
            {itemRender: {name: '$button', props: {content: '重置', type: 'reset'}}}
          ]
        },
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        },
        toolbarConfig: {
          buttons: [
            {code: 'add', name: '新增'},
            {code: 'delete', name: '删除'},
          ],
        },
        columns: [
          {type: 'checkbox', width: 50, align: 'center'},
          {
            field: 'userName',
            title: '用户名',
            editRender: {autofocus: '.vxe-input--inner'},
            slots: {edit: 'userNameEdit'}
          },
          {
            field: 'roleIdList',
            title: '角色',
            formatter: this.formatterRole,
            editRender: {},
            slots: {edit: 'roleEdit'}
          },
          {field: 'sex', title: '性别', formatter: this.formatterSex, editRender: {}, slots: {edit: 'sexEdit'}},
          {field: 'phone', title: '手机号', editRender: {autofocus: '.vxe-input--inner'}, slots: {edit: 'phoneEdit'}},
          {field: 'email', title: '邮箱', editRender: {autofocus: '.vxe-input--inner'}, slots: {edit: 'emailEdit'}},
          {
            field: 'accountStatus',
            title: '状态',
            formatter: this.formatterAccountStatus,
            editRender: {},
            slots: {edit: 'accountStatusEdit'}
          },
          {field: 'nickName', title: '昵称', editRender: {autofocus: '.vxe-input--inner'}, slots: {edit: 'nickNameEdit'}},
          {title: '操作', width: 180, slots: {default: 'option'}}
        ],
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
              return deleteProxy(body, deleteUserDetails)
            }
          }
        }
      }
    }
  },
  created() {
    Promise.all([roleListAll(), cache.dict.getByCode('sex', 'accountStatus')]).then(res => {
      // 处理角色
      const roleRes = res[0]
      if (roleRes.code != 200) {
        this.$message.error('角色信息获取失败')
        return
      }
      this.roleList = roleRes.data
      // 处理字典
      const dictRes = res[1]
      this.sexDict = dictRes.sex
      this.accountStatusDict = dictRes.accountStatus
      this.$refs.table.commitProxy('reload')
    })
  },
  methods: {
    resetPasswordBtnClick(row) {
      this.resetPasswordUser = row
      this.$refs.resetPassword.show()
    },
    addResult() {
      this.$refs.table.commitProxy('reload')
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
    formatterRole({cellValue}) {
      if (cellValue.length <= 0) {
        return ''
      }
      let res = ''
      const sortRoleIds = cellValue.sort()
      sortRoleIds.forEach(roleId => {
        for (const role of this.roleList) {
          if (role.id == roleId) {
            res += ','
            res += role.name
            break
          }
        }
      })
      if (res.length > 0) {
        res = res.slice(1)
      }
      return res
    },
    formatterSex({cellValue}) {
      if (this.sexDict.valueMap) {
        return this.sexDict.valueMap[cellValue].name
      }
      return cellValue
    },
    formatterAccountStatus({cellValue}) {
      if (this.accountStatusDict.valueMap) {
        return this.accountStatusDict.valueMap[cellValue].name
      }
      return cellValue
    },
    editRowEvent(row) {
      this.$refs.table.setActiveRow(row)
    },
    saveRowEvent(row) {
      modifyUserById(row).then(res => {
        if (res.code == 200) {
          this.$refs.table.clearActived()
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  }
}
</script>

<style scoped>

</style>