<template>
  <div class="IndustryWorkOrderList"
       v-loading="exportLoading"
       element-loading-text="拼命导出中..."
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">

    <!-- 进度条 -->

    <div class="top">
      <div v-for="(item,index) in infoCount"
           :key='item.id'
           @click="chooseOrder(item,index)"
           :class="currentIndex === index?'item-active':'top-item'">
        <div class="top-item-title">{{item.title}}</div>
        <div class="top-item-num"
             :style="{color:titleNumStyle(item)}">{{item.num}}</div>
      </div>
    </div>

    <div class="bottom">
      <div class="bottom-title">
        <div class="bottom-title-new"
             style="cursor:pointer;color:#fff"
             @click="handleAdd_">
          <div class="bottom-title-new-img"></div>
          发布工单
        </div>
        <!-- <div class="bottom-title-import"
             style="cursor:pointer">
          <div class="bottom-title-import-img"></div>
          导入
        </div> -->
        <div class="bottom-title-export"
             style="cursor:pointer;color:#fff"
             @click="handleExportXls3('任务工单')">
          <div class="bottom-title-export-img"></div>
          导出
        </div>

        <div class="bottom-title-allCheched">
          <el-checkbox v-model="allChecked"
                       @change="handleAllChecked"
                       style="color:#fff">全选</el-checkbox>
        </div>
      </div>

      <div class="bottom-flex">
        <div class="bottom-flex-body">

          <div class="bottom-flex-body-undisplay"
               v-for="item in workOrders"
               :key="item.id"
               style="position: relative;">

            <div class="bottom-flex-body-undisplay-item">
              <div class="bottom-flex-body-undisplay-item-content">
                <!-- 名称 -->
                <li>
                  <div class="left">名称 :</div>
                  <div class="right">{{item.name}}</div>
                </li>

                <!-- 状态 -->
                <li>
                  <div class="left">状态 :</div>
                  <div class="right">
                    <span :style="{background:StatusColor(item)}"
                          class="right-status">{{item.status === 0 ? '暂未开始' : item.status === 1 ? 
                  '正在进行' : item.status === 2 ? '已完成':item.status === 3 ?'异常':''}}</span>
                  </div>
                </li>
                <!-- 产品型号 -->
                <li>
                  <div class="left">产品型号 :</div>
                  <div class="right">{{item.productNo}}</div>
                </li>

                <!-- 发布时间 -->
                <li>
                  <div class="left">发布时间 :</div>
                  <div class="right">{{item.createTime}}</div>
                </li>

                <!-- 指派人 -->
                <li>
                  <div class="left">指派人 :</div>
                  <div class="right">{{item.username}}</div>
                </li>

                <!-- 备注 -->
                <li>
                  <div class="left">备注 :</div>
                  <div class="right">{{item.remake}}</div>
                </li>
              </div>

              <!-- 多选框 -->
              <a-checkbox v-model="item.checked"
                          class="check-item">
              </a-checkbox>

              <!-- 二维码 -->

              <el-popover placement="right"
                          :width="item.qrCode?'320':'0'"
                          trigger="click">
                <img :src="item.qrCode"
                     v-if="item.qrCode"
                     alt=""
                     style="height: 300px;width: 300px ;object-fit: contain;">

                <i class="or icon iconfont icon-erweima"
                   slot="reference"> </i>
              </el-popover>

              <div class="bottom-flex-body-undisplay-item-operate">
                <!-- <el-button type="primary">修改</el-button>
              <el-button type="primary">更多</el-button> -->
                <div class="button-left"
                     @click="handleDetail(item)">
                  <a style="color:#fff">详情</a>
                </div>
                <div class="button-right">

                  <a-popconfirm title="确定删除吗?"
                                @confirm="() => handleDelete_(item)">
                    <a style="color:#fff">删除</a>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="bottom-flex-body-pagination">
          <a-pagination v-if="pageInfo.total>0"
                        v-model="pageInfo.currentPage"
                        :total="pageInfo.total"
                        :current="pageInfo.currentPage"
                        @change="onChangeStep"
                        :page-size="10"
                        :show-total="total => `共 ${pageInfo.total} 条`"
                        show-less-items />
        </div>
      </div>
    </div>

    <!-- 表单区域 -->
    <industryWorkOrder-modal ref="modalForm"
                             :WorkFlows='WorkFlows'
                             :Appointors='Appointors'
                             @ok="modalFormOk"></industryWorkOrder-modal>
  </div>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustryWorkOrderModal from './modules/IndustryWorkOrderModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { lc_getWorkFlows, lc_getAppointors, lc_getWorderOrders, lc_delWorderOrder, lc_getInfoCount } from '@/api/lc_api'
