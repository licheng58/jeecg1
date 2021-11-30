<template>
  <a-card :bordered="false">
    <!-- 工单管理 -->
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称"
                       v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="状态">
              <!-- <a-input placeholder="请输入状态"
                       v-model="queryParam.status"></a-input> -->
              <a-select v-model="queryParam.status"
                        placeholder="请选择状态">
                <a-select-option :value="0">
                  暂未开始
                </a-select-option>
                <a-select-option :value="1">
                  正在进行
                </a-select-option>
                <a-select-option :value="2">
                  已完成
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工作流id">
              <a-input placeholder="请输入工作流id" v-model="queryParam.workFlowId"></a-input>
            </a-form-item>
          </a-col> -->
            <!-- <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工作流name">
              <a-input placeholder="请输入工作流name" v-model="queryParam.workFlowName"></a-input>
            </a-form-item>
          </a-col> -->
            <!-- <a-col :xl="6"
                   :lg="7"
                   :md="8"
                   :sm="24">
              <a-form-item label="部门">
                <a-input placeholder="请输入指定部门id"
                         v-model="queryParam.deptId"></a-input>
              </a-form-item>
            </a-col> -->
          </template>

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="primary"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch"
                 style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd"
                type="primary"
                icon="plus">发布</a-button>
      <a-button type="primary"
                icon="download"
                @click="handleExportXls('任务工单')">导出</a-button>
      <!-- <a-upload name="file"
                :showUploadList="false"
                :multiple="false"
                :headers="tokenHeader"
                :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary"
                  icon="import">导入</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"
                       @click="batchDel">
            <a-icon type="delete" />删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info"
           style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px"
           @click="onClearSelected">清空</a>
      </div>

      <a-table ref="table"
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               class="j-table-force-nowrap"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleTableChange">

        <span slot="action"
              slot-scope="text, record">
          <span slot="ifeffectSlot"
                slot-scope="text, record"
                :class="`tag-effect effect${record.ifeffect}`">
            {{ record.ifeffect === null ? '—' : record.ifeffect === 0 ? '失效' : '生效' }}
          </span>
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?"
                              @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <industryWorkOrder-modal ref="modalForm"
                             :WorkFlows='WorkFlows'
                             :Appointors='Appointors'
                             @ok="modalFormOk"></industryWorkOrder-modal>

    <!-- 工作流详情 -->

    <!-- <el-dialog title='SOP工作流进度条'
               :visible.sync="workFlowDetail_dialog"
               append-to-body
               ref="workFlowDetail_dialog"> -->

    <j-modal title='SOP工作流进度条'
             :width="800"
             :visible="workFlowDetail_dialog"
             :confirmLoading="confirmLoading"
             fullscreen
             @ok="handleOk"
             @cancel="()=>close()"
             cancelText="关闭">
      <a-spin :spinning="confirmLoading">

        <div style="padding:10px 30px">
          <!-- <a-steps :current="1">

            <a-popover title="item.name"
                       v-for="item in workFlowDetail_data.workOrderNodes"
                       :key="item.id">
              <template slot="content">
                <p>Content</p>
                <p>Content</p>
              </template>
              <a-step>
                <template slot="title">
                  {{item.name}}
                </template>
                <span slot="description">This is a description.</span>
              </a-step>
            </a-popover>

          </a-steps> -->

          <a-steps :current="1">
            <a-popover slot="progressDot"
                       slot-scope="{ index, status,prefixCls }">
              <template slot="content">
                <span>step {{ index }} status: {{ status }}</span>
              </template>
              <span :class="`${prefixCls}-icon-dot`" />
            </a-popover>

            <a-step :title="item.name"
                    v-for="item in workFlowDetail_data.workOrderNodes"
                    :key="item.id">
              <template slot="title">
                {{item.name}}
              </template>
              <!-- <span slot="description">This is a description.</span> -->
            </a-step>
          </a-steps>
        </div>

      </a-spin>
    </j-modal>
    <!-- </el-dialog> -->
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustryWorkOrderModal from './modules/IndustryWorkOrderModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { lc_getWorkFlows, lc_getAppointors, lc_getWorkFlowDetails } from '@/api/lc_api'

export default {
  name: 'IndustryWorkOrderList',
  mixins: [JeecgListMixin],
  components: {
    IndustryWorkOrderModal,
  },
  data() {
    return {
      description: '任务工单管理页面',
      WorkFlows: [], //工作流数据
      Appointors: [], //指定人数据
      workFlowDetail_dialog: false, //工作流详情弹框
      confirmLoading: false,
      workFlowDetail_data: {}, //工作流详情数据
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function (t, r, index) {
            return t === 0 ? '暂未开始' : t === 1 ? '正在进行' : '已完成'
          },
        },
        // {
        //   title: '工作流id',
        //   align: 'center',
        //   dataIndex: 'workFlowId',
        // },
        // {
        //   title: '工作流name',
        //   align: 'center',
        //   dataIndex: 'workFlowName',
        // },
        // {
        //   title: '指定部门id',
        //   align: 'center',
        //   dataIndex: 'deptId',
        // },
        {
          title: '部门',
          align: 'center',
          dataIndex: 'deptName',
        },
        // {
        //   title: '开始时间',
        //   align: 'center',
        //   dataIndex: 'startTime',
        // },
        // {
        //   title: '结束时间',
        //   align: 'center',
        //   dataIndex: 'endTime',
        // },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remake',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],

      url: {
        list: '/industry/industryWorkOrder/list',
        delete: '/industry/industryWorkOrder/delete',
        deleteBatch: '/industry/industryWorkOrder/deleteBatch',
        exportXlsUrl: 'industry/industryWorkOrder/exportXls',
        importExcelUrl: 'industry/industryWorkOrder/importExcel',
      },
    }
  },

  created() {
    this.getWorkFlows()
    this.getAppointors()
    // this.getWorkFlowDetails()
  },

  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    // 获取工作流信息
    async getWorkFlows() {
      const res = await lc_getWorkFlows()
      this.WorkFlows = res.result
    },

    // 获取指定人
    async getAppointors() {
      const res = await lc_getAppointors()

      this.Appointors = res.result
    },

    // 获取工作流进度条详情信息
    async getWorkFlowDetails(id) {
      const res = await lc_getWorkFlowDetails(id)
      this.workFlowDetail_data = res.result
    },

    // 查看详情
    handleDetail(record) {
      // console.log(record)
      this.getWorkFlowDetails(record.id)
      this.workFlowDetail_dialog = true
      this.confirmLoading = false
    },

    close() {
      this.$emit('close')
      this.workFlowDetail_dialog = false
    },

    handleOk() {
      this.$emit('close')
      this.workFlowDetail_dialog = false
      this.confirmLoading = true
    },
  },
}
</script>


<style scoped>
@import '~@assets/less/common.less';
</style>

<style lang="less" scoped>
.table-page-search-wrapper {
}
</style>