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
          <vxe-button content="权限管理" @click="permissionMgrButtonClick(row)"/>
        </div>
      </template>
      <template #nameEdit="{ row }">
        <vxe-input v-model="row.name"/>
      </template>
      <template #uriEdit="{ row }">
        <vxe-input v-model="row.uri"/>
      </template>
      <template #remarkEdit="{ row }">
        <vxe-input v-model="row.remark"/>
      </template>
      <template #fatherNameEdit="{ row }">
        <vxe-select v-model="row.father" transfer clearable>
          <vxe-option v-for="item in pages"
                      :key="item.id"
                      :value="item"
                      :label="item.name"/>
        </vxe-select>
      </template>
      <template #fatherUriEdit="{ row }">
        <vxe-select v-model="row.father" transfer clearable>
          <vxe-option v-for="item in pages"
                      :key="item.id"
                      :value="item"
                      :label="item.uri"/>
        </vxe-select>
      </template>
    </vxe-grid>
    <PageAdd ref="add" @result="addResult"/>
  </Mgr>
</template>

<script>
import Mgr from '@/components/mgr/Mgr'
import {listPage, deletePageDetails} from "@/api/sys/page";
import PageAdd from "./PageAdd";
import {deleteProxy} from "@/utils/TableUtil";
import {modifyPageById, listAll} from "@/api/sys/page";

export default {
  name: "PageMgr",
  components: {Mgr, PageAdd},
  data() {
    return {
      pages: [],
      tableOption: {
        pagerConfig: {
          pageSize: 10
        },
        columns: [
          {type: 'checkbox', width: 50, align: 'center'},
          {field: 'name', title: '名称', slots: {edit: 'nameEdit'}, editRender: {autofocus: '.vxe-input--inner'}},
          {field: 'uri', title: 'URI', slots: {edit: 'uriEdit'}, editRender: {autofocus: '.vxe-input--inner'}},
          {field: 'father.name', title: '父页面名称', editRender: {}, slots: {edit: 'fatherNameEdit'}},
          {field: 'father.uri', title: '父页面URI', editRender: {}, slots: {edit: 'fatherUriEdit'}},
          {field: 'remark', title: '备注', slots: {edit: 'remarkEdit'}, editRender: {autofocus: '.vxe-input--inner'}},
          {title: '操作', width: 180, slots: {default: 'option'}}
        ],
        formConfig: {
          items: [
            {field: 'likeName', title: '名称：', itemRender: {name: 'input'}},
            {field: 'likeUri', title: 'URI：', itemRender: {name: 'input'}},
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
        editConfig: {
          trigger: 'manual',
          mode: 'row',
          showStatus: true,
        },
        proxyConfig: {
          autoLoad: false,
          form: true,
          ajax: {
            query: ({page, form}) => {
              return new Promise((resolve) => {
                listPage({
                  pageIndex: page.currentPage,
                  pageSize: page.pageSize,
                  ...form
                }).then(res => {
                  for (const page of res.data) {
                    if (!page.fatherId) {
                      continue
                    }
                    for (const father of this.pages) {
                      if (page.fatherId == father.id) {
                        page.father = father
                      }
                    }
                  }
                  resolve(res)
                })
              })
            },
            delete({body}) {
              return deleteProxy(body, deletePageDetails)
            }
          }
        }
      },
      gridEvents: {
        toolbarButtonClick: this.toolbarButtonClick
      }
    }
  },
  created() {
    listAll().then(res => {
      if (res.code != 200) {
        this.$message.error(res.msg)
        return
      }
      this.pages = res.data
      this.$refs.table.commitProxy('reload')
    })
  },
  methods: {
    addResult() {
      this.$refs.table.commitProxy('reload')
    },
    editRowEvent(row) {
      this.$refs.table.setActiveRow(row)
    },
    saveRowEvent(row) {
      let data = {
        ...row
      }
      if (row.father) {
        data.fatherId = row.father.id
      } else {
        data.fatherId = undefined
      }
      modifyPageById(data).then(res => {
        if (res.code == 200) {
          this.$refs.table.clearActived()
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    permissionMgrButtonClick({id}) {
      this.$router.push({
        path: '/system/page/permission/mgr',
        query: {
          pageId: id
        }
      })
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