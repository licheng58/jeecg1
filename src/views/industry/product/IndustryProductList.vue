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
            <a-form-item label="产品类别">
              <a-input placeholder="请输入产品类别"
                       v-model="queryParam.productType"></a-input>
              <!-- <a-select v-model="queryParam.productType"
                        placeholder="请选择产品类别">
                <a-select-option value="1">
                  中德热水器
                </a-select-option>
                <a-select-option value="2">
                  其他
                </a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <!-- <a-col :xl="6"
                   :lg="7"
                   :md="8"
                   :sm="24">
              <a-form-item label="部门ID">
                <a-input placeholder="请输入部门ID"
                         v-model="queryParam.deptId"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6"
                   :lg="7"
                   :md="8"
                   :sm="24">
              <a-form-item label="部门姓名">
                <a-input placeholder="请输入部门姓名"
                         v-model="queryParam.deptName"></a-input>
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
      <!-- <a-button type="primary"
                icon="download"
                @click="handleExportXls('产品型号')">导出</a-button>
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
    <industryProduct-modal ref="modalForm"
                           :productNoList='productNoList'
                           @ok="modalFormOk"></industryProduct-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustryProductModal from './modules/IndustryProductModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { lc_getGrobalProductType } from '@/api/lc_api'
export default {
  name: 'IndustryProductList',
  mixins: [JeecgListMixin],
  components: {
    IndustryProductModal,
  },
  data() {
    return {
      description: '产品型号管理页面',
      productNoList: [], //产品型号数据
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
          ellipsis: true,
        },
        {
          title: '产品类别',
          align: 'center',
          dataIndex: 'productType',
          ellipsis: true,
        },
        // {
        //   title: '部门ID',
        //   align: 'center',
        //   dataIndex: 'deptId',
        // },
        {
          title: '部门姓名',
          align: 'center',
          dataIndex: 'deptName',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/industry/industryProduct/list',
        delete: '/industry/industryProduct/delete',
        deleteBatch: '/industry/industryProduct/deleteBatch',
        exportXlsUrl: 'industry/industryProduct/exportXls',
        importExcelUrl: 'industry/industryProduct/importExcel',
      },
    }
  },

  created() {
    this.getGrobalProductType()
  },

  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },

  methods: {
    // 获取产品型号数据
    async getGrobalProductType() {
      const res = await lc_getGrobalProductType()
      this.productNoList = res.result
      console.log(this.productNoList)
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>