<template>
  <div>
    <StandardTable
      style="padding: 0"
      ref="MyTable"
      size="middle"
      :rowKey="status === 0 ? 'dataId' : 'id'"
      :loadUrl="status === 0 ? url.list : url.queryPageYBList"
      :queryParam="queryParam"
      :columns="columns"
      :isTask="status === 0"
      @getResult="getResult"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleDetails(record)">{{ status === 0 ? '处理' : '查看' }}</a>
      </span>
      <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
        {{ record.status | typeFormat(loanStatus) }}
      </span>
    </StandardTable>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'

import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, loanStatus } from '@/utils/dictionary'
import { mapGetters } from 'vuex'

export default {
  name: 'XTaskList',
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
      customerType,
      loanStatus,
      role: '',
      columns: [
        {
          title: '申请流水号',
          dataIndex: 'taskNo',
          width: 130,
          align: 'left',
          ellipsis: true,
        },
        {
          title: '门店编号',
          dataIndex: 'code',
          width: 130,
          align: 'left',
          ellipsis: true,
        },
        {
          title: '主借人',
          align: 'left',
          width: 120,
          dataIndex: 'zjr',
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
          title: '合作方名称',
          align: 'left',
          width: 120,
          dataIndex: 'partnerName',
        },
        {
          title: '合作方产品',
          align: 'left',
          width: 120,
          dataIndex: 'partnerProName',
        },

        {
          title: '申请金额(万)',
          align: 'center',
          width: 120,
          dataIndex: 'amount',
        },
        {
          title: '额度上限(万)',
          align: 'center',
          width: 120,
          dataIndex: 'amountMax',
        },
        {
          title: '贷款状态',
          align: 'left',
          width: 120,
          dataIndex: 'status',
          scopedSlots: { customRender: 'statusSlot' },
        },

        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          align: 'left',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/credit/xAgencyRecord/list', //待办
        queryPageYBList: '/credit/xAgencyRecord/queryPageYBList', //已办
      },
    }
  },
  created() {
    this.queryParam.type = this.type
    this.queryParam.status = this.status
    // if (this.status === 1) {
    //   this.columns.splice(8, 1)
    //   // this.columns[8].title = '处理阶段'
    // }
    this.role = this.userInfo().role
  },
  methods: {
    ...mapGetters(['userInfo']),
    getResult(result) {
      let data = {
        type: this.type,
        total: result.total,
      }
      this.$emit('ok', data)
    },
    handleNew() {
      this.$router.push({
        path: '/loan/XTaskListDetails',
        query: { type: 0 },
      })
    },

    handleDetails(record) {
      if (this.role === '1') {
        let type = record.status === -1 ? 1 : 2
        this.$router.push({
          path: '/loan/XTaskListDetails',
          query: { type: type, id: record.id },
        })
      } else {
        this.$router.push({
          path: '/loan/XTaskListHandel',
          query: { id: record.id },
        })
      }
    },
  },
}
</script>
<style scoped lang="less">
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
  &.status-1::before,
  &.status-2::before {
    background: #eb4e33;
  }
  &.status1::before,
  &.status2::before,
  &.status3::before {
    background: #4664b4;
  }
  &.status0::before {
    background: #4cb325;
  }
}
</style>