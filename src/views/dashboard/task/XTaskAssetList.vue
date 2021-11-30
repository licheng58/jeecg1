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
      :scroll="{ x: 1200 }"
      @getResult="getResult"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleDetails(record)">{{ status === 0 ? '处理' : '查看' }}</a>
      </span>
      <span slot="zcflSlot" slot-scope="text, record">
        {{ record.status === 3 ? record.tzzcfl : record.xtzcfl | typeFormat(zcfl) }}
      </span>

      <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
        {{ record.status | typeFormat(tzzcflStatus) }}
      </span>
    </StandardTable>
    <XTaskAssetDetailsModal ref="XTaskAssetDetailsModal" @ok="modalFormOk"></XTaskAssetDetailsModal>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'

import { tableListMixin } from '@/mixins/tableListMixin'
import XTaskAssetDetailsModal from '../../assetclass/modules/XTaskAssetDetailsModal'
import { customerType, zcfl, tzzcflStatus, ywbz, warnStatus } from '@/utils/dictionary'

export default {
  name: 'XWarningRecordList',
  mixins: [tableListMixin],
  components: {
    XTaskAssetDetailsModal,
  },
  props: {
    type: {
      type: Number,
      default: 7,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      customerType,
      warnStatus,
      zcfl,
      tzzcflStatus,
      columns: [
        {
          title: '申请流水号',
          align: 'left',
          width: 150,
          dataIndex: 'taskNo',
          ellipsis: true,
        },
        {
          title: '客户类型 ',
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
          title: '业务品种',
          align: 'left',
          width: 120,
          dataIndex: 'ywpz',
          ellipsis: true,
        },
        {
          title: '业务币种',
          align: 'left',
          width: 120,
          dataIndex: 'ywbz',
          ellipsis: true,
        },
        {
          title: '分类月份',
          align: 'left',
          width: 120,
          dataIndex: 'month',
        },
        {
          title: '资产分类结果',
          align: 'left',
          width: 120,
          dataIndex: 'xtzcfl',
          scopedSlots: { customRender: 'zcflSlot' },
          ellipsis: true,
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
    //   this.columns.splice(7, 1)
    //   // this.columns[7].title = '处理阶段'
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
      this.$refs.XTaskAssetDetailsModal.init(record)
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
  }
  &.status1::before {
    background: #4664b4;
  }
  &.status2::before {
    background: #4664b4;
  }
  &.status3::before {
    background: #4cb325;
  }
  &.status-1::before {
    background: #eb563c;
  }
  &.status-2::before {
    background: #eb563c;
  }
}
.tag-effect.effect1 {
  color: #67be46;
}
</style>