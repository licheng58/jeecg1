<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="菊风云code">
              <a-input placeholder="请输入菊风云code"
                       v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="用户账号">
              <a-input placeholder="请输入用户账号"
                       v-model="queryParam.userAcount"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="设备名称">
              <a-input placeholder="请输入设备名称"
                       v-model="queryParam.helmetName"></a-input>
            </a-form-item>
          </a-col>
          <!--   <template v-if="toggleSearchStatus">
            <a-col :xl="6"
                   :lg="7"
                   :md="8"
                   :sm="24">
              <a-form-item label="用户密码">
                <a-input placeholder="请输入用户密码"
                         v-model="queryParam.passWord"></a-input>
              </a-form-item>
            </a-col> -->
          <!-- <a-col :xl="6"
                   :lg="7"
                   :md="8"
                   :sm="24">
              <a-form-item label="设备id">
                <a-input placeholder="请输入设备id"
                         v-model="queryParam.helmetId"></a-input>
              </a-form-item>
            </a-col>

          </template> -->
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
              <!--  <a @click="handleToggleSearch"
                 style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>-->
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd"
                type="primary"
                icon="plus">新增</a-button>
      <!-- <a-button type="primary"
                icon="download"
                @click="handleExportXls('设备远程协作账号')">导出</a-button>
      <a-upload name="file"
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

      <a-table ref="table"
               size="middle"
               bordered
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />

          <a @click="handleBind(record)">绑定设备</a>

          <!-- <a-divider type="vertical" />

          <a @click="unHandleBind(record)">解绑</a> -->

          <a-divider type="vertical" />

          <a-popconfirm title="确定删除吗?"
                        @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

        </span>

      </a-table>
      <div class="ant-alert ant-alert-info"
           style="margin-bottom: 16px;"
           v-if="selectedRowKeys.length > 0">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px"
           @click="onClearSelected">清空</a>
      </div>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <helmetYcxz-modal ref="modalForm"
                      @ok="modalFormOk"></helmetYcxz-modal>

    <!-- 绑定用户 -->
    <bindDiviceModel ref="bindDiviceModel"
                     :tableData='tableData'
                     :recordInfo='recordInfo'
                     :total='total'
                     @loadData='loadData'
                     @getDiviceInfo='getDiviceInfo'> </bindDiviceModel>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import HelmetYcxzModal from './modules/HelmetYcxzModal'
import bindDiviceModel from './modules/bindDivice.vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { lc_getDiviceInfo } from '@/api/lc_api'
import { getAction } from '@/api/manage'
export default {
  name: 'HelmetYcxzList',
  mixins: [JeecgListMixin],
  components: {
    HelmetYcxzModal,
    bindDiviceModel,
  },
  data() {
    return {
      description: '设备远程协作账号管理页面',
      tableData: [], //弹框table
      recordInfo: {}, //点击row的数据
      total: 0,
      disableMixinCreated: false,
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
          title: '菊风云code',
          align: 'center',
          dataIndex: 'code',
        },
        {
          title: '用户账号',
          align: 'center',
          dataIndex: 'userAcount',
        },
        //  {
        //       title: '用户密码',
        //       align:"center",
        //       dataIndex: 'passWord'
        //      },
        //  {
        //       title: '设备id',
        //       align:"center",
        //       dataIndex: 'helmetId'
        //      },
        {
          title: '绑定用户',
          align: 'center',
          dataIndex: 'userName',
        },
        {
          title: '设备部门',
          align: 'center',
          dataIndex: 'userDept',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/industry/helmetYcxz/list',
        delete: '/industry/helmetYcxz/delete',
        deleteBatch: '/industry/helmetYcxz/deleteBatch',
        exportXlsUrl: 'industry/helmetYcxz/exportXls',
        importExcelUrl: 'industry/helmetYcxz/importExcel',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    loadData(arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    // 绑定设备
    handleBind(record) {
      this.$refs.bindDiviceModel.visible = true
      this.$refs.bindDiviceModel.pageNo = 1
      let helmetId = record.id
      this.recordInfo = record
      this.getDiviceInfo(helmetId)
    },

    // 获取设备信息userId  departIds
    async getDiviceInfo() {
      this.$refs.bindDiviceModel.templateRadio = ''
      this.tableData = []
      let pageNo = this.$refs.bindDiviceModel.pageNo
      const res = await lc_getDiviceInfo(pageNo)
      this.tableData = res.result.records
      this.total = res.result.total
      // console.log(this.recordInfo)
      // console.log(this.tableData)
      let selectData = this.tableData.filter((v) => {
        return v.id === this.recordInfo.userId
      })
      // console.log(selectData)
      if (selectData.length > 0) {
        this.$refs.bindDiviceModel.templateRadio = selectData[0].id
      }
    },

    // 解绑
    // unHandleBind(record) {},
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>