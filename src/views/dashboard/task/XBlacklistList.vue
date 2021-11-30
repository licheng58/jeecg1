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
      :scroll="{ x: 1020 }"
      @getResult="getResult"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleDetails(record)">{{ status === 0 ? '处理' : '查看' }}</a>
      </span>
      <span slot="ifeffectSlot" slot-scope="text, record" :class="`tag-effect effect${record.ifeffect}`">
        {{ record.ifeffect === null ? '—' : record.ifeffect === 0 ? '失效' : '生效' }}
      </span>
      <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
        {{ record.status | typeFormat(warnStatus) }}
      </span>
    </StandardTable>

    <!-- 新增对话框 -->
    <XBlacklistDetailsModal ref="XBlacklistDetailsModal" @ok="modalFormOk"></XBlacklistDetailsModal>
  </div>
</template>

<script>
/* 名单状态ifeffect: null-"—", 0-失效, 1-生效,
 * 流程状态warnStatus: 0-驳回, 1-发起, 2-待协查, 3-待审查, 4-待审批, 5-生效审批已通过, 6-失效审批已通过, 7-已否决
 */
import '@/assets/less/TableExpand.less'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, warnStatus, hmdType } from '@/utils/dictionary'
import XBlacklistDetailsModal from '../../blacklist/modules/XBlacklistDetailsModal'
import { filterDictTextByCache } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'XBlacklistList',
  mixins: [tableListMixin],
  components: {
    XBlacklistDetailsModal,
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
      description: 'x_blacklist管理页面',
      warnStatus,
      columns: [
        {
          title: '门店编号',
          align: 'left',
          width: 120,
          dataIndex: 'code',
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
          ellipsis: true,
          dataIndex: 'customerName',
        },
        {
          title: '所属品牌公司',
          align: 'left',
          width: 120,
          ellipsis: true,
          dataIndex: 'customerDepartment',
          customRender: function (t, r, index) {
            return t ? filterDictTextByCache('brand_types', t) : ''
          },
        },
        {
          title: '黑名单类型',
          align: 'left',
          width: 180,
          dataIndex: 'type',
          ellipsis: true,
          customRender: function (t, r, index) {
            return t ? hmdType[t] : '其他'
          },
        },
        {
          title: '名单状态',
          align: 'center',
          width: 120,
          dataIndex: 'ifeffect',
          scopedSlots: { customRender: 'ifeffectSlot' },
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
      this.$refs.XBlacklistDetailsModal.init(record)
    },
  },
  filters: {
    statusFormat(status) {
      let str = '其他'
      switch (status) {
        case 0:
          str = '驳回'
          break
        case 2:
          str = '待协查'
          break
        case 3:
          str = '待审查'
          break
        case 4:
          str = '待审批'
          break
        case 5:
        case 6:
          str = '已通过'
          break
        case 7:
          str = '已否决'
          break
      }
      return str
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
.tag-effect.effect1 {
  color: #67be46;
}
</style>