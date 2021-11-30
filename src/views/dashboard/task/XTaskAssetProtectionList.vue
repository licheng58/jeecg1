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
        <a @click="handleDetails(record)">{{ status === 0 ? '处理' : '查看' }}</a>
      </span>

      <span slot="statusSlot" slot-scope="text, record">
        <span v-if="record.status" :class="`tag-status status${record.status}`">
          {{ record.status | typeFormat(zcbqStatus) }}
        </span>
        <span v-else>--</span>
      </span>
      <span slot="ifEndSlot" slot-scope="text, record" :class="`tag-ifEnd ifEnd${record.ifEnd}`">
        {{ record.ifEnd === null ? '—' : record.ifEnd === 1 ? '未终结' : '已终结' }}
      </span>
    </StandardTable>

    <XTaskAssetProtectionDetailsModal
      ref="XTaskAssetProtectionDetailsModal"
      @ok="modalFormOk"
    ></XTaskAssetProtectionDetailsModal>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import XTaskAssetProtectionDetailsModal from '../../assetprotection/modules/XTaskAssetProtectionDetailsModal'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, zcbqStatus, zcfl } from '@/utils/dictionary'

import moment from 'moment'
export default {
  name: 'XTaskAssetProtectionList',
  mixins: [tableListMixin],
  components: {
    XTaskAssetProtectionDetailsModal,
  },
  props: {
    type: {
      type: Number,
      default: 8,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      description: '资产保全管理页面',
      customerType,
      zcbqStatus,

      // 表头
      columns: [
        {
          title: '申请流水号',
          align: 'left',
          width: 120,
          dataIndex: 'taskNo',
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
        },
        {
          title: '贷款金额(元)',
          align: 'left',
          width: 120,
          dataIndex: 'dkje',
        },
        {
          title: '到期日期',
          align: 'left',
          width: 120,
          dataIndex: 'dqrq',
          customRender: function (t, r, index) {
            return t ? moment(t).format('YYYY-DD-MM') : ''
          },
        },

        // {
        //   title: '当前余额(元)',
        //   align: 'left',
        //   width: 120,
        //   dataIndex: 'dqye',
        // },
        // {
        //   title: '回收金额(元)',
        //   align: 'left',
        //   width: 120,
        //   dataIndex: 'hsje',
        // },
        {
          title: '五级分类',
          align: 'left',
          width: 120,
          dataIndex: 'wjfl',
          customRender: function (t, r, index) {
            return t ? zcfl[t] : ''
          },
        },
        {
          title: '资产状态',
          align: 'left',
          width: 120,
          dataIndex: 'ifEnd',
          scopedSlots: { customRender: 'ifEndSlot' },
        },
        {
          title: '流程阶段',
          align: 'left',
          width: 120,
          dataIndex: 'status',
          scopedSlots: { customRender: 'statusSlot' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 120,
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
    //   this.columns.splice(9, 1)
    //   // this.columns[9].title = '处理阶段'
    // }
  },
  methods: {
    getResult(result) {
      let data = {
        type: this.type,
        total: result.total,
      }
      this.$emit('ok', data)
    },

    handleDetails(record) {
      this.$refs.XTaskAssetProtectionDetailsModal.init(record)
    },
  },
}
</script>

<style  lang="less" scoped>
.tag-ifEnd,
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
  }
  &.ifEnd0::before,
  &.status-1::before,
  &.status-2::before {
    background: #eb4e33;
  }
  &.status1::before,
  &.status2::before,
  &.status3::before {
    background: #4664b4;
  }

  &.ifEnd1::before {
    background: #4cb325;
  }
  &.ifEndnull::before {
    display: none;
  }
}
</style>