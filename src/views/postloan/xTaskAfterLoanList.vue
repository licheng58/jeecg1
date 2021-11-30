<template>
  <div>
    <!-- 查询区域 -->
    <a-card v-show="showModalFlag == 0" :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="贷后检查" fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="客户类型：">
                <a-select v-model="queryParam.customerType" placeholder="请选择客户类型" allowClear>
                  <a-select-option v-for="(value, key, index) of customerType" :key="index" :value="key">
                    {{ value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="客户名称：">
                <a-input placeholder="请输入客户名称" v-model="queryParam.xm" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="申请流水号：">
                <a-input placeholder="请输入申请流水号" v-model="queryParam.taskNo" allowClear></a-input>
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
    <a-card
      v-show="showModalFlag == 0"
      style="margin: 16px"
      :bordered="false"
      :body-style="{ margin: '0', padding: '0' }"
    >
      <StandardTable
        ref="MyTable"
        size="middle"
        rowKey="id"
        :loadUrl="url.list"
        :queryParam="queryParam"
        :columns="columns"
        @getResult="getResult"
        :scroll="{ x: 1020 }"
        :rowSelection="{
          selectedRowKeys: this.selectedRowKeys,
          hideDefaultSelections: true,
          onChange: (selectedRowKeys, selectedRows) => {
            this.handleSelectionChange(selectedRowKeys, selectedRows)
          },
          getCheckboxProps: (record) => ({
            props: {
              disabled: type === 2,
            },
          }),
        }"
      >
        <!-- 表头 -->
        <template slot="header">
          <PageTitle>
            <span slot="title" class="table-title-count">
              共 <span class="sum">{{ counts.sum }}</span> 条贷款，个人客户
              <span class="count">{{ counts.sum1 }}</span> 个，对公客户 <span>{{ counts.sum2 }}</span> 个
            </span>
            <a-button @click="handleGenReports" type="primary" :loading="reportLoading" v-has="'XTaskAssetList:handle'">批量生成报告</a-button>
            <a-button @click="handleAdd" type="primary" icon="plus" v-has="'XTaskAssetList:handle'">新 增</a-button>
          </PageTitle>
        </template>

        <!-- 操作列 -->
        <span slot="action" slot-scope="text, record">
          <a @click="viewReports(record)">报告</a>
          <a-divider type="vertical" />
          <a @click="handleAccount(record)">台账</a>
        </span>

        <!-- 报告更新时间 -->
        <span slot="dateSlot" slot-scope="text, record">
          {{ record.reportTime | moment('YYYY-MM-DD') }}
        </span>
        <!-- 报告状态 -->
        <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
          {{ record.status | typeFormat(reportStatus, '—') }}
        </span>
      </StandardTable>
    </a-card>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <xTaskAfterLoan-modal ref="modalForm" @ok="modalFormOk"></xTaskAfterLoan-modal>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import xTaskAfterLoanModal from './modules/xTaskAfterLoanModal'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, reportStatus } from '@/utils/dictionary'
import { putAction } from '../../api/manage'

export default {
  name: 'xTaskAfterLoanList',
  mixins: [tableListMixin],
  components: {
    xTaskAfterLoanModal,
  },
  data() {
    return {
      description: 'x_task_after_loan管理页面',
      showModalFlag: 0,
      customerType,
      reportStatus,
      type: 0,
      counts: {
        sum: 0,
        sum1: 0,
        sum2: 0,
      },
      // 表头
      columns: [
        {
          title: '申请流水号',
          align: 'left',
          width: 120,
          dataIndex: 'taskNo',
          ellipsis: true,
        },
        {
          title: '客户类型',
          align: 'left',
          width: 120,
          dataIndex: 'customerType',
          customRender: function (t, r, index) {
            return t ? customerType[t] : '其他'
          },
        },
        {
          title: '客户名称',
          align: 'left',
          width: 120,
          dataIndex: 'xm',
          ellipsis: true,
        },
        {
          title: '证件号码',
          align: 'left',
          width: 120,
          dataIndex: 'sjhm',
          ellipsis: true,
        },
        {
          title: '贷款金额(元)',
          align: 'left',
          width: 100,
          dataIndex: 'dkje',
        },
        {
          title: '贷款期限(月)',
          align: 'left',
          width: 100,
          dataIndex: 'dkqx',
        },
        {
          title: '贷后状态',
          align: 'left',
          width: 120,
          dataIndex: 'status',
          scopedSlots: { customRender: 'statusSlot' },
        },
        {
          title: '报告更新时间',
          align: 'left',
          width: 120,
          dataIndex: 'reportTime',
          scopedSlots: { customRender: 'dateSlot' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          align: 'left',
          scopedSlots: { customRender: 'action' },
        },
      ],
      reportLoading: false,
      url: {
        list: '/credit/xTaskAfterLoan/list',
        insertReportBatch: '/credit/xTaskAfterLoan/insertReportBatch',
      },
    }
  },
  computed: {},
  methods: {
    getResult(data) {
      if (data.count.count1) {
        this.counts.sum1 = data.count.count1
      }
      if (data.count.count2) {
        this.counts.sum2 = data.count.count2
      }
      this.counts.sum = this.counts.sum1 + this.counts.sum2
    },
    viewReports(record) {
      this.$router.push({
        path: '/postloan/postLoanReportList',
        query: {
          id: record.id,
          customerId: record.customerId,
          taskId: record.taskId,
          taskNo: record.taskNo,
          xm: record.xm,
        },
      })
    },
    detailsOk() {
      this.showModalFlag = 0
      this.modalFormOk()
    },
    handleAccount(record) {
      this.$router.push({
        path: '/loan/XTaskListAccount',
        query: { id: record.taskId, customerId: record.customerId },
      })
    },
    handleGenReports() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据!')
        return
      }

      this.reportLoading = true
      let param = new FormData()
      let jsonString = {
        code1: 1,
        code2: 1,
        code3: 1,
        code4: 1,
        code5: 1,
        code6: 1,
        isHasXC: 0,
      }
      param.append('ids', this.selectedRowKeys.join(','))
      param.append('jsonString', JSON.stringify(jsonString))
      putAction(this.url.insertReportBatch, param).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$refs.MyTable.reload()
        } else {
          this.$message.warning(res.message)
        }
        this.reportLoading = false
      })
    },
  },
}
</script>
<style>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>

.tag-status {
  position: relative;
  padding-left: 14px;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #a1a1a1;
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 0;
    margin-top: -3px;
  }
  &.status0::before {
    display: none;
    background: #4664b4;
  }
  &.status1::before {
    background: #4664b4;
  }
  &.status2::before {
    background: #4cb325;
  }
  &.statusnull::before {
    display: none;
  }
}
.tag-effect.effect1 {
  color: #67be46;
}
</style>