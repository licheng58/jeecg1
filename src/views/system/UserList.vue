<template>

  <a-card style="margin:16px"
          :bordered="false"
          :body-style="{ margin: '0', padding: '0' }">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="用户姓名">
              <a-input placeholder="请输入用户姓名"
                       v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="primary"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>

            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <StandardTable ref="MyTable"
                   size="middle"
                   rowKey="id"
                   :loadUrl="url.list"
                   :queryParam="queryParam"
                   :columns="columns">
      <template slot="header">
        <PageTitle title="用户管理">
          <a-button @click="handleAdd"
                    type="primary"
                    icon="plus">添加用户</a-button>
          <a-button type="primary"
                    icon="hdd"
                    @click="recycleBinVisible = true">回收站</a-button>
        </PageTitle>

        <a-dropdown v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay"
                  @click="handleMenuClick">
            <a-menu-item key="1">
              <a-icon type="delete"
                      @click="batchDel" />
              删除
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="lock"
                      @click="batchFrozen('2')" />
              冻结
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="unlock"
                      @click="batchFrozen('1')" />
              解冻
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>

      <template slot="avatarslot"
                slot-scope="text, record">
        <div class="anty-img-wrap">
          <a-avatar shape="square"
                    :src="getAvatarView(record.avatar)"
                    icon="user" />
        </div>
      </template>

      <span slot="action"
            slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>

        <a-divider type="vertical" />

        <a-dropdown>
          <a class="ant-dropdown-link"> 更多
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <!-- <a-menu-item>
              <a href="javascript:;"
                 @click="handleDetail(record)">详情</a>
            </a-menu-item> -->

            <a-menu-item>
              <a href="javascript:;"
                 @click="handleChangePassword(record.username)">密码</a>
            </a-menu-item>

            <a-menu-item>
              <a-popconfirm title="确定删除吗?"
                            @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>

            <a-menu-item v-if="record.status == 1">
              <a-popconfirm title="确定冻结吗?"
                            @confirm="() => handleFrozen(record.id, 2, record.username)">
                <a>冻结</a>
              </a-popconfirm>
            </a-menu-item>

            <a-menu-item v-if="record.status == 2">
              <a-popconfirm title="确定解冻吗?"
                            @confirm="() => handleFrozen(record.id, 1, record.username)">
                <a>解冻</a>
              </a-popconfirm>
            </a-menu-item>

            <!-- <a-menu-item>
              <a href="javascript:;" @click="handleAgentSettin gs(record.username)">代理人</a>
            </a-menu-item> -->
          </a-menu>
        </a-dropdown>
      </span>
    </StandardTable>
    <user-modal ref="modalForm"
                @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal"
                    @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <user-recycle-bin-modal :visible.sync="recycleBinVisible"
                            @ok="modalFormOk" />
  </a-card>
</template>

<script>
import UserModal from './modules/UserModal'
import PasswordModal from './modules/PasswordModal'
import { putAction, getFileAccessHttpUrl } from '@/api/manage'
import { frozenBatch } from '@/api/api'
import { tableListMixin } from '@/mixins/tableListMixin'
import SysUserAgentModal from './modules/SysUserAgentModal'
import JInput from '@/components/jeecg/JInput'
import UserRecycleBinModal from './modules/UserRecycleBinModal'

export default {
  name: 'UserList',
  mixins: [tableListMixin],
  components: {
    SysUserAgentModal,
    UserModal,
    PasswordModal,
    JInput,
    UserRecycleBinModal,
  },
  data() {
    return {
      description: '这是用户管理页面',
      queryParam: {},
      recycleBinVisible: false,
      columns: [
        /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'username',
          width: 120,
        },

        {
          title: '用户姓名',
          align: 'center',
          width: 100,
          dataIndex: 'realname',
        },
        {
          title: '用户角色',
          align: 'center',
          dataIndex: 'roleCode',
          width: 120,
          customRender: function (t, r, index) {
            return t === '1'
              ? '平台用户'
              : t === '2'
              ? '头盔终端用户'
              : t === '3'
              ? '平台管理员'
              : t === 'admin'
              ? '管理员'
              : ''
          },
        },
        // {
        //   title: '头像',
        //   align: "center",
        //   width: 120,
        //   dataIndex: 'avatar',
        //   scopedSlots: {customRender: "avatarslot"}
        // },

        {
          title: '性别',
          align: 'center',
          width: 80,
          dataIndex: 'sex_dictText',
        },
        // {
        //   title: '生日',
        //   align: 'center',
        //   width: 100,
        //   dataIndex: 'birthday',
        // },
        {
          title: '手机号码',
          align: 'center',
          width: 100,
          dataIndex: 'phone',
        },
        {
          title: '机构',
          align: 'center',
          width: 180,
          dataIndex: 'orgCodeTxt',
        },
        {
          title: '状态',
          align: 'center',
          width: 80,
          dataIndex: 'status_dictText',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170,
        },
      ],

      url: {
        syncUser: '/process/extActProcess/doSyncUser',
        list: '/sys/user/list',
        delete: '/sys/user/delete',
        deleteBatch: '/sys/user/deleteBatch',
        exportXlsUrl: '/sys/user/exportXls',
        importExcelUrl: 'sys/user/importExcel',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    getAvatarView: function (avatar) {
      return getFileAccessHttpUrl(avatar)
    },

    batchFrozen: function (status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return false
      } else {
        let ids = ''
        let that = this
        let isAdmin = false
        that.selectionRows.forEach(function (row) {
          if (row.username == 'admin') {
            isAdmin = true
          }
        })
        if (isAdmin) {
          that.$message.warning('管理员账号不允许此操作,请重新选择！')
          return
        }
        that.selectedRowKeys.forEach(function (val) {
          ids += val + ','
        })
        that.$confirm({
          title: '确认操作',
          content: '是否' + (status == 1 ? '解冻' : '冻结') + '选中账号?',
          onOk: function () {
            frozenBatch({ ids: ids, status: status }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$refs.MyTable.reload()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          },
        })
      }
    },

    handleMenuClick(e) {
      if (e.key == 1) {
        this.batchDel()
      } else if (e.key == 2) {
        this.batchFrozen(2)
      } else if (e.key == 3) {
        this.batchFrozen(1)
      }
    },

    handleFrozen: function (id, status, username) {
      let that = this
      //TODO 后台校验管理员角色
      if ('admin' == username) {
        that.$message.warning('管理员账号不允许此操作！')
        return
      }
      frozenBatch({ ids: id, status: status }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$refs.MyTable.reload()
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    handleChangePassword(username) {
      this.$refs.passwordmodal.show(username)
    },

    handleAgentSettings(username) {
      this.$refs.sysUserAgentModal.agentSettings(username)
      this.$refs.sysUserAgentModal.title = '用户代理人设置'
    },

    passwordModalOk() {
      //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>