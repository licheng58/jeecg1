<template>
  <div>
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="合作方产品" fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="业务品种：">
                <a-select v-model="queryParam.ywpz" placeholder="请选择业务品种" allowClear>
                  <a-select-option v-for="(value, key, index) of ywpz" :key="index" :value="value">
                    {{ value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="合作方名称：">
                <a-input placeholder="请输入合作方名称" v-model="queryParam.partnerName" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="产品名称：">
                <a-input placeholder="请输入产品名称" v-model="queryParam.partnerProName" allowClear></a-input>
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

    <a-card style="margin: 16px" :bordered="false" :body-style="{ margin: '0', padding: '0' }">
      <StandardTable
        ref="MyTable"
        size="middle"
        rowKey="id"
        :loadUrl="url.list"
        :queryParam="queryParam"
        :columns="columns"
      >
        <template slot="header">
          <PageTitle title="合作方列表" hasBefore>
            <a-button @click="handleAdd" type="primary" v-has="'PartnerManageList:add'" icon="plus">新 增</a-button>
          </PageTitle>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
          <a-divider type="vertical" v-has="'PartnerManageList:add'" />
          <!-- <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" /> -->
          <!-- <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete2(record)">
            <a>删除</a>
          </a-popconfirm> -->
          <a-dropdown v-has="'PartnerManageList:add'">
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleEdit(record)">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete2(record)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </StandardTable>
      <x-partner-info-modal ref="modalForm" @ok="modalFormOk"></x-partner-info-modal>
    </a-card>
  </div>
</template>

<script>
import { httpAction } from '@/api/manage'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { tableListMixin } from '@/mixins/tableListMixin'
import XPartnerInfoModal from './modules/XPartnerInfoModal'
import { ywpz, ywbz } from '@/utils/dictionary'
import { numFormat } from '@/utils/util'

export default {
  name: 'XPartnerInfoList',
  mixins: [tableListMixin, mixinDevice],
  components: {
    XPartnerInfoModal,
  },
  data() {
    return {
      description: 'x_partner_info管理页面',
      ywpz,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          align: 'center',
          width: 60,
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '合作方名称',
          align: 'center',
          width: 120,
          dataIndex: 'partnerName',
        },
        {
          title: '产品名称',
          align: 'center',
          width: 120,
          // fixed: 'left',
          dataIndex: 'partnerProName',
        },
        {
          title: '业务品种',
          align: 'center',
          width: 120,
          dataIndex: 'ywpz',
        },
        {
          title: '业务币种',
          align: 'center',
          width: 120,
          dataIndex: 'ywbz',
        },
        {
          title: '额度上限(万)',
          align: 'center',
          width: 120,
          dataIndex: 'dkedsx',
          customRender: function (t, r, index) {
            return numFormat(t, 4)
          },
        },
        {
          title: '贷款利率(%)',
          align: 'center',
          width: 120,
          dataIndex: 'dkll',
        },
        {
          title: '贷款期限(月)',
          align: 'center',
          width: 120,
          dataIndex: 'dkqx',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 150,
          // fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/credit/xPartnerInfo/list',
        delete: '/credit/xPartnerInfo/delete',
        deleteBatch: '/credit/xPartnerInfo/deleteBatch',
        exportXlsUrl: '/credit/xPartnerInfo/exportXls',
        importExcelUrl: 'credit/xPartnerInfo/importExcel',
      },
      dictOptions: {},
    }
  },
  created() {},
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initDictConfig() {},
    handleDelete2: function (record) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      var model_data = Object.assign({}, record)
      console.log(model_data)
      httpAction(that.url.delete, model_data, 'delete').then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.searchQuery()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>