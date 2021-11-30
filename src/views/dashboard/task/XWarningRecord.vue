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
      <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
        {{ record.status | typeFormat(warnStatus) }}
      </span>
      <span slot="yjjbSlot" slot-scope="text, record" :class="`tag-level level${record.yjjb}`">
        {{ record.yjjb === '1' ? '高' : record.yjjb === '2' ? '中' : '低' }}
      </span>
      <span slot="ifeffectSlot" slot-scope="text, record" :class="`tag-effect effect${record.ifeffect}`">
        {{ record.ifeffect === null ? '—' : record.ifeffect === 0 ? '失效' : '生效' }}
      </span>
    </StandardTable>
    <x-warning-record-modal ref="modalForm" @ok="modalFormOk"></x-warning-record-modal>
    <XWarningRecordDetails ref="XWarningRecordDetails" @ok="modalFormOk"></XWarningRecordDetails>
    <removeWarningModal ref="removeWarningModal" @ok="modalFormOk"></removeWarningModal>
  </div>
</template>

<script>
import { tableListMixin } from '@/mixins/tableListMixin'
import XWarningRecordModal from '../../warning/modules/XWarningRecordModal'
import XWarningRecordDetails from '../../warning/modules/XWarningRecordDetails'
import removeWarningModal from '../../warning/modules/removeWarningModal'
import { customerType, warnStatus, yjxh } from '@/utils/dictionary'
import { filterDictTextByCache } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'XWarningRecordList',
  mixins: [tableListMixin],
  components: {
    XWarningRecordModal,
    XWarningRecordDetails,
    removeWarningModal,
  },
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
      warnStatus,
      columns: [
        {
          title: '门店编号',
          dataIndex: 'code',
          width: 120,
          align: 'left',
        },
        // {
        //   title: '客户类型',
        //   align: 'left',
        //   width: 120,
        //   dataIndex: 'customerType',
        //   customRender: function (t, r, index) {
        //     return t ? customerType[t] : '其他'
        //   },
        // },
        {
          title: '加盟酒店店名',
          align: 'left',
          width: 120,
          dataIndex: 'customerName',
        },
        {
          title: '所属品牌方',
          align: 'left',
          width: 120,
          ellipsis: true,
          dataIndex: 'customerDepartment',
          customRender: function (t, r, index) {
            return t ? filterDictTextByCache('brand_types', t) : ''
          },
        },
        {
          title: '预警信号',
          align: 'left',
          width: 180,
          dataIndex: 'yjxh',
          ellipsis: true,
          customRender: function (t, r, index) {
            return t ? yjxh[t] : '其他'
          },
        },
        {
          title: '预警状态',
          align: 'center',
          width: 120,
          dataIndex: 'ifeffect',
          scopedSlots: { customRender: 'ifeffectSlot' },
        },
        {
          title: '预警级别',
          align: 'center',
          width: 120,
          dataIndex: 'yjjb',
          scopedSlots: { customRender: 'yjjbSlot' },
        },
        {
          title: '流程阶段',
          align: 'center',
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
    //   this.columns.splice(6, 1)
    //   // this.columns[6].title = '处理阶段'
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
      this.$refs.XWarningRecordDetails.init(record)
    },
    handleRemove(record) {
      this.$refs.removeWarningModal.init(record)
    },
  },
}
</script>
<style  lang="less" scoped>
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
    background: #eb4e33;
  }
  &.status2::before,
  &.status3::before,
  &.status4::before {
    background: #4664b4;
  }
  &.status5::before,
  &.status6::before {
    background: #4cb325;
  }
  &.status7::before {
    background: #eb4e33;
  }
}
.tag-level {
  position: relative;
  padding-left: 14px;
  color: #b52309;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #b52309;
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 0;
    margin-top: -3px;
  }
  &.level2 {
    color: #eb4e33;
    &::before {
      background: #eb4e33;
    }
  }
  &.level3 {
    color: #f0a100;
    &::before {
      background: #f0a100;
    }
  }
}
.tag-effect.effect1 {
  color: #67be46;
}
</style>