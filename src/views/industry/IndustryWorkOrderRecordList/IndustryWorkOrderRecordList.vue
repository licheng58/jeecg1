<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="工单名称">
              <a-input placeholder="请输入工单名称" v-model="queryParam.orderName"></a-input>
            </a-form-item>
          </a-col>
          <template>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="节点名称">
                <a-input placeholder="请输入节点名称" v-model="queryParam.nodeName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="工单状态">
                <a-select v-model="queryParam.status" placeholder="请选择工单状态">
                  <a-select-option :value="0"> 暂未开始 </a-select-option>
                  <a-select-option :value="1"> 正在进行 </a-select-option>
                  <a-select-option :value="2"> 已完成 </a-select-option>
                  <a-select-option :value="3"> 异常 </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('工单记录')">导出</a-button>
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

    <!-- table区域-->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <template slot="imgSlot1" slot-scope="text, record, index">
          <div style="display:flex" v-if="text && text !== null" class="imgStyle">
            <!-- 前2张图片 -->
            <div
              v-for="(item, index) in text.split(',').slice(0, 2)"
              :key="index"
              style="position: relative;margin:0 10px"
            >
              <!-- 图片视频 -->
              <ImgStyle :item="item" v-if="item" />
              <div class="number" v-if="item">{{ index + 1 }}</div>
            </div>

            <!-- 更多图片 -->
            <div v-show="record.isMoreShow">
              <div
                v-for="(item, index) in text.split(',').slice(2)"
                :key="item.id"
                style="position: relative;margin:0 10px"
              >
                <!-- 图片视频 -->
                <ImgStyle :item="item" v-if="item" />
                <div class="number" v-if="item">{{ index + 3 }}</div>
              </div>
            </div>
            <i
              class="iconfont"
              :class="record.isMoreShow === false ? 'icon-gengduo1' : 'icon-sanjiaoleft'"
              :title="record.isMoreShow === false ? '展开' : '隐藏'"
              @click="grtMore(record)"
              v-if="text.split(',').length > 2"
            ></i>
          </div>
        </template>

        <template slot="imgSlot" slot-scope="text, record">
          <div style="display:flex" v-if="text && text !== null" class="imgStyle">
            <!-- 前2张图片 -->
            <div
              v-for="(item, index) in text.split(',').slice(0, 2)"
              :key="item.id"
              style="position: relative;margin:0 10px"
            >
              <!-- 图片视频 -->
              <ImgStyle :item="item" />
              <div class="number">{{ index + 1 }}</div>
            </div>

            <!-- 更多图片 -->
            <div v-show="record.isMoreShow2">
              <div
                v-for="(item, index) in text.split(',').slice(2)"
                :key="item.id"
                style="position: relative;margin:0 10px"
              >
                <!-- 图片视频 -->
                <ImgStyle :item="item" />
                <div class="number">{{ index + 3 }}</div>
              </div>
            </div>
            <i
              class="iconfont"
              :class="record.isMoreShow2 === false ? 'icon-gengduo1' : 'icon-sanjiaoleft'"
              :title="record.isMoreShow2 === false ? '展开' : '隐藏'"
              @click="grtMore2(record)"
              v-if="text.split(',').length > 2"
            ></i>
          </div>
        </template>

        <template slot="action" slot-scope="text, record">
          <a @click="openHistory(record)">工单记录</a>
        </template>
      </a-table>

      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-if="selectedRowKeys.length > 0">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
    </div>

    <!-- 表单区域 -->
    <industryWorkOrderRecord-modal ref="modalForm" @ok="modalFormOk"></industryWorkOrderRecord-modal>

    <!-- 历史记录 -->
    <myModel :visible="visible" :title="title" :footer="null" @closeDialog="closeDialog">
      <a-table
        size="middle"
        bordered
        rowKey="id"
        :columns="columns2"
        :dataSource="dataSource2"
        :loading="loading"
        :pagination="false"
      >
        <template slot="imgSlot1" slot-scope="text, record, index">
          <div style="display:flex" v-if="text && text !== null" class="imgStyle">
            <!-- 前2张图片 -->
            <div
              v-for="(item, index) in text.split(',').slice(0, 2)"
              :key="index"
              style="position: relative;margin:0 10px"
            >
              <!-- 图片视频 -->
              <ImgStyle :item="item" v-if="item" />
              <div class="number" v-if="item">{{ index + 1 }}</div>
            </div>

            <!-- 更多图片 -->
            <div v-show="record.isMoreShow">
              <div
                v-for="(item, index) in text.split(',').slice(2)"
                :key="item.id"
                style="position: relative;margin:0 10px"
              >
                <!-- 图片视频 -->
                <ImgStyle :item="item" v-if="item" />
                <div class="number" v-if="item">{{ index + 3 }}</div>
              </div>
            </div>
            <i
              class="iconfont"
              :class="record.isMoreShow === false ? 'icon-gengduo1' : 'icon-sanjiaoleft'"
              :title="record.isMoreShow === false ? '展开' : '隐藏'"
              @click="grtMore3(record)"
              v-if="text.split(',').length > 2"
            ></i>
          </div>
        </template>

        <template slot="imgSlot" slot-scope="text, record">
          <div style="display:flex" v-if="text && text !== null" class="imgStyle">
            <!-- 前2张图片 -->
            <div
              v-for="(item, index) in text.split(',').slice(0, 2)"
              :key="item.id"
              style="position: relative;margin:0 10px"
            >
              <!-- 图片视频 -->
              <ImgStyle :item="item" />
              <div class="number">{{ index + 1 }}</div>
            </div>

            <!-- 更多图片 -->
            <div v-show="record.isMoreShow2">
              <div
                v-for="(item, index) in text.split(',').slice(2)"
                :key="item.id"
                style="position: relative;margin:0 10px"
              >
                <!-- 图片视频 -->
                <ImgStyle :item="item" />
                <div class="number">{{ index + 3 }}</div>
              </div>
            </div>
            <i
              class="iconfont"
              :class="record.isMoreShow2 === false ? 'icon-gengduo1' : 'icon-sanjiaoleft'"
              :title="record.isMoreShow2 === false ? '展开' : '隐藏'"
              @click="grtMore4(record)"
              v-if="text.split(',').length > 2"
            ></i>
          </div>
        </template>
      </a-table>
    </myModel>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustryWorkOrderRecordModal from './modules/IndustryWorkOrderRecordModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import myModel from '@/components/lc_commponents/myModel.vue'
