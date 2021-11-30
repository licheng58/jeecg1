<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="资金监测" fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="客户名称">
                <a-input placeholder="请输入客户名称" v-model="queryParam.customerName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="统一社会信用代码">
                <a-input placeholder="请输入统一社会信用代码" v-model="queryParam.unifiedSocialCreditCode"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item>
                <a-button type="primary" @click="searchQuery">查询</a-button>
                <a-button @click="searchReset" style="margin-left: 8px">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <!-- table区域-begin -->
    <a-card style="margin: 16px" :bordered="false" :body-style="{ margin: '0', padding: '0' }">
      <StandardTable
        ref="MyTable"
        size="middle"
        rowKey="id"
        :loadUrl="url.list"
        :queryParam="queryParam"
        :columns="columns"
        :scroll="{ x: 1800 }"
      >
        <!-- 表头 -->
        <template slot="header">
          <PageTitle title="资金监测列表">
            <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('资金监测')">导出</a-button>
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :headers="tokenHeader"
              :action="importExcelUrl"
              @change="handleImportExcel"
            >
              <a-button type="primary" icon="import">导入</a-button>
            </a-upload>
          </PageTitle>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </StandardTable>
      <moneyMonitor-modal ref="modalForm" @ok="modalFormOk"></moneyMonitor-modal>
    </a-card>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import MoneyMonitorModal from './modules/MoneyMonitorModal'
import { tableListMixin } from '@/mixins/tableListMixin'

export default {
  name: 'MoneyMonitorList',
  mixins: [tableListMixin],
  components: {
    MoneyMonitorModal,
  },
  data() {
    return {
      description: '资金监测管理页面',
      // 表头
      columns: [
        {
          title: '客户名称',
          align: 'center',
          width: 150,
          dataIndex: 'customerName',
        },
        {
          title: '统一社会信用代码',
          align: 'center',
          width: 150,
          dataIndex: 'unifiedSocialCreditCode',
        },
        {
          title: '还款期间',
          align: 'center',
          width: 150,
          dataIndex: 'paymentNumber',
        },
        {
          title: '最近还款截止日',
          align: 'center',
          width: 150,
          dataIndex: 'lastRepayment',
        },
        {
          title: '应还本金',
          align: 'center',
          width: 150,
          dataIndex: 'currentBalance',
        },
        {
          title: '应还利息',
          align: 'center',
          width: 150,
          dataIndex: 'currentInterest',
        },
        {
          title: '应还本息合计',
          align: 'center',
          width: 150,
          dataIndex: 'currentInterestBalanceSum',
        },
        {
          title: '账户余额-当前',
          align: 'center',
          width: 150,
          dataIndex: 'accountBalance',
        },
        {
          title: '线上订单额',
          align: 'center',
          width: 150,
          dataIndex: 'onlineOrders',
        },
        {
          title: '品牌监管额',
          align: 'center',
          width: 150,
          dataIndex: 'brandSupervisionAmount',
        },
        {
          title: '营收',
          align: 'center',
          width: 150,
          dataIndex: 'revenue',
        },
        {
          title: '覆盖率',
          align: 'center',
          width: 150,
          dataIndex: 'coverageRate',
        },
        {
          title: '差额',
          align: 'center',
          width: 150,
          dataIndex: 'balance',
        },
      ],
      url: {
        list: '/loan/moneyMonitor/list',
        delete: '/loan/moneyMonitor/delete',
        deleteBatch: '/loan/moneyMonitor/deleteBatch',
        exportXlsUrl: 'loan/moneyMonitor/exportXls',
        importExcelUrl: 'loan/moneyMonitor/importExcel',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {},
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>