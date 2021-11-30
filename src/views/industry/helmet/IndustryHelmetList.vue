<template>
  <a-card :bordered="false" class="IndustryHelmetList">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="设备序列号">
              <a-input placeholder="请输入设备序列号" v-model="queryParam.serialNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="设备名称">
              <a-input placeholder="请输入设备名称" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="头盔状态">
                <a-select v-model="queryParam.activeStatus" placeholder="请选择头盔状态">
                  <a-select-option :value="1">
                    在线
                  </a-select-option>
                  <a-select-option :value="0">
                    离线
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="部门名称">
                <a-input placeholder="请输入部门名称" v-model="queryParam.deptName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="设 备 类 型">
                <a-select v-model="queryParam.type" placeholder="请选择设备类型">
                  <a-select-option v-for="(item, index) in DEVIVE_TYPES" :key="index" :value="item.value">
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"> <a-icon type="delete" />删除 </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="activeStatus" slot-scope="text, record">
          <span class="table-activeStatus" :style="{ background: activeStatusBgc(record) }">{{
            record.activeStatus === 0 ? '离线' : record.activeStatus === 1 ? '在线' : ''
          }}</span>
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="bandUser(record)">绑定用户</a>

          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="selectedRowKeys.length > 0">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <industryHelmet-modal ref="modalForm" @ok="modalFormOk"></industryHelmet-modal>

    <!-- 绑定用户 -->
    <bindUserModel ref="bindUserModel" :tableData="tableData" :recordInfo="recordInfo" @loadData="loadData">
    </bindUserModel>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustryHelmetModal from './modules/IndustryHelmetModal'
import bindUserModel from './modules/bindUserModel.vue'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { lc_getindustryHelmetUser } from '@/api/lc_api'
import { getAction } from '@/api/manage'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'IndustryHelmetList',
  mixins: [JeecgListMixin],
  components: {
    IndustryHelmetModal,
    bindUserModel
  },
  data() {
    return {
      remoteVisible: false,
      tableData: [], //弹框table
      recordInfo: {}, //点击row的数据
      description: '设备信息管理页面',
      disableMixinCreated: false,
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '设备序列号',
          align: 'center',
          dataIndex: 'serialNo',
          ellipsis: true
        },
        {
          title: '设备名称',
          align: 'center',
          dataIndex: 'name'
        },

        {
          title: '部门名称',
          align: 'center',
          dataIndex: 'deptName'
        },
        {
          title: '设备类型 ', //1：	JX-TKA01 2：JX-X20 3: 眼镜
          align: 'center',
          dataIndex: 'type'
          // customRender: function (t, r, index) {
          //   return r === 1 ? 'JX-TKA01' : r === 2 ? 'JX-X20' : '眼镜'
          // },
        },
        {
          title: '设备状态 ',
          align: 'center',
          dataIndex: 'activeStatus',
          scopedSlots: { customRender: 'activeStatus' },
          customRender: function(t, r, index) {
            return t === 0 ? '离线' : t === 1 ? '在线' : ''
          }
        },
        {
          title: '绑定用户',
          align: 'center',
          dataIndex: 'realname',
          ellipsis: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/industry/industryHelmet/list',
        delete: '/industry/industryHelmet/delete',
        deleteBatch: '/industry/industryHelmet/deleteBatch',
        exportXlsUrl: 'industry/industryHelmet/exportXls',
        importExcelUrl: 'industry/industryHelmet/importExcel'
      }
    }
  },

  computed: {
    ...mapState(['DEVIVE_TYPES']),
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },

    activeStatusBgc(val) {
      return val => {
        switch (val.activeStatus) {
          case 0:
            return '#cbcbcb'
          case 1:
            return '#57ad12'
          default:
            ''
        }
      }
    }
  },

  created() {
    this.loadData()
    // 获取设备类型
    this.getDeviceTypes()
  },

  methods: {
    ...mapActions(['getDeviceTypes']),
    // 获取设备类型数据
    async getProTypes() {
      const res = await lc_getProTypes()
      console.log(res)
    },

    loadData(arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      getAction(this.url.list, params).then(res => {
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

    bandUser(record) {
      this.$refs.bindUserModel.visible = true
      let helmetId = record.id
      this.recordInfo = record
      this.getUserInfo(helmetId)
    },

    // 获取绑定用户功能 - 用户数据
    async getUserInfo(helmetId) {
      this.$refs.bindUserModel.templateRadio = ''
      this.tableData = []
      const res = await lc_getindustryHelmetUser(helmetId)
      this.tableData = res.result

      let selectData = this.tableData.filter(v => {
        return v.status === 1
      })
      this.$refs.bindUserModel.templateRadio = selectData[0].id
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.table-activeStatus {
  padding: 2px 8px;
  border-radius: 3px;
  color: #fff;
}
</style>

<style>
.IndustryHelmetList .table-page-search-wrapper .ant-form-inline .ant-form-item > .ant-form-item-label {
  width: 100px;
}
</style>