import ImgStyle from './common/ImgStyle.vue'
import { lc_getHistoryDetail } from '@/api/lc_api'

const columns2 = [
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
    title: '工单名称',
    align: 'center',
    dataIndex: 'orderName'
  },
  {
    title: '节点名称',
    align: 'center',
    dataIndex: 'nodeName'
  },
  {
    title: '工单状态',
    align: 'center',
    dataIndex: 'status',
    customRender: function(t, r, index) {
      return t === 0 ? '暂未开始' : t === 1 ? '正在进行' : t === 2 ? '已完成' : t === 3 ? '异常' : ''
    }
  },
  {
    title: '节点任务资料',
    align: 'center',
    dataIndex: 'urls',
    scopedSlots: { customRender: 'imgSlot1' }
  },

  {
    title: '指派人上传节点任务资料',
    align: 'center',
    dataIndex: 'urlsForUser',
    scopedSlots: { customRender: 'imgSlot' }
  },
  // {
  //   title: '部门ID',
  //   align: 'center',
  //   dataIndex: 'deptId',
  // },
  {
    title: '部门名称',
    align: 'center',
    dataIndex: 'deptName'
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   align: 'center',
  //   scopedSlots: { customRender: 'action' },
  // },
]

export default {
  name: 'IndustryWorkOrderRecordList',
  mixins: [JeecgListMixin],
  components: {
    IndustryWorkOrderRecordModal,
    ImgStyle,
    myModel
  },

  data() {
    return {
      columns2,
      dataSource2: [],
      /* 分页参数 */
      ipagination2: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: false,
        total: 0
      },
      visible: false, //历史记录
      title: '工单历史记录',
      pageType: 'IndustryWorkOrderRecordList',
      description: '工单记录管理页面',
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
          title: '工单名称',
          align: 'center',
          dataIndex: 'orderName'
        },
        {
          title: '节点名称',
          align: 'center',
          dataIndex: 'nodeName'
        },
        {
          title: '工单状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function(t, r, index) {
            return t === 0 ? '暂未开始' : t === 1 ? '正在进行' : t === 2 ? '已完成' : t === 3 ? '异常' : ''
          }
        },
        {
          title: '节点任务资料',
          align: 'center',
          dataIndex: 'urls',
          scopedSlots: { customRender: 'imgSlot1' }
        },

        {
          title: '指派人上传节点任务资料',
          align: 'center',
          dataIndex: 'urlsForUser',
          scopedSlots: { customRender: 'imgSlot' }
        },
        // {
        //   title: '部门ID',
        //   align: 'center',
        //   dataIndex: 'deptId',
        // },
        {
          title: '部门名称',
          align: 'center',
          dataIndex: 'deptName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],

      url: {
        list: '/industry/industryWorkOrderRecord/list',
        delete: '/industry/industryWorkOrderRecord/delete',
        deleteBatch: '/industry/industryWorkOrderRecord/deleteBatch',
        exportXlsUrl: 'industry/industryWorkOrderRecord/exportXls',
        importExcelUrl: 'industry/industryWorkOrderRecord/importExcel'
      }
    }
  },

  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },

  methods: {
    // 工单历史记录
    openHistory(record) {
      // console.log(record)
      this.visible = true
      this.getHistoryDetail(record, 1)
    },

    // 获取工单历史记录
    getHistoryDetail(record, arg) {
      //加载数据 若传入参数1则加载第一页的内容
      //   this.dataSource2 = []
      //   if (arg === 1) {
      //     this.ipagination2.current = 1
      //   }
      //   let orderId = record.oderId //查询条件
      //   let pageNo = this.ipagination2.current
      //   this.loading = true
      //   lc_getHistoryDetail(orderId, pageNo)
      //     .then(res => {
      //       //   console.log(res)
      //       if (res.success) {
      //         this.dataSource2 = res.result
      //         // this.ipagination2.total = res.result.total
      //         // this.ipagination2.total = 10
      //       }
      //       if (res.code === 510) {
      //         this.$message.warning(res.message)
      //       }
      //       this.loading = false
      //     })
      //     .catch(err => {
      //       this.loading = false
      //     })

      this.dataSource2 = []
      if (arg === 1) {
        this.ipagination2.current = 1
      }
      let orderId = record.oderId //查询条件
      let pageNo = this.ipagination2.current
      this.loading = true
      lc_getHistoryDetail(orderId, pageNo)
        .then(res => {
          if (res.success) {
            this.dataSource2 = res.result.map(v => {
              v.isMoreShow = false
              v.isMoreShow2 = false
              if (v.urlsForUser) {
                v.urlsForUser = v.urlsForUser
                  .split(',')
                  .filter(item => {
                    return item !== ''
                  })
                  .toString()
              }
              this.loading = false
              return v
            })
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
        .catch(err => {
          this.loading = false
        })
    },

    closeDialog() {
      this.visible = false
    },

    grtMore(record) {
      this.dataSource = this.dataSource.map(v => {
        if (v.id === record.id) {
          v.isMoreShow = !v.isMoreShow
        }
        return v
      })
      // this.key++
    },

    grtMore2(record) {
      this.dataSource = this.dataSource.map(v => {
        if (v.id === record.id) {
          v.isMoreShow2 = !v.isMoreShow2
        }
        return v
      })
    },

    grtMore3(record) {
      this.dataSource2 = this.dataSource2.map(v => {
        if (v.id === record.id) {
          v.isMoreShow = !v.isMoreShow
        }
        return v
      })
      // this.key++
    },

    grtMore4(record) {
      this.dataSource2 = this.dataSource2.map(v => {
        if (v.id === record.id) {
          v.isMoreShow2 = !v.isMoreShow2
        }
        return v
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';

.icon-gengduo1,
.icon-sanjiaoleft {
  font-size: 30px;
  cursor: pointer;
}
</style>

<style lang="less" scoped>
.imgStyle div {
  display: flex;
}
.number {
  position: absolute;
  font-size: 12px;
  top: -4px;
  color: #fff;
  right: -4px;
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #409eff;
}

.ant-modal-body {
  padding: 20px;
}

/deep/.ant-modal-body {
  height: 80vh;
  overflow: auto;
}
</style>
