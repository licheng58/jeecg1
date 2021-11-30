<template>
  <div>
    <a-card :bordered="false" :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="预警管理" fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="门店编号：">
                <a-input placeholder="请输入门店编号" v-model="queryParam.code" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="加盟酒店店名：">
                <a-input placeholder="请输入加盟酒店店名" v-model="queryParam.customerName" allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所属品牌方">
                <j-dict-select-tag
                  placeholder="请输入所属品牌方"
                  v-model="queryParam.customerDepartment"
                  dictCode="brand_types"
                />
                <!-- <a-input placeholder="请输入所属品牌方" v-model="queryParam.customerDepartment" allowClear></a-input> -->
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
        :scroll="{ x: 1200 }"
      >
        <template slot="header">
          <PageTitle title="预警列表">
            <!-- <span slot="title" class="table-title-count">
              共 <span class="sum">{{ counts.sum }}</span> 个客户，个人客户
              <span class="count">{{ counts.sum1 }}</span> 个，对公客户 <span>{{ counts.sum2 }}</span> 个
            </span> -->
            <a-button @click="handleAdd" type="primary" v-has="'XWarningRecord:add'" icon="plus">新 增</a-button>
          </PageTitle>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetails(record)">查看</a>
          <a-divider
            v-has="'XWarningRecord:add'"
            type="vertical"
            v-if="([5, 7].includes(record.status) && record.ifeffect === 1) || record.ifeffect === 0"
          />
          <a
            v-has="'XWarningRecord:add'"
            v-if="[5, 7].includes(record.status) && record.ifeffect === 1"
            @click="handleRemove(record)"
            >预警解除</a
          >
          <a-popconfirm
            v-has="'XWarningRecord:add'"
            v-if="record.ifeffect === 0"
            title="确定删除吗?"
            @confirm="() => handleDelete(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>
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
    </a-card>
    <x-warning-record-modal ref="modalForm" @ok="modalFormOk"></x-warning-record-modal>
    <XWarningRecordDetails ref="XWarningRecordDetails" @ok="modalFormOk"></XWarningRecordDetails>
    <removeWarningModal ref="removeWarningModal" @ok="modalFormOk"></removeWarningModal>
  </div>
</template>

<script>
import { tableListMixin } from '@/mixins/tableListMixin'
import XWarningRecordModal from './modules/XWarningRecordModal'
import XWarningRecordDetails from './modules/XWarningRecordDetails'
import removeWarningModal from './modules/removeWarningModal'
import { customerType, warnStatus, yjxh } from '@/utils/dictionary'
import { filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'XWarningRecordList',
  mixins: [tableListMixin],
  components: {
    XWarningRecordModal,
    XWarningRecordDetails,
    removeWarningModal,
    JDictSelectTag,
  },
  data() {
    return {
      customerType,
      warnStatus,
      // counts: {
      //   sum: 0,
      //   sum1: 0,
      //   sum2: 0,
      // },
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
        list: '/credit/xWarningRecord/list',
        delete: '/credit/xWarningRecord/delete',
        deleteBatch: '/credit/xWarningRecord/deleteBatch',
        exportXlsUrl: '/credit/xWarningRecord/exportXls',
        importExcelUrl: 'credit/xWarningRecord/importExcel',
      },
      dictOptions: {},
    }
  },

  methods: {
    // getResult(data) {
    //   if (data.count.count1) {
    //     this.counts.sum1 = data.count.count1
    //   }
    //   if (data.count.count2) {
    //     this.counts.sum2 = data.count.count2
    //   }
    //   this.counts.sum = this.counts.sum1 + this.counts.sum2
    // },
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
    display: block;
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