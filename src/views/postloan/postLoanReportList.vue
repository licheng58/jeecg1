<template>
  <div class="page-customer-details">
    <a-card :bordered="false" :body-style="{ margin: '0px 0px 16px', padding: '16px 24px 0' }">
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.back()"> 贷后管理 </a-breadcrumb-item>
        <a-breadcrumb-item> 贷后报告 </a-breadcrumb-item>
      </a-breadcrumb>
      <div></div>
      <PageTitle title="贷后报告" fontSize="20px">
        <a-button @click="$router.back()">返回</a-button>
      </PageTitle>
    </a-card>

    <!-- table区域-begin -->
    <a-spin :spinning="loading">
      <!-- 初始化isLoad="false"不加载,默认为false -->
      <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0', padding: '0' }">
        <StandardTable
          ref="MyReportTable"
          size="middle"
          rowKey="id"
          :loadUrl="url.list"
          :queryParam="queryParam"
          :columns="columns"
          :scroll="{ x: 1020 }"
        >
          <!-- 表头 -->
          <template slot="header">
            <PageTitle title="报告列表">
              <a-button @click="handleAdd2()" type="primary" icon="plus" v-has="'postLoanReportList:edit'"
                >新 增</a-button
              >
            </PageTitle>
          </template>

          <!-- 操作列 -->
          <span slot="action" slot-scope="text, record">
            <a @click="handleDetail2(record)">查看</a>
            <span v-has="'postLoanReportList:edit'">
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="handleEdit2(record)">编辑</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete2(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </span>

          <!-- 创建时间 -->
          <span slot="dateSlot" slot-scope="text, record">
            {{ record.createTime | moment('YYYY-MM-DD') }}
          </span>
          <!-- 协查状态 -->
          <span slot="statusSlot" slot-scope="text, record" :class="`tag-status status${record.status}`">
            {{ record.status | typeFormat(xcStatus, '--') }}
          </span>
        </StandardTable>

        <!-- 表单区域 -->
        <xTaskReport-modal ref="reportModalForm" @ok="reportOk"></xTaskReport-modal>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import xTaskReportModal from './modules/xTaskReportModal'
import { deleteAction } from '@/api/manage'
import { tableListMixin } from '@/mixins/tableListMixin'
import { customerType, xcStatus } from '@/utils/dictionary'

export default {
  name: 'postLoanReportList',
  mixins: [tableListMixin],
  components: {
    xTaskReportModal,
  },
  data() {
    return {
      description: 'x_task_report管理页面',
      showModalFlag: 0,
      customerType,
      xcStatus,

      id: Number(this.$route.query.id),
      customerId: Number(this.$route.query.customerId),
      taskId: Number(this.$route.query.taskId),
      taskNo: this.$route.query.taskNo,
      xm: this.$route.query.xm,
      columns: [
        {
          title: '申请流水号',
          align: 'left',
          width: 120,
          dataIndex: 'taskNo',
          ellipsis: true,
        },
        {
          title: '报告编号',
          align: 'left',
          width: 120,
          dataIndex: 'code',
          ellipsis: true,
        },
        {
          title: '报告名称',
          align: 'left',
          width: 120,
          dataIndex: 'bgmc',
          ellipsis: true,
        },
        {
          title: '客户名称',
          align: 'left',
          width: 120,
          dataIndex: 'xm',
          ellipsis: true,
        },
        {
          title: '协查状态',
          align: 'left',
          width: 120,
          dataIndex: 'status',
          scopedSlots: { customRender: 'statusSlot' },
        },
        {
          title: '创建时间',
          align: 'left',
          width: 120,
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'dateSlot' },
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
        list: '/credit/xTaskReport/list',
        delete: '/credit/xTaskReport/delete',
      },
    }
  },
  created() {
    this.queryParam.taskNo = this.taskNo
  },
  methods: {
    handleAdd2() {
      this.$refs.reportModalForm.add({
        taskAfterId: this.id,
        customerId: this.customerId,
        taskId: this.taskId,
        taskNo: this.taskNo,
        xm: this.xm,
      })
      this.$refs.reportModalForm.title = '新增贷后报告'
      this.$refs.reportModalForm.disableSubmit = false
    },

    handleDetail2: function (record) {
      this.$refs.reportModalForm.disableSubmit = true
      this.$refs.reportModalForm.edit(record)
      this.$refs.reportModalForm.title = '详情'
    },
    handleEdit2(record) {
      this.$refs.reportModalForm.edit(record)
      this.$refs.reportModalForm.title = '编辑'
      this.$refs.reportModalForm.disableSubmit = false
    },
    handleDelete2: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          // 重新加载列表
          that.queryParam.taskNo = this.taskNo
          that.$refs.MyReportTable.reload()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    reportOk(record) {
      this.$refs.reportModalForm.visible = false
      this.$nextTick(() => {
        this.$refs.MyReportTable.reload()
      })
    },
  },
}
</script>
<style>
@import '~@assets/less/common.less';
</style>
<style lang="less" scoped>
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
  &.statusnull::before {
    display: none;
  }
  &.status0::before {
    display: none;
  }
  &.status1::before {
    background: #4664b4;
  }
  &.status2::before {
    background: #4cb325;
  }
}
.page-customer-details {
  position: relative;
  .upload-tag {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff0000;
    line-height: 32px;
  }
  .com-tabs {
    .ant-tabs-bar {
      margin: 0;
    }
    .ant-tabs-nav-container {
      margin: 0;
      .ant-tabs-ink-bar {
        display: none !important;
      }
      .ant-tabs-tab {
        position: relative;
        margin: 0;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8d8d8e;
        line-height: 22px;
        padding: 14px 24px;
        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 18px;
          background: #b9bfc5;
          position: absolute;
          top: 50%;
          left: 1px;
          margin-top: -9px;
        }
        &:first-of-type::after {
          display: none;
        }
      }
      .ant-tabs-tab-active {
        color: #ffffff !important;
        background: #4262baff !important;
        &::after {
          display: none;
        }
      }
      .ant-tabs-tab-active + .ant-tabs-tab {
        &::after {
          display: none;
        }
      }
    }
    .ant-tabs-content {
      padding: 0 0 100px;
      min-height: 500px;
    }
  }
  .my-descriptions-form {
    margin: 0 24px;
    border-bottom: 1px solid #e5e5e5;
    border-left: 1px solid #e5e5e5;
    .ant-form-item {
      width: 100%;
      height: 50px;
      margin-bottom: 0;
      border-top: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      .ant-form-item-label {
        display: inline-block;
        height: 50px;
        line-height: 50px;
        width: 200px;
        padding: 0 16px;
        background: #f5f7fa;
        white-space: pre-line;
        label {
          display: inline-block;
          font-size: 14px;
          width: 100%;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #7d7d7d;
          line-height: 25px;
          word-break: break-all;
          word-wrap: break-word;
        }
      }
      .ant-form-item-control-wrapper {
        display: inline-block;
        width: calc(100% - 202px);
        height: 50px;
        line-height: 50px;
        font-family: PingFangSC-Regular, PingFang SC;
        vertical-align: middle;
        padding: 0 16px;
        .ant-form-item-control {
          height: 50px;
          line-height: 50px;
        }
        input {
          width: 100%;
          background: #ffffff !important;
          border: none;
          cursor: pointer;
          color: #7d7d7d;
        }
        .ant-calendar-picker {
          width: 100%;
          background: #ffffff !important;
          border: none;
          cursor: pointer;
          color: #7d7d7d;
        }
        .ant-select-selection {
          width: 100%;
          background: #ffffff !important;
          border: none;
          cursor: pointer;
          color: #7d7d7d;
        }
        input[disabled] {
          cursor: not-allowed;
        }
      }
    }
    .field-ative {
      input,
      .ant-select-selection-selected-value,
      .ant-radio-group .ant-radio-wrapper span {
        color: #ff3c1f !important;
      }
    }
    .my-form-item {
      .ant-form-item-label {
        width: 300px;
      }
      .ant-form-item-control-wrapper {
        width: calc(100% - 302px);
      }
    }
  }
  .my-descriptions-card {
    padding: 0 24px;
    .ant-descriptions-item-label {
      width: 200px;
      min-width: 200px;
      max-width: 200px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #7d7d7d;
      line-height: 22px;
    }
    .ant-descriptions-item-content {
      padding: 0 16px;
      vertical-align: middle;
      input {
        background: #ffffff !important;
        border: none;
        padding: 0 5px;
        cursor: pointer;
        color: #7d7d7d;
      }
      input[disabled] {
        cursor: not-allowed;
      }
    }
  }
  .footer-descriptions {
    padding: 32px;
  }
}
</style>