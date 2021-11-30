<template>
  <div>
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="客户管理" fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="门店编号：">
                <a-input placeholder="请输入门店编号" v-model="queryParam.code" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="加盟酒店店名">
                <a-input placeholder="请输入加盟酒店店名" v-model="queryParam.jmjddm" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="联系方式：">
                <a-input placeholder="请输入联系方式" v-model="queryParam.mdlxfs" allowClear></a-input>
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
        :scroll="{ x: 1050 }"
        @getResult="getResult"
      >
        <template slot="header">
          <PageTitle title="客户列表" hasBefore>
            <!-- <span slot="title" class="table-title-count">
              共 <span class="sum">{{ counts.sum }}</span> 个客户，个人客户
              <span class="count">{{ counts.sum1 }}</span> 个，对公客户 <span>{{ counts.sum2 }}</span> 个
            </span> -->
            <a-button @click="add" type="primary" v-has="'XCustomerInfoList:add'" icon="plus">新 增</a-button>
          </PageTitle>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.status === 0" @click="viewDetails(record, 0)">编辑</a>
          <a v-else @click="viewDetails(record, 1)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.status !== 0">
                <a @click="viewDetails(record, 2)">建档信息</a>
              </a-menu-item>
              <a-menu-item v-if="record.status === 1" v-has="'XCustomerInfoList:change'">
                <a @click="viewDetails(record, 3)">信息变更</a>
              </a-menu-item>

              <a-menu-item>
                <a @click="viewHistory(record)">变更记录</a>
              </a-menu-item>
              <a-menu-item v-if="record.status !== 0" v-has="'XCustomerInfoList:plot'">
                <a @click="viewHistoryPlot(record)" >客户画像</a>
              </a-menu-item>
              <a-menu-item v-if="record.status === 0">
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <span slot="status" slot-scope="text, record" :class="`tag-status status${record.status}`">
          {{ record.status == 0 ? ' 待 完 善 ' : record.status == 1 ? '信息完整' : '变更申请' }}
        </span>
      </StandardTable>
    </a-card>
    <!-- <x-customer-info-modal ref="modalForm" @ok="modalReturn"></x-customer-info-modal> -->
    <changeHistoryModal ref="changeHistoryModal" @ok="historyOk"></changeHistoryModal>
  </div>
</template>

<script>
import { tableListMixin } from '@/mixins/tableListMixin'
import changeHistoryModal from './modules/changeHistoryModal'
import { customerType, zjType, ssppgsmc } from '@/utils/dictionary'
import { filterDictTextByCache } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'XCustomerInfoList',
  mixins: [tableListMixin],
  components: {
    changeHistoryModal,
  },
  data() {
    return {
      description: 'x_customer_info管理页面',
      customerType,
      counts: {
        sum: 0,
        sum1: 0,
        sum2: 0,
      },
      // 表头
      columns: [
        {
          title: '门店编号',
          dataIndex: 'code',
          width: 150,
          align: 'left',
          ellipsis: true,
        },
        {
          title: '加盟酒店店名',
          align: 'left',
          width: 150,
          dataIndex: 'jmjddm',
          ellipsis: true,
        },
        {
          title: '门店所属品牌',
          align: 'left',
          width: 150,
          dataIndex: 'mdsspp',
          customRender: function (t, r, index) {
            return t ? filterDictTextByCache('brand_types', t) : ''
          },
        },
        {
          title: '门店联系人',
          align: 'left',
          width: 150,
          dataIndex: 'mdlxr',
          ellipsis: true,
        },
        {
          title: '门店联系方式',
          align: 'left',
          width: 150,
          dataIndex: 'mdlxfs',
          ellipsis: true,
        },

        {
          title: '状态',
          align: 'left',
          width: 150,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },

        {
          title: '操作',
          dataIndex: 'action',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/credit/xCustomerInfo/list',
        delete: '/credit/xCustomerInfo/delete',
        deleteBatch: '/credit/xCustomerInfo/deleteBatch',
        exportXlsUrl: '/credit/xCustomerInfo/exportXls',
        importExcelUrl: 'credit/xCustomerInfo/importExcel',
      },
      dictOptions: {},
    }
  },

  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
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
    add() {
      this.$router.push({
        path: '/customer/XCustomerInfoDetails',
        query: { type: 0 },
      })
    },
    viewDetails(record, type) {
      this.$router.push({
        path: '/customer/XCustomerInfoDetails',
        query: { type: type, id: record.id },
      })
    },

    viewHistory(record) {
      this.$refs.changeHistoryModal.init(record)
    },
    historyOk(record) {
      this.$router.push({
        path: '/customer/XCustomerInfoDetails',
        query: { type: 4, id: record.id },
      })
    },
    viewHistoryPlot(record) {
      this.$router.push({
        path: '/customer/XCustomerInfoPlot',
        query: { id: record.id },
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import '~@assets/less/common.less';

.card-header-wrapper {
  padding: 16px 16px 0;
  span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #737373;
    line-height: 32px;
  }
}
.tag-status {
  position: relative;
  padding-left: 14px;
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #4664b4;
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 0;
    margin-top: -3px;
  }
  &.status1::before {
    background: #4cb325;
  }
  &.status2::before {
    background: #eb4e33;
  }
}
</style>