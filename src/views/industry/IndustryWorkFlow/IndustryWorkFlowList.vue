<template>
  <a-card :bordered="false"
          class="IndustryWorkFlowList"
          v-loading="exportLoading"
          :element-loading-text="exportType === '1'?'拼命导入中...':'拼命导出中...'"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="工作流名称">
              <a-input placeholder="请输入工作流名称"
                       v-model="queryParam.name"
                       :maxLength='12'></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="产品型号">

              <a-select v-model="queryParam.productNo"
                        placeholder="请选择产品型号">
                <a-select-option v-for="val in productNoList"
                                 :key="val.productNo">
                  {{ val.productNo }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

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
              <!-- <a @click="handleToggleSearch"
                 style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
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
      <a-button type="primary"
                icon="download"
                @click="handleExportXls_flow">导出</a-button>
      <a-upload name="file"
                :showUploadList="false"
                :multiple="false"
                :headers="tokenHeader"
                :action="importExcelUrl"
                accept=".xls,.xlsx"
                :show-file-list="false"
                @change="handleImportExcel">

        <a-button type="primary"
                  ref="fileRefs"
                  icon="import"
                  style="display:none">导入</a-button>
      </a-upload>

      <a-button type="primary"
                @click="upLoadFile"
                icon="import"
                ref="importFile">导入</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <!-- <a-menu-item key="2"
                       @click="batchPublic">
            <a-icon type="delete" />发布
          </a-menu-item> -->

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

          <a @click="handlePublic(record)">发布</a>
          <a-divider type="vertical" />

          <a-popconfirm title="确定删除吗?"
                        @confirm="() => handleDelete_(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>

                <a @click="handlePublic(record)">发布</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?"
                              @confirm="() => handleDelete_(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>

          </a-dropdown> -->
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
    <industryWorkFlow-modal ref="modalForm"
                            :productNoList='productNoList'
                            @ok="modalFormOk"></industryWorkFlow-modal>

    <!-- 表单区域 -->
    <industryWorkOrder-modal ref="IndustryWorkOrderModal"
                             :Appointors='Appointors'
                             :workFlowNodes='workFlowNodes'
                             @ok="modalFormOk"></industryWorkOrder-modal>

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustryWorkFlowModal from './modules/IndustryWorkFlowModal'
import IndustryWorkOrderModal from './modules/publicWorkOrderModel'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { lc_getGrobalProductType, lc_getAppointors } from '@/api/lc_api'
import { getAction } from '@/api/manage'
import { MessageBox } from 'element-ui'
export default {
  name: 'IndustryWorkFlowList',
  mixins: [JeecgListMixin],
  components: {
    IndustryWorkFlowModal,
    IndustryWorkOrderModal,
  },

  data() {
    return {
      exportType: '',
      pageType: 'workFlowList',
      workFlowNodes: {}, //点击单条发布 row 数据
      exportLoading: false,
      productNoList: [], //产品型号数据
      Appointors: [], //指定人数据
      activeUserInfo: {}, //选中的user
      activePublicWorkFlow: {}, //当前发布的工单
      formData: {
        workFlowNodes: [],
        userId: '',
      },
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
          title: '产品型号',
          align: 'center',
          dataIndex: 'productNo',
          // customRender: function (t, r, index) {
          //   return t === '1' ? '中德热水器' : '其他'
          // },
        },
        {
          title: '工作流名称',
          align: 'center',
          dataIndex: 'name',
          ellipsis: true,
        },
        // {
        //   title: '类型',
        //   align: 'center',
        //   dataIndex: 'type',
        // },

        {
          title: '描述',
          align: 'center',
          dataIndex: 'describes',
          ellipsis: true,
        },

        {
          title: '上传人员',
          align: 'center',
          dataIndex: 'userName',
          ellipsis: true,
        },

        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/industry/industryWorkFlow/list',
        delete: '/industry/industryWorkFlow/delete',
        deleteBatch: '/industry/industryWorkFlow/deleteBatch',
        exportXlsUrl: 'industry/industryWorkFlow/exportXls',
        importExcelUrl: 'industry/industryWorkFlow/importExcel',
      },
    }
  },

  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },

  created() {
    this.getGrobalProductType()
  },

  methods: {
    upLoadFile() {
      let that = this
      MessageBox.confirm('导入文件检验项目和标准部分字数限制100以内!超出部分可能影响正常显示', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$refs.fileRefs.$el.click()
        })
        .catch((error) => {})
    },
    // 获取userName
    handleChangeUserName(val) {
      this.activeUserInfo = this.Appointors.find((v) => {
        return v.id === val
      })
      // console.log(this.userName)
    },

    // 获取指定人
    async getAppointors(id) {
      const res = await lc_getAppointors(id)
      this.Appointors = res.result
    },

    // 获取产品型号数据
    async getGrobalProductType() {
      const res = await lc_getGrobalProductType()
      this.productNoList = res.result
    },

    handleDelete_: function (id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性!')
        return
      }
      var that = this

      getAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    // 单条发布工单
    handlePublic(record) {
      // console.log(record)
      this.workFlowNodes = record
      this.activePublicWorkFlow = record
      this.$refs.IndustryWorkOrderModal.publicWorkOrderModelDialog = true
      // this.$refs.IndustryWorkOrderModal.confirmLoading = true
      this.getAppointors()
    },

    // 批量发布工单
    batchPublic() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            // that.loading = true
            //     deleteAction(that.url.deleteBatch, { ids: ids })
            //       .then((res) => {
            //         if (res.success) {
            //           that.$message.success(res.message)
            //           that.loadData()
            //           that.onClearSelected()
            //         } else {
            //           that.$message.warning(res.message)
            //         }
            //       })
            //       .finally(() => {
            //         that.loading = false
            //       })
            that.$message.success('发布工单成功')
          },
        })
      }
    },

    // 上传文件之前
    beforeUpload(file) {
      let reg = /^.*\.(?:xls|xlsx)$/i //文件名可以带空格

      if (!reg.test(file.name)) {
        //校验不通过
        this.$message.error('请上传excel格式的文件!')
        return
      }
      // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      // if (!isJpgOrPng) {
      //   this.$message.error('You can only upload JPG file!');
      // }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   this.$message.error('Image must smaller than 2MB!');
      // }
      // return isJpgOrPng && isLt2M;
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.el-select {
  width: 100%;
}
</style>

<style>
.el-dialog__header {
  background-color: #eeeef0 !important;
}

/* .el-dialog {
  max-width: 800px;
} */

.dialog__body {
  padding: 30px 60px;
}

.el-dialog__footer {
  border-top: 1px solid #e8e8e8;
  padding: 10px 20px;
  text-align: center;
}
</style>