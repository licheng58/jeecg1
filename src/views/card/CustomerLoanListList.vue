<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="客户贷款" fontSize="20px"> </PageTitle>
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
          <PageTitle title="客户贷款列表">
            <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('客户贷款')">导出</a-button>
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
      <customerLoanList-modal ref="modalForm" @ok="modalFormOk"></customerLoanList-modal>
    </a-card>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import CustomerLoanListModal from './modules/CustomerLoanListModal'
import { tableListMixin } from '@/mixins/tableListMixin'

export default {
  name: 'CustomerLoanListList',
  mixins: [tableListMixin],
  components: {
    CustomerLoanListModal,
  },
  data() {
    return {
      description: '客户贷款列表管理页面',
      // 表头
      columns: [
        {
          title: '客户名称',
          align: 'center',
          width: 150,
          ellipsis: true,
          dataIndex: 'customerName',
        },
        {
          title: '统一社会信用代码',
          align: 'center',
          width: 150,
          ellipsis: true,
          dataIndex: 'unifiedSocialCreditCode',
        },
        {
          title: '贷款金额(元)',
          align: 'center',
          width: 150,
          dataIndex: 'loanAmount',
        },
        {
          title: '贷款期限(月)',
          align: 'center',
          width: 150,
          dataIndex: 'loanPeriod',
        },
        {
          title: '贷款利率',
          align: 'center',
          width: 150,
          dataIndex: 'loanRate',
        },
        {
          title: '贷款日期',
          align: 'center',
          width: 150,
          dataIndex: 'loanCreatetime',
        },
        {
          title: '所属信托公司',
          align: 'center',
          width: 150,
          dataIndex: 'subordinateTrustCompany',
        },
        {
          title: '期数',
          align: 'center',
          width: 150,
          dataIndex: 'periods',
        },
        {
          title: '剩余本金(元)',
          align: 'center',
          width: 150,
          dataIndex: 'residualPrincipal',
        },
        {
          title: '剩余利息(元)',
          align: 'center',
          width: 150,
          dataIndex: 'residualInterest',
        },
        {
          //(1：待还款|2：已完成|0：已取消|3：已逾期)
          title: '贷款状态',
          align: 'center',
          width: 150,
          dataIndex: 'loanState',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/loan/customerLoanList/list',
        delete: '/loan/customerLoanList/delete',
        deleteBatch: '/loan/customerLoanList/deleteBatch',
        exportXlsUrl: 'loan/customerLoanList/exportXls',
        importExcelUrl: 'loan/customerLoanList/importExcel',
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