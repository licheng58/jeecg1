<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="资产分类" fontSize="20px"> </PageTitle>
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
    <a-card style="margin: 16px" :bordered="false" :body-style="{ margin: '0', padding: '0' }">
      <StandardTable
        ref="MyTable"
        size="middle"
        rowKey="id"
        :loadUrl="url.list"
        :queryParam="queryParam"
        :columns="columns"
        @getResult="getResult"
        :scroll="{ x: 1110 }"
      >
        <!-- 表头 -->
        <template slot="header">
          <PageTitle>
            <span slot="title" class="table-title-count">
              共 <span class="sum">{{ counts.sum }}</span> 条贷款，个人客户
              <span class="count">{{ counts.sum1 }}</span> 个，对公客户 <span>{{ counts.sum2 }}</span> 个
            </span>
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
              <a-menu-item v-if="[0, 3].includes(record.status)" v-has="'XTaskAssetList:handle'">
                <a @click="handleChange(record)">调整分类</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleHistory(record)">历史分类</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <span slot="zcflSlot" slot-scope="text, record">
          {{ record.status === 3 ? record.tzzcfl : record.xtzcfl | typeFormat(zcfl) }}
        </span>

        <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
          {{ record.status | typeFormat(tzzcflStatus) }}
        </span>
      </StandardTable>

      <!-- 表单区域 -->
      <xTaskAsset-modal ref="modalForm" @ok="modalFormOk"></xTaskAsset-modal>
    </a-card>
    <!-- table区域-end -->

    <!-- 其他表单区域 -->
    <changeAssetClass ref="changeAssetClass" @ok="modalFormOk"></changeAssetClass>
    <XTaskAssetDetailsModal ref="XTaskAssetDetailsModal" @ok="modalFormOk"></XTaskAssetDetailsModal>
    <classHistoryModal ref="classHistoryModal" @ok="modalFormOk"></classHistoryModal>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import XTaskAssetModal from './modules/XTaskAssetModal'
import changeAssetClass from './modules/changeAssetClass'
import XTaskAssetDetailsModal from './modules/XTaskAssetDetailsModal'
import classHistoryModal from './modules/classHistoryModal'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, zcfl, tzzcflStatus, ywbz, ywpz } from '@/utils/dictionary'
import { mapGetters } from 'vuex'

export default {
  name: 'XTaskAssetList',
  mixins: [tableListMixin],
  components: {
    XTaskAssetModal,
    changeAssetClass,
    XTaskAssetDetailsModal,
    classHistoryModal,
  },
  data() {
    return {
      description: '资产分类管理页面',
      // 表头
      role: '',
      customerType,
      zcfl,
      tzzcflStatus,
      counts: {
        sum: 0,
        sum1: 0,
        sum2: 0,
      },
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
        list: '/credit/xTaskAsset/list',
        delete: '/credit/xTaskAsset/delete',
      },
    }
  },
  created() {
    this.role = this.userInfo().role
  },
  computed: {},
  methods: {
    //获取用户信息
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
    handleChange(record) {
      this.$refs.changeAssetClass.init(record)
    },
    handleDetails(record) {
      this.$refs.XTaskAssetDetailsModal.init(record)
    },
    handleHistory(record) {
      this.$refs.classHistoryModal.init(record)
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