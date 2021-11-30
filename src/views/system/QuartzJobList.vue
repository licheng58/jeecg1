<template>
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
        <PageTitle title="定时任务">
          <a-button @click="handleAdd" type="primary" icon="plus">新 增</a-button>
        </PageTitle>
      </template>
      <template slot="sHeader">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="任务类名">
                  <a-input placeholder="请输入任务类名" v-model="queryParam.jobClassName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="任务状态">
                  <a-select style="width: 220px" v-model="queryParam.status" placeholder="请选择状态">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">正常</a-select-option>
                    <a-select-option value="-1">停止</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-button type="primary" @click="searchQuery">查询</a-button>
                <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
      <span slot="description" slot-scope="text">
        <j-ellipsis :value="text" :length="15" />
      </span>
      <span slot="parameterRender" slot-scope="text">
        <j-ellipsis :value="text" :length="20" />
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="resumeJob(record)" v-if="record.status == -1">启动</a>
        <a @click="pauseJob(record)" v-if="record.status == 0">停止</a>

        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
          <a-menu slot="overlay">
            <a-menu-item><a @click="executeImmediately(record)">立即执行</a></a-menu-item>
            <a-menu-item><a @click="handleEdit(record)">编辑</a></a-menu-item>
            <a-menu-item>
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>

      <template slot="customRenderStatus" slot-scope="status">
        <a-tag v-if="status == 0" color="green">已启动</a-tag>
        <a-tag v-if="status == -1" color="orange">已暂停</a-tag>
      </template>
    </StandardTable>
    <quartzJob-modal ref="modalForm" @ok="modalFormOk"></quartzJob-modal>
  </a-card>
  <!--   
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="10">
            <a-form-item label="任务类名">
              <a-input placeholder="请输入任务类名" v-model="queryParam.jobClassName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item label="任务状态">
              <a-select style="width: 220px" v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="-1">停止</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="10">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </div>

    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>
        <span slot="parameterRender" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="resumeJob(record)" v-if="record.status == -1">启动</a>
          <a @click="pauseJob(record)" v-if="record.status == 0">停止</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item><a @click="executeImmediately(record)">立即执行</a></a-menu-item>
              <a-menu-item><a @click="handleEdit(record)">编辑</a></a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <template slot="customRenderStatus" slot-scope="status">
          <a-tag v-if="status == 0" color="green">已启动</a-tag>
          <a-tag v-if="status == -1" color="orange">已暂停</a-tag>
        </template>
      </a-table>
    </div>

    <quartzJob-modal ref="modalForm" @ok="modalFormOk"></quartzJob-modal>
  </a-card> -->
</template>

<script>
import QuartzJobModal from './modules/QuartzJobModal'
import { getAction } from '@/api/manage'
import { tableListMixin } from '@/mixins/tableListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'

export default {
  name: 'QuartzJobList',
  mixins: [tableListMixin],
  components: {
    QuartzJobModal,
    JEllipsis,
  },
  data() {
    return {
      description: '定时任务在线管理',
      // 查询条件
      queryParam: {},
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
          title: '任务类名',
          align: 'center',
          dataIndex: 'jobClassName',
          sorter: true,
        },
        {
          title: 'cron表达式',
          align: 'center',
          dataIndex: 'cronExpression',
        },
        {
          title: '参数',
          align: 'center',
          width: 150,
          dataIndex: 'parameter',
          scopedSlots: { customRender: 'parameterRender' },
        },
        {
          title: '描述',
          align: 'center',
          width: 250,
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' },
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'customRenderStatus' },
          filterMultiple: false,
          filters: [
            { text: '已启动', value: '0' },
            { text: '已暂停', value: '-1' },
          ],
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 180,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/sys/quartzJob/list',
        delete: '/sys/quartzJob/delete',
        deleteBatch: '/sys/quartzJob/deleteBatch',
        pause: '/sys/quartzJob/pause',
        resume: '/sys/quartzJob/resume',
        exportXlsUrl: 'sys/quartzJob/exportXls',
        importExcelUrl: 'sys/quartzJob/importExcel',
        execute: 'sys/quartzJob/execute',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },

  methods: {
    //筛选需要重写handleTableChange
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      //这种筛选方式只支持单选
      this.filters.status = filters.status[0]
      this.ipagination = pagination
      that.$refs.MyTable.reload()
    },
    pauseJob: function (record) {
      var that = this
      //暂停定时任务
      this.$confirm({
        title: '确认暂停',
        content: '是否暂停选中任务?',
        onOk: function () {
          getAction(that.url.pause, { jobClassName: record.jobClassName }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$refs.MyTable.reload()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    resumeJob: function (record) {
      var that = this
      //恢复定时任务
      this.$confirm({
        title: '确认启动',
        content: '是否启动选中任务?',
        onOk: function () {
          getAction(that.url.resume, { jobClassName: record.jobClassName }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$refs.MyTable.reload()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
    executeImmediately(record) {
      var that = this
      //立即执行定时任务
      this.$confirm({
        title: '确认提示',
        content: '是否立即执行任务?',
        onOk: function () {
          getAction(that.url.execute, { id: record.id }).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.$refs.MyTable.reload()
            } else {
              that.$message.warning(res.message)
            }
          })
        },
      })
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>