export default {
  mixins: [JeecgListMixin],
  components: {
    IndustryWorkOrderModal,
  },

  data() {
    return {
      url11: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList11: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
      ],
      refreshRecord: {}, //刷新借口数据
      currentStatus: '', //当前点击状态
      workOrderName: '', //工单名称
      workOrderStatus: '', //工单状态
      exportLoading: false,
      workStatus: null, //页面工单状态
      currentIndex: 0,
      current: 1,
      pageInfo: {
        currentPage: 1,
        total: 1,
        pageSize: 10,
      },
      infoCount: [], // 工单数据统计
      workOrders: [], //工单数据
      description: '任务工单管理页面',
      WorkFlows: [], //工作流数据
      Appointors: [], //指定人数据
      confirmLoading: false,

      disableMixinCreated: true,

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
    this.getWorderOrders()
    this.getInfoCount()
  },

  computed: {
    allChecked: {
      get() {
        return this.workOrders.every((v) => v.checked)
      },

      set(val) {
        this.workOrders.forEach((v) => {
          v.checked = val
        })
      },
    },

    titleNumStyle(item) {
      return (item) => {
        switch (item.title) {
          case '暂未开始':
            return '#d2b717'
          case '正在进行':
            return '#05b1fa'
          case '已完成':
            return '#57ad12'
          case '异常':
            return '#cf0000'
        }
      }
    },

    StatusColor(item) {
      return (item) => {
        switch (item.status) {
          case 0:
            return '#d2b717'
          case 1:
            return '#05b1fa'
          case 2:
            return '#57ad12'
          case 3:
            return '#cf0000'
        }
      }
    },
  },

  methods: {
    // 全选
    handleAllChecked(val) {
      console.log(val)
    },

    // 点击step
    onChangeStep(val) {
      this.getWorderOrders(this.workStatus, val)
    },

    // 获取工单数据
    async getWorderOrders(status, pageNo) {
      // console.log(status)
      this.currentStatus = status
      const res = await lc_getWorderOrders(status, pageNo)
      this.workOrders = res.result.records.map((v) => {
        v.checked = false
        return v
      })

      this.pageInfo.currentPage = res.result.current
      this.pageInfo.total = res.result.total
      this.pageInfo.pageSize = res.result.size
      // console.log(this.workOrders)
    },

    // 获取工作流信息
    async getWorkFlows() {
      const res = await lc_getWorkFlows()
      this.WorkFlows = res.result
    },

    // 获取数据统计
    async getInfoCount() {
      const res = await lc_getInfoCount()
      this.infoCount = [
        { id: 1, title: '工单总量', num: res.result.sunCount },
        { id: 3, title: '暂未开始', num: res.result.noStartCount, status: 0 },
        { id: 4, title: '正在进行', num: res.result.underwayCount, status: 1 },
        { id: 2, title: '已完成', num: res.result.finishCount, status: 2 },
        { id: 5, title: '异常', num: res.result.unusualCount, status: 3 },
      ]
    },

    // 选择工单
    chooseOrder(item, index) {
      // console.log(item)
      this.currentIndex = index
      this.workStatus = item.status
      this.getWorderOrders(item.status)
    },

    // 获取指定人
    async getAppointors() {
      const res = await lc_getAppointors()
      this.Appointors = res.result
    },

    // 查看详情
    handleDetail(record) {
      // console.log(record)

      this.refreshRecord = record

      this.workOrderName = record.name
      this.workOrderStatus = record.status

      this.confirmLoading = false

      this.$router.push({
        name: 'orderDetail',
        params: {
          record,
          workOrderName: this.workOrderName,
          workOrderStatus: this.workOrderStatus,
        },
      })
    },

    // 新增
    handleAdd_() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '发布工单'
      this.$refs.modalForm.disableSubmit = false
      this.getAppointors()
      this.getWorkFlows()
    },

    // 删除
    async handleDelete_(item) {
      const res = await lc_delWorderOrder(item.id)
      this.$message.success('删除成功')
      this.getWorderOrders(this.currentStatus)
      this.getInfoCount()
    },

    close() {
      this.$emit('close')
    },

    handleOk() {
      // console.log(123)
      this.$emit('close')
      this.confirmLoading = true
    },

    // 点击分页
    onChange(current) {
      // console.log(current)
      this.pageInfo.currentPage = current

      this.getWorderOrders(status, this.pageInfo.currentPage)
    },
  },
}
</script>



