<template>
  <div>
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="贷款管理" fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="客户类型">
                <a-select v-model="queryParam.customerType" placeholder="请选择客户类型" allowClear>
                  <a-select-option v-for="(value, key, index) of customerType" :key="index" :value="key">{{
                    value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="客户名称">
                <a-input placeholder="请输入客户名称" v-model="queryParam.xm" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="申请流水号">
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
    <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0', padding: '0' }">
      <StandardTable
        ref="MyTable"
        size="middle"
        rowKey="id"
        :loadUrl="url.list"
        :queryParam="queryParam"
        :columns="columns"
        :scroll="{ x: 1320 }"
        @getResult="getResult"
      >
        <template slot="header">
          <PageTitle>
            <span slot="title" class="table-title-count">
              共 <span class="sum">{{ counts.sum }}</span> 个客户，个人客户
              <span class="count">{{ counts.sum1 }}</span> 个，对公客户 <span>{{ counts.sum2 }}</span> 个
            </span>
            <a-button @click="openModel" type="primary" v-has="'XTaskList:add'" icon="plus">新 增</a-button>
          </PageTitle>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetails(record)">{{ role === '1' && [-1, 0].includes(record.status) ? '编辑' : '查看' }}</a>
          <a-divider type="vertical" v-if="record.status === 4" />
          <a @click="handleAccount(record)" v-if="record.status === 4">台账</a>
        </span>
        <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
          {{ record.status | typeFormat(loanStatus) }}
        </span>
      </StandardTable>
    </a-card>
    <XTaskModal ref="XTaskModal" @ok="handleNew"></XTaskModal>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'

import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, loanStatus } from '@/utils/dictionary'
import { mapGetters } from 'vuex'
import XTaskModal from './modules/XTaskModal'
import { numFormat } from '@/utils/util'

export default {
  name: 'XTaskList',
  mixins: [tableListMixin],
  components: {
    XTaskModal,
  },
  data() {
    return {
      customerType,
      loanStatus,
      counts: {
        sum: 0,
        sum1: 0,
        sum2: 0,
      },
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
          customRender: function (t, r, index) {
            return numFormat(t, 2)
          },
        },
        {
          title: '额度上限(万)',
          align: 'center',
          width: 120,
          dataIndex: 'amountMax',
          customRender: function (t, r, index) {
            return numFormat(t, 2)
          },
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
        list: '/credit/xTask/list',
        delete: '/credit/xTask/delete',
        deleteBatch: '/credit/xTask/deleteBatch',
        exportXlsUrl: 'credit/xTask/exportXls',
        importExcelUrl: 'credit/xTask/importExcel',
      },
    }
  },
  created() {
    this.role = this.userInfo().role
  },
  methods: {
    ...mapGetters(['userInfo']),

    getResult(data) {
      if (data.count.count1) {
        this.counts.sum1 = data.count.count1
      }
      if (data.count.count2) {
        this.counts.sum2 = data.count.count2
      }
      this.counts.sum = this.counts.sum1 + this.counts.sum2
    },
    openModel() {
      this.$refs.XTaskModal.init()
    },
    //purpose 货款用途
    handleNew(purpose) {
      this.$router.push({
        path: '/loan/XTaskListDetails',
        query: { type: 0, purpose: purpose },
      })
    },

    handleDetails(record) {
      if (this.role === '1') {
        let type = [-1, 0].includes(record.status) ? 1 : 2
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

    handleAccount(record) {
      this.$router.push({
        path: '/loan/XTaskListAccount',
        query: { id: record.id, customerId: record.customerId },
      })
    },
  },
}
</script>
<style  lang="less" scoped>
// @import '~@assets/less/common.less';
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