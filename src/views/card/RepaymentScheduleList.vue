<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="还款计划" fontSize="20px"> </PageTitle>
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
        :scroll="{ x: 2700 }"
      >
        <!-- 表头 -->
        <template slot="header">
          <PageTitle title="还款计划列表">
            <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('还款计划')">导出</a-button>
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
      <repaymentSchedule-modal ref="modalForm" @ok="modalFormOk"></repaymentSchedule-modal>
    </a-card>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import RepaymentScheduleModal from './modules/RepaymentScheduleModal'
import { tableListMixin } from '@/mixins/tableListMixin'

export default {
  name: 'RepaymentScheduleList',
  mixins: [tableListMixin],
  components: {
    RepaymentScheduleModal,
  },
  data() {
    return {
      description: '还款计划管理页面',
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
          title: '还款日期',
          align: 'center',
          width: 150,
          dataIndex: 'repaymentDate',
        },
        {
          title: '计息天数',
          align: 'center',
          width: 150,
          dataIndex: 'interestDays',
        },
        {
          title: '贷款本金余额(元)',
          align: 'center',
          width: 150,
          dataIndex: 'loanPrincipalBalance',
        },
        {
          title: '期间应还本金(元)',
          align: 'center',
          width: 150,
          dataIndex: 'currentBalance',
        },
        {
          title: '期间应还利息(元)',
          align: 'center',
          width: 150,
          dataIndex: 'currentInterest',
        },
        {
          title: '应还本息合计(元)',
          align: 'center',
          width: 150,
          dataIndex: 'currentInterestBalanceSum',
        },
        {
          title: '信托报酬(元)',
          align: 'center',
          width: 150,
          dataIndex: 'trusteeRevenue',
        },
        {
          title: '保管费(元)',
          align: 'center',
          width: 150,
          dataIndex: 'custodianFee',
        },
        {
          title: '贷款管理费(元)',
          align: 'center',
          width: 150,
          dataIndex: 'loanManagementFee',
        },
        {
          title: '其他费用增值税等(元)',
          align: 'center',
          width: 150,
          dataIndex: 'otherFee',
        },
        {
          title: '优先级本金余额(元)',
          align: 'center',
          width: 150,
          dataIndex: 'priorityPrincipalBalance',
        },
        {
          title: '优先级本金分配(元)',
          align: 'center',
          width: 150,
          dataIndex: 'priorityPrincipalAllocation',
        },
        {
          title: '优先级信托收益(元)',
          align: 'center',
          width: 150,
          dataIndex: 'priorityTrustIncome',
        },
        {
          title: '次级本金余额(元)',
          align: 'center',
          width: 150,
          dataIndex: 'principalBalance',
        },
        {
          title: '次级本金分配(元)',
          align: 'center',
          width: 150,
          dataIndex: 'subordinatedPrincipalAllocation',
        },
        {
          title: '次级收益分配(元)',
          align: 'center',
          width: 150,
          dataIndex: 'secondaryIncomeDistribution',
        },
      ],
      url: {
        list: '/loan/repaymentSchedule/list',
        delete: '/loan/repaymentSchedule/delete',
        deleteBatch: '/loan/repaymentSchedule/deleteBatch',
        exportXlsUrl: 'loan/repaymentSchedule/exportXls',
        importExcelUrl: 'loan/repaymentSchedule/importExcel',
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