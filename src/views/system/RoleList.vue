<template>
  <a-card style="margin:16px" :bordered="false" :body-style="{ margin: '0', padding: '0' }">
    <StandardTable
      ref="MyTable"
      size="middle"
      rowKey="id"
      :loadUrl="url.list"
      :queryParam="queryParam"
      :columns="columns"
    >
      <template slot="header">
        <PageTitle title="角色管理">
          <!-- <a-button @click="handleAdd" type="primary" icon="plus">新 增</a-button> -->
        </PageTitle>
      </template>
      <template slot="sHeader">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item label="名称">
                  <a-input placeholder="请输入名称查询" v-model="queryParam.roleName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="14">
                <a-form-item label="创建时间">
                  <j-date
                    v-model="queryParam.createTime_begin"
                    :showTime="true"
                    date-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 45%"
                    placeholder="请选择开始时间"
                  ></j-date>
                  <span style="width: 10px">~</span>
                  <j-date
                    v-model="queryParam.createTime_end"
                    :showTime="true"
                    date-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 45%"
                    placeholder="请选择结束时间"
                  ></j-date>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-button type="primary" @click="searchQuery">查询</a-button>
                <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>

        <a-divider type="vertical" />

        <a @click="handlePerssion(record.id)">授权</a>
        <!-- <a-dropdown>
          <a class="ant-dropdown-link">
            更多
            <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="handlePerssion(record.id)">授权</a>
            </a-menu-item>
            <a-menu-item>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown> -->
      </span>
    </StandardTable>
    <role-modal ref="modalForm" @ok="modalFormOk"></role-modal>
    <user-role-modal ref="modalUserRole"></user-role-modal>
  </a-card>
</template>

<script>
import RoleModal from './modules/RoleModal'
import UserRoleModal from './modules/UserRoleModal'
import { tableListMixin } from '@/mixins/tableListMixin'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'RoleList',
  mixins: [tableListMixin],
  components: {
    RoleModal,
    UserRoleModal,
    JDate,
  },
  data() {
    return {
      description: '角色管理页面',
      // 查询条件
      queryParam: { roleName: '' },
      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '角色名称',
          align: 'center',
          dataIndex: 'roleName',
        },
        {
          title: '角色编码',
          align: 'center',
          dataIndex: 'roleCode',
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'description',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/sys/role/list',
        delete: '/sys/role/delete',
        deleteBatch: '/sys/role/deleteBatch',
        exportXlsUrl: '/sys/role/exportXls',
        importExcelUrl: 'sys/role/importExcel',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    handlePerssion: function (roleId) {
      // alert(roleId);
      this.$refs.modalUserRole.show(roleId)
    },
    onChangeDate(date, dateString) {
      console.log(date, dateString)
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>