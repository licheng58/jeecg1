<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="资产保全" fontSize="20px"> </PageTitle>
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
    <!-- table区域-begin -->
    <a-card style="margin: 16px" :bordered="false" :body-style="{ margin: '0', padding: '0' }">
      <StandardTable
        ref="MyTable"
        size="middle"
        rowKey="id"
        :loadUrl="url.list"
        :queryParam="queryParam"
        :columns="columns"
        @getResult="getResult"
        :scroll="{ x: 1020 }"
      >
        <template slot="header">
          <PageTitle>
            <a-button @click="handleAdd" type="primary" icon="plus" v-has="'XTaskAssetList:handle'">新 增</a-button>
          </PageTitle>
        </template>
        <!-- 操作列 -->
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetails(record)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="!record.status || record.status === 0" v-has="'XTaskAssetProtectionList:handle'">
                <a @click="handleRecognize(record)">责任认定</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleRecovery(record)">回收情况</a>
              </a-menu-item>
              <a-menu-item v-if="record.ifEnd === 1 && record.status === 4" v-has="'XTaskAssetProtectionList:handle'">
                <a @click="handleEnd(record)">转终结</a>
              </a-menu-item>
              <a-menu-item v-if="record.ifeffect == 0">
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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

      <!-- 表单区域 -->
      <xTaskAssetProtection-modal ref="modalForm" @ok="modalFormOk"></xTaskAssetProtection-modal>
    </a-card>
    <!-- table区域-end -->

    <!-- 新增对话框 -->
    <!-- 查看 -->
    <XTaskAssetProtectionDetailsModal
      ref="XTaskAssetProtectionDetailsModal"
      @ok="modalFormOk"
    ></XTaskAssetProtectionDetailsModal>
    <!-- 回收情况 -->
    <repaymentRecord ref="repaymentRecord" @ok="modalFormOk"></repaymentRecord>
    <!-- 转终结 -->
    <XTaskAssetEnd ref="XTaskAssetEnd" @ok="modalFormOk"></XTaskAssetEnd>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import XTaskAssetProtectionModal from './modules/XTaskAssetProtectionModal'
import XTaskAssetProtectionDetailsModal from './modules/XTaskAssetProtectionDetailsModal'
import repaymentRecord from './modules/repaymentRecord'
import XTaskAssetEnd from './modules/XTaskAssetEnd'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, zcbqStatus, zcfl } from '@/utils/dictionary'
import moment from 'moment'
export default {
  name: 'XTaskAssetProtectionList',
  mixins: [tableListMixin],
  components: {
    XTaskAssetProtectionModal,
    XTaskAssetProtectionDetailsModal,
    repaymentRecord,
    XTaskAssetEnd,
  },
  data() {
    return {
      description: '资产保全管理页面',
      customerType,
      zcbqStatus,
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
            return t ? moment(t).format('YYYY-MM-DD') : ''
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
        list: '/credit/xTaskAssetProtection/list',
        delete: '/credit/xTaskAssetProtection/delete',
        deleteBatch: '/credit/xTaskAssetProtection/deleteBatch',
        exportXlsUrl: 'credit/xTaskAssetProtection/exportXls',
        importExcelUrl: 'credit/xTaskAssetProtection/importExcel',
      },
    }
  },
  computed: {},
  methods: {
    getResult(data) {
      // if (data.count.count1) {
      //   this.counts.sum1 = data.count.count1
      // }
      // if (data.count.count2) {
      //   this.counts.sum2 = data.count.count2
      // }
      // this.counts.sum = this.counts.sum1 + this.counts.sum2
    },
    handleRecognize(record) {
      this.$router.push({
        path: '/assetprotection/ResponsibilityRecognition',
        query: { id: record.id },
      })
    },
    handleDetails(record) {
      this.$refs.XTaskAssetProtectionDetailsModal.init(record)
    },
    handleRecovery(record) {
      this.$refs.repaymentRecord.init(record)
    },
    handleEnd(record) {
      this.$refs.XTaskAssetEnd.init(record)
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