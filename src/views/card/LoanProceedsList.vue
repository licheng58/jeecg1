<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="贷款收益" fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="信托产品编号">
                <a-input placeholder="请输入信托产品编号" v-model="queryParam.trustProductNumber"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="信托机构名">
                <a-input placeholder="请输入信托机构名" v-model="queryParam.trustInstitutionName"></a-input>
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
          <PageTitle title="贷款收益列表">
            <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('贷款收益')">导出</a-button>
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
      <loanProceeds-modal ref="modalForm" @ok="modalFormOk"></loanProceeds-modal>
    </a-card>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import LoanProceedsModal from './modules/LoanProceedsModal'
import { tableListMixin } from '@/mixins/tableListMixin'

export default {
  name: 'LoanProceedsList',
  mixins: [tableListMixin],
  components: {
    LoanProceedsModal,
  },
  data() {
    return {
      description: '贷款收益管理页面',
      // 表头
      columns: [
        {
          title: '信托产品编号',
          align: 'center',
          width: 150,
          dataIndex: 'trustProductNumber',
        },
        {
          title: '信托机构名',
          align: 'center',
          width: 150,
          dataIndex: 'trustInstitutionName',
        },
        {
          title: '期数',
          align: 'center',
          width: 150,
          dataIndex: 'periods',
        },
        {
          title: '还款期间',
          align: 'center',
          width: 150,
          dataIndex: 'paymentNumber',
        },
        {
          title: '期间应收本金',
          align: 'center',
          width: 150,
          dataIndex: 'currentBalance',
        },
        {
          title: '期间应收利息',
          align: 'center',
          width: 150,
          dataIndex: 'currentInterest',
        },
        {
          title: '期间实收本金',
          align: 'center',
          width: 150,
          dataIndex: 'realBalance',
        },
        {
          title: '期间实收利息',
          align: 'center',
          width: 150,
          dataIndex: 'realInterest',
        },
        {
          title: '信托报酬',
          align: 'center',
          width: 150,
          dataIndex: 'trusteeRevenue',
        },
        {
          title: '保管费',
          align: 'center',
          width: 150,
          dataIndex: 'custodianFee',
        },
        {
          title: '贷款管理费',
          align: 'center',
          width: 150,
          dataIndex: 'loanManagementFee',
        },
        {
          title: '其他费用增值税等',
          align: 'center',
          width: 150,
          dataIndex: 'otherFee',
        },
        {
          title: '优先级本金余额',
          align: 'center',
          width: 150,
          dataIndex: 'priorityPrincipalBalance',
        },
        {
          title: '优先级本金分配',
          align: 'center',
          width: 150,
          dataIndex: 'priorityPrincipalAllocation',
        },
        {
          title: '优先级信托收益',
          align: 'center',
          width: 150,
          dataIndex: 'priorityTrustIncome',
        },
        {
          title: '次级本金余额',
          align: 'center',
          width: 150,
          dataIndex: 'principalBalance',
        },
        {
          title: '次级本金分配',
          align: 'center',
          width: 150,
          dataIndex: 'subordinatedPrincipalAllocation',
        },
        {
          title: '次级收益分配',
          align: 'center',
          width: 150,
          dataIndex: 'secondaryIncomeDistribution',
        },
      ],
      url: {
        list: '/loan/loanProceeds/list',
        delete: '/loan/loanProceeds/delete',
        deleteBatch: '/loan/loanProceeds/deleteBatch',
        exportXlsUrl: 'loan/loanProceeds/exportXls',
        importExcelUrl: 'loan/loanProceeds/importExcel',
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