<template>
  <div>
    <StandardTable
      ref="MyTable"
      size="middle"
      style="padding: 0"
      :rowKey="status === 0 ? 'dataId' : 'id'"
      :loadUrl="status === 0 ? url.list : url.queryPageYBList"
      :queryParam="queryParam"
      :columns="columns"
      :isTask="status === 0"
      @getResult="getResult"
      :scroll="{ x: 1020 }"
    >
      <!-- 操作列 -->
      <span slot="action" slot-scope="text, record">
        <a @click="viewReports(record)">报告</a>
      </span>

      <!-- 报告更新时间 -->
      <span slot="dateSlot" slot-scope="text, record">
        {{ record.reportTime | moment('YYYY-MM-DD') }}
      </span>
      <!-- 报告状态 -->
      <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
        {{ record.status | typeFormat(reportStatus, '--') }}
      </span>
    </StandardTable>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, reportStatus } from '@/utils/dictionary'

export default {
  name: 'xTaskAfterLoanList',
  mixins: [tableListMixin],
  components: {},
  props: {
    type: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      description: 'x_task_after_loan管理页面',
      customerType,
      reportStatus,
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
        list: '/credit/xAgencyRecord/list', //待办
        queryPageYBList: '/credit/xAgencyRecord/queryPageYBList', //已办
      },
    }
  },
  created() {
    this.queryParam.type = this.type
    this.queryParam.status = this.status
  },
  methods: {
    getResult(result) {
      let data = {
        type: this.type,
        total: result.total,
      }
      this.$emit('ok', data)
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
  },
}
</script>

<style lang="less" scoped>
@import '~@assets/less/common.less';
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