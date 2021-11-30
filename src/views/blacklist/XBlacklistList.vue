<template>
  <div>
    <!-- 查询区域 -->
    <a-card :bordered="false"
            :body-style="{ margin: '0px', padding: '0px 24px' }">
      <PageTitle title="黑名单"
                 fontSize="20px"> </PageTitle>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="门店编号：">
                <a-input placeholder="请输入门店编号"
                         v-model="queryParam.code"
                         allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="加盟酒店店名：">
                <a-input placeholder="请输入加盟酒店店名"
                         v-model="queryParam.customerName"
                         allowClear></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所属品牌方">
                <j-dict-select-tag placeholder="请输入所属品牌方"
                                   v-model="queryParam.customerDepartment"
                                   dictCode="brand_types" />
                <!-- <a-input placeholder="请输入所属品牌方" v-model="queryParam.customerDepartment" allowClear></a-input> -->
              </a-form-item>
            </a-col>

            <a-col :span="6">
              <a-form-item>
                <a-button type="primary"
                          @click="searchQuery">查询</a-button>
                <a-button @click="searchReset"
                          style="margin-left: 8px">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <!-- table区域-begin -->
    <a-card style="margin: 16px"
            :bordered="false"
            :body-style="{ margin: '0', padding: '0' }">
      <StandardTable ref="MyTable"
                     size="middle"
                     rowKey="id"
                     :loadUrl="url.list"
                     :queryParam="queryParam"
                     :columns="columns"
                     :scroll="{ x: 1020 }">
        <!-- 表头 -->
        <template slot="header">
          <PageTitle title="黑名单列表">
            <!-- <span slot="title" class="table-title-count">
              共 <span class="sum">{{ counts.sum }}</span> 个客户，个人客户
              <span class="count">{{ counts.sum1 }}</span> 个，对公客户 <span>{{ counts.sum2 }}</span> 个
            </span> -->
            <a-button @click="handleAdd"
                      type="primary"
                      v-has="'XBlacklistList:add'"
                      icon="plus">新 增</a-button>
          </PageTitle>
        </template>

        <!-- 操作列 -->
        <span slot="action"
              slot-scope="text, record">
          <a @click="handleDetails(record)">查看</a>
          <!-- <a v-if="record.status == 0" @click="handleEdit(record)">编辑</a> -->
          <a-divider type="vertical"
                     v-has="'XBlacklistList:add'"
                     v-if="([5, 7].includes(record.status) && record.ifeffect === 1) || record.ifeffect === 0" />

          <a-popconfirm title="确定删除吗?"
                        v-has="'XBlacklistList:add'"
                        v-if="record.ifeffect === 0"
                        @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <a v-if="[5, 7].includes(record.status) && record.ifeffect === 1"
             v-has="'XBlacklistList:add'"
             @click="handleRemove(record)">解禁申请</a>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">
              更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.ifeffect == 1">
                <a @click="handleEdit(record)">解禁申请</a>
              </a-menu-item>
              <a-menu-item v-if="record.ifeffect == 0">
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
        <span slot="ifeffectSlot"
              slot-scope="text, record"
              :class="`tag-effect effect${record.ifeffect}`">
          {{ record.ifeffect === null ? '—' : record.ifeffect === 0 ? '失效' : '生效' }}
        </span>
        <span slot="statusSlot"
              slot-scope="text, record"
              :class="`tag-status status${record.status}`">
          {{ record.status | typeFormat(warnStatus) }}
        </span>
      </StandardTable>

      <!-- 表单区域 -->
      <!-- 新增对话框 -->
      <xBlacklist-modal ref="modalForm"
                        @ok="modalFormOk"></xBlacklist-modal>
      <XBlacklistDetailsModal ref="XBlacklistDetailsModal"
                              @ok="modalFormOk"></XBlacklistDetailsModal>
      <removeBlacklistModal ref="removeBlacklistModal"
                            @ok="modalFormOk"></removeBlacklistModal>
    </a-card>
    <!-- table区域-end -->
  </div>
</template>

<script>
/* 名单状态ifeffect: null-"—", 0-失效, 1-生效,
 * 流程状态warnStatus: 0-驳回, 1-发起, 2-待协查, 3-待审查, 4-待审批, 5-生效审批已通过, 6-失效审批已通过, 7-已否决
 */
import '@/assets/less/TableExpand.less'
import XBlacklistModal from './modules/XBlacklistModal'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, warnStatus } from '@/utils/dictionary'
import XBlacklistDetailsModal from './modules/XBlacklistDetailsModal'
import removeBlacklistModal from './modules/removeBlacklistModal'
import { hmdType } from '@/utils/dictionary'
import { filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
import JDictSelectTag from '@/components/dict/JDictSelectTag'

export default {
  name: 'XBlacklistList',
  mixins: [tableListMixin],
  components: {
    XBlacklistModal,
    XBlacklistDetailsModal,
    removeBlacklistModal,
    JDictSelectTag,
  },
  data() {
    return {
      description: 'x_blacklist管理页面',
      warnStatus,
      // counts: {
      //   sum: 0,
      //   sum1: 0,
      //   sum2: 0,
      // },
      // 表头
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
        list: '/credit/xBlacklist/list',
        delete: '/credit/xBlacklist/delete',
        deleteBatch: '/credit/xBlacklist/deleteBatch',
        exportXlsUrl: 'credit/xBlacklist/exportXls',
        importExcelUrl: 'credit/xBlacklist/importExcel',
      },
    }
  },
  computed: {},
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
      this.$refs.XBlacklistDetailsModal.init(record)
    },
    handleRemove(record) {
      this.$refs.removeBlacklistModal.init(record)
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
          str = '以否决'
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