<style lang="less" scoped>
@import url('//at.alicdn.com/t/font_2894251_kimbtminwxr.css');
.IndustryWorkOrderList {
  list-style: none;
  height: 100%;
  background-color: #0b1946;
  color: #d4d7df;
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-right: 35px;

  .or {
    width: 30px;
    height: 30px;
    font-size: 30px;
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
  }

  .popover-hover {
    min-height: 280px;
    min-width: 800px;
    position: absolute;
    top: 80px;
    left: -20px;
    display: none !important;
    background: url('./images/Vector.png') 0 / contain no-repeat;
    display: flex;
    align-items: center;

    &-info {
      padding: 30px;
      &-item {
        font-size: 14px;
        display: flex;
        align-items: center;
        &-left {
          margin-right: 10px;
        }
      }
    }
  }

  .progress {
    position: absolute;
    right: 0;
    top: -5px;
    width: 100%;
  }

  .check-item {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .top {
    height: 120px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    &-item {
      cursor: pointer;
      width: 310px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: url('./images/top_bgc1.png') 0 / contain no-repeat;

      &-title {
        font-size: 24px;
      }
      &-num {
        font-size: 24px;
        // color: #07c4ef;
      }
    }

    .item-active {
      cursor: pointer;
      width: 310px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: url('./images/bgc_blue.png') 0 / contain no-repeat;
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    flex: 1;

    &-title {
      width: 60%;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url('./images/bgc_title.png') 50% / contain no-repeat;
      .bottom-title-new {
        width: 80px;
        height: 31px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background: url('./images/white_btn.png') 0 / contain no-repeat;
      }
      .bottom-title-new-img {
        width: 15px;
        height: 15px;
        background: url('./images/new.png') 0 / contain no-repeat;
      }
      .bottom-title-import {
        width: 80px;
        height: 31px;
        margin: 0 30px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background: url('./images/white_btn.png') 0 / contain no-repeat;
      }
      .bottom-title-import-img {
        width: 15px;
        height: 15px;
        background: url('./images/import.png') 0 / contain no-repeat;
      }
      .bottom-title-export {
        margin: 20px;
        width: 80px;
        height: 31px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background: url('./images/white_btn.png') 0 / contain no-repeat;
      }
      .bottom-title-export-img {
        width: 15px;
        height: 15px;
        background: url('./images/export.png') 0 / contain no-repeat;
      }
    }

    &-flex {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 2px solid #1da0ff;
      border-radius: 10px;
      padding: 20px 10px;
      &-body {
        flex: 1;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        &-undisplay {
          width: 20%;
          padding: 10px;

          &-item {
            border: 2px solid #0cb5fc;
            border-radius: 3px;
            width: 100%;
            height: 200px;
            padding: 10px 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            &-content {
              li {
                display: flex;
                font-size: 12px;
                line-height: 22px;
                .left {
                  margin-right: 5px;
                  min-width: 60px;
                  text-align: end;
                }
                .right {
                  width: 120px;
                  text-overflow: ellipsis;
                  white-space: normal;
                  white-space: nowrap;
                  overflow: hidden;
                }
              }
            }

            &-operate {
              display: flex;
              justify-content: space-around;

              .button-left,
              .button-right {
                width: 66px;
                height: 26px;
                text-align: center;
                line-height: 26px;
                cursor: pointer;
                background: url('./images/blue_btn.png') 0 / contain no-repeat;
              }
            }
          }
        }
        &-pagination {
          height: 60px;
          width: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .one-line {
    width: 140px;
    text-overflow: ellipsis;
    white-space: normal;
    white-space: nowrap;
    overflow: hidden;
  }

  .right-status {
    padding: 1px 5px;
    border-radius: 3px;
  }

  /deep/.ant-pagination-item-ellipsis {
    color: #fff;
  }
}
</style>

<style >
/* 分页总数颜色 */
.ant-pagination-total-text {
  color: #fff;
}

.step-text {
  position: absolute;
  width: 100%;
  left: 0;
}

.IndustryWorkOrderList .el-dialog__body {
  height: calc(100% - 58px);
  padding-bottom: 0;
}

.IndustryWorkOrderList .el-dialog__header {
  padding: 0;
}

.IndustryWorkOrderList .el-dialog__footer {
  border: none;
  text-align: center;
  padding: 10px 20px;
}

.IndustryWorkOrderList .el-button {
  border: none;
  color: #d4d7df;
}

.IndustryWorkOrderList .ant-pagination-item-active {
  background-color: #05b2fb;
}

.IndustryWorkOrderList .ant-pagination-item-active a {
  color: #fff;
}
.el-image-viewer__mask {
  opacity: 0.8;
}
.el-image__preview {
  cursor: zoom-in;
}
</style>