<template>
  <div class="order-detail">

    <div class="dialog-body">
      <div class="title">
        {{workOrderName}}
        <div class="title-icon">
          <i class="el-icon-refresh-right"
             style="color:#409eff"
             @click="$router.go(0)"></i>

          <i class="el-icon-close"
             style="color:#f56c6c"
             @click="$router.push('/industry/IndustryWorkOrderList')"></i>

        </div>
      </div>

      <div class="top">
        <div class="top-left">
          <div class="top-left-img"></div>
          <div class="top-left-title">用户信息{{this.workerPer}}</div>
        </div>
        <div class="top-center">
          <div class="top-center-item"
               v-for="item in showPersonInfo"
               :key='item.id'>
            <div class="top-center-item-left">{{item.title + ' :'}}</div>
            <div class="top-center-item-right one-line">{{item.name}}</div>
          </div>
        </div>

        <div class="top-right">
          <div id="myEcherts"
               ref="myEcherts"
               :style="{width: '170px', height: '170px',margin:'0 auto'}"
               v-if="this.workerPer !== 0"></div>
          <div v-else
               style="text-align: center; font-size: 16px; color: #fff;">流程暂未开始</div>
        </div>

      </div>

      <div class="bottom step-bottom"
           id="nav">
        <a-steps :current="stepCurrentIndex">
          <a-popover slot="progressDot"
                     :visible='false'
                     slot-scope="{ index, prefixCls,content }">
            <span :class="`${prefixCls}-icon-dot`"
                  :style="{backgroundBlendMode:isStartOrEnd(index)?'#05b0f9 !important':currentId === index?'difference': getIfFinish(index)===1?
                  '':'luminosity',width:isStartOrEnd(index)?'20px':'30px',height:isStartOrEnd(index)?
                  '20px':'30px',top:isStartOrEnd(index)?'-5px':'-11px',left:isStartOrEnd(index)?'-5px':'-8px'}">

              <span v-if="!isStartOrEnd(index)">{{index}}</span>
            </span>
          </a-popover>

          <a-step v-for="(item,idx) in workFlowDetail_data.workOrderNodes"
                  :key="item.id"
                  @click="clickStep(item)">
            <template slot="title">
              <span :class="idx % 2 === 1?'step-text':'step-text2'"
                    :title="item.name"> {{item.name}}</span>
            </template>

          </a-step>
        </a-steps>

        <div class="show-item"
             v-if="clickWorkInfo.name ">
          <div class="show-item-right">

            <el-carousel height="300px">
              <el-carousel-item v-for="item in clickWorkInfo.orderNodeFiles"
                                :key="item.id">
                <div v-if="item.url"
                     style="height:100%">
                  <div v-for="(v,index) in item.url.split(',')"
                       :key="index"
                       style="height:100%">
                    <el-image :src="v"
                              v-if="checkFile(v) === 'img'"
                              alt=""
                              :preview-src-list="[v]"> </el-image>
                    <video :src="v"
                           disablePictureInPicture
                           controlsList="nodownload"
                           controls
                           @click="handleZoonIn(v)"
                           v-if="checkFile(v) === 'video'"
                           style="height: auto;max-width: 450px;cursor: zoom-in;max-height: 300px" />
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>

          <div class="show-item-left"
               style="height: calc(100% - 150px);">

            <div class="show-item-left-item-left">
              <h3 style="font-size:16px;font-weight:700;color:#05b2fb;text-align:center"
                  v-if="clickWorkInfo.content">检验项目和标准 :</h3>
              <p class="show-item-left-item-right"
                 style="padding-left:20px;color:#fff ">{{clickWorkInfo.content}}</p>
            </div>
          </div>

        </div>

        <div class="help"
             style="text-align: center;margin-top: 100px; color: #999;"
             v-else>温馨提示 : 请点击节点查看详情信息 !</div>
      </div>

    </div>
    <span slot="footer"
          class="dialog-footer">
    </span>
    <myModel ref="myModel"
             :videoUrl='videoUrl'></myModel>
  </div>
</template>

<script>
import { lc_getWorkFlowDetails } from '@/api/lc_api'
import myModel from './common/myModel/index.vue'
import { Divider } from 'ant-design-vue'
// import * as echarts from 'echarts'
var echarts = require('echarts')
export default {
  components: {
    myModel,
  },

  data() {
    return {
      videoUrl: '', //需要放大的视频
      previews: [],
      workerPer: 0,
      workFlowDetail_data: {}, //工作流详情数据
      clickWorkInfo: {}, //点击节点信息
      record: {}, //点击的那个工单
      workOrderName: '', //工单名称
      workOrderStatus: '', //工单状态
      stepCurrentIndex: null, //步骤条完成的节点index
      currentId: 1, //点击step
      showPersonInfo: [
        { id: 1, title: '用户名', name: '' },
        { id: 2, title: '所属部门', name: '' },
        { id: 3, title: '发布时间', name: '' },
        { id: 4, title: '创建时间', name: '' },
        { id: 5, title: '更新时间', name: '' },
        { id: 6, title: '备注', name: '' },
      ],
    }
  },

  created() {
    let params = this.$route.params

    if (params.workOrderName) {
      this.record = params.record
      this.workOrderName = params.workOrderName
      this.workOrderStatus = params.workOrderStatus
      window.localStorage.setItem('record', JSON.stringify(params))
    } else {
      let record = JSON.parse(window.localStorage.getItem('record'))
      this.record = record.record
      this.workOrderName = record.workOrderName
      this.workOrderStatus = record.workOrderStatus
    }

    this.getWorkFlowDetails(this.record.id)

    this.showPersonInfo.forEach((v) => {
      if (v.title === '用户名') {
        v.name = this.record.username
      } else if (v.title === '所属部门') {
        v.name = this.record.deptName
      } else if (v.title === '发布时间') {
        v.name = this.record.createTime
      } else if (v.title === '备注') {
        v.name = this.record.remake
      } else if (v.title === '创建时间') {
        v.name = this.record.createTime
      } else if (v.title === '更新时间') {
        v.name = this.record.updateTime
      }
    })
  },

  mounted() {
    this.scrollInit()
    // this.initData()
  },

  methods: {
    initData(val, val2) {
      // console.log(val)
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myEcherts'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
        },

        color: ['#c4c4c4', '#069fe4'],

        series: [
          {
            name: '',
            type: 'pie',
            radius: '80%',
            data: [
              {
                value: val2,
                name: '未完成',
                label: {
                  show: true,
                  formatter: function (params, option) {
                    // console.log(params.data.value)
                    if (params.data.value == 0) {
                      return ''
                    }
                  },
                },
              },
              {
                value: val,
                name: '已完成',
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: '#069fe4',
              },
            },
            label: {
              fontSize: 14,
              normal: {
                show: true,
                position: 'inner', //标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 10, //文字的字体大小
                },
                formatter: '{b}{d}%',
              },
            },
          },
        ],
      })
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },

    // 初始化与绑定监听事件方法
    scrollInit() {
      // 获取要绑定事件的元素
      const scrollDiv = document.getElementById('nav')
      // document.addEventListener('DOMMouseScroll', handler, false)
      // 添加滚轮滚动监听事件，一般是用下面的方法，上面的是火狐的写法
      scrollDiv.addEventListener('mousewheel', handler, false)
      // 滚动事件的出来函数
      function handler(event) {
        // 获取滚动方向
        const detail = event.wheelDelta || event.detail
        // 定义滚动方向，其实也可以在赋值的时候写
        const moveForwardStep = 1
        const moveBackStep = -1
        // 定义滚动距离
        let step = 0
        // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
        if (detail < 0) {
          step = moveForwardStep * 100
        } else {
          step = moveBackStep * 100
        }
        // 对需要滚动的元素进行滚动操作
        scrollDiv.scrollLeft += step
      }
    },

    // 放大视频
    handleZoonIn(val) {
      this.videoUrl = val
      this.$refs.myModel.modelShow = true
    },

    // 获取工作流进度条详情信息
    async getWorkFlowDetails(id) {
      const that = this
      this.workerPer = 0
      const res = await lc_getWorkFlowDetails(id)
      this.workFlowDetail_data = res.result

      let start = {
        id: Date.now(),
        name: '开始',
        isFront: true,
      }

      let end = {
        id: Date.now() + Date.now(),
        name: '结束',
        isFront: true,
        ifFinsih: 0,
      }

      this.workFlowDetail_data.workOrderNodes = [start, ...this.workFlowDetail_data.workOrderNodes, end]
      // 如果end节点的前面一个节点isFinish === 1  那么end节点添加 isFinish = 1  否则默认是0
      this.workFlowDetail_data.workOrderNodes.forEach((v, index, arr) => {
        if (arr[arr.length - 2].ifFinsih === 1) {
          arr[arr.length - 1].ifFinsih = 1
        }
      })
      // console.log(this.workFlowDetail_data.workOrderNodes)

      let res1 = this.workFlowDetail_data.workOrderNodes.filter((v) => {
        return !v.isFront
      })

      let length = res1.length

      let finished = this.workFlowDetail_data.workOrderNodes.filter((v) => {
        return v.ifFinsih === 1 && v.name !== '结束'
      })

      let finishedLength = finished.length

      this.workerPer = (finishedLength / length) * 100
      this.workerPer = parseFloat(this.workerPer).toFixed(1) * 1
      let val2 = 100 - this.workerPer

      if (this.workerPer !== 0) {
        this.$nextTick(() => {
          this.initData(this.workerPer, val2)
        })
      }

      // 默认显示第一个  已完成的节点
      if (this.getFirstFinished()) {
        this.clickWorkInfo = this.getFirstFinished()
      } else {
        this.clickWorkInfo = {}
      }

      // 获取节点未完成的index
      this.getCurrentIndex()
    },

    // 获取节点是否已完成
    getIfFinish(index) {
      return this.workFlowDetail_data.workOrderNodes[index].ifFinsih
    },

    isStartOrEnd(index) {
      return this.workFlowDetail_data.workOrderNodes[index].isFront
    },

    // 冒泡弹框自定义
    popover(index) {
      return this.workFlowDetail_data.workOrderNodes[index].content
        ? this.workFlowDetail_data.workOrderNodes[index].content
        : '没有内容'
    },

    getCurrentIndex() {
      this.workFlowDetail_data.workOrderNodes.forEach((v, index) => {
        if (v.ifFinsih === 1) {
          // console.log(index)
          this.stepCurrentIndex = index
        }
      })
    },

    getFirstFinished() {
      let res = this.workFlowDetail_data.workOrderNodes.find((v) => {
        return v.ifFinsih === 1
      })
      return res
    },

    // 点击step
    clickStep(item) {
      // console.log(item)
      this.currentId = item.sort
      this.clickWorkInfo = item
      item.orderNodeFiles.forEach((v) => {
        if (v.url) {
          this.previews.push(v.url.split(','))
        }
      })
    },

    // 判断图片和视频格式
    checkFile(fileName) {
      if (fileName) {
        var flieArr = fileName.split('.')
        let lastName = flieArr[flieArr.length - 1]
        let imgArr = ['gif', 'jpg', 'jpeg', 'png', 'GIF', 'JPG', 'PNG']

        let res = imgArr.some((v) => {
          return v === lastName
        })
        if (res) {
          return 'img'
        } else {
          return 'video'
        }
      }
    },
  },
}
</script>

<style >
/* name样式 */
.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title,
.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title,
.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
  color: #05b0f9;
  font-weight: 700;
}

/* 线的颜色 */
.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after,
.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-tail::after,
.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-tail::after {
  /* background-color: #05b0f9; */
  height: 5px;
}

/* 节点大小 */
.ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot,
.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot,
.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
  background-color: #fff;
  background-image: url('./images/node.png');
  background-repeat: no-repeat;
  background-size: contain;
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #fff;
}

/* 节点位置 .order-detail*/
.order-detail .ant-steps-icon-dot,
.order-detail .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot,
.order-detail .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot,
.order-detail .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon .ant-steps-icon-dot {
  color: #fff;
  left: -8px;
  top: -10px;
}

.ant-steps-label-vertical .ant-steps-item-content {
  margin-top: 20px;
}

.ant-steps-item-title {
  width: 100%;
}

.ant-steps-item-content {
  position: relative;
}

.ant-steps-icon {
  position: relative;
}

.ant-steps-icon-dot:hover {
  cursor: pointer;
}

.ant-steps-icon-dot:hover .ant-popover-open {
  width: 0;
  height: 0;
}

.ant-steps {
  margin-bottom: 20px;
}

.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after {
  background-color: #05b2fb !important;
}

.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after,
.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-tail::after,
.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-tail::after {
  background-color: #d4d7df;
}
</style>

<style lang="less" scoped>
.order-detail {
  background-color: #0b1946;
  height: 100%;
  padding: 20px;
  .dialog-body {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .title {
    height: 70px;
    line-height: 70px;
    text-align: center;
    border: 3px solid #0786c7;
    color: #d4d7df;
    font-size: 20px;
    margin-bottom: 30px;
    border-radius: 3px;
    position: relative;

    .title-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);

      i {
        cursor: pointer;
        padding: 0 10px;
        font-size: 24px;
        color: #05b2fb;
      }

      i:hover {
        font-size: 26px;
      }
    }
  }

  .top {
    height: 180px;
    line-height: 180px;
    border: 3px solid #0786c7;
    border-radius: 3px;
    display: flex;
    align-items: center;
    padding: 20px 160px;
    padding-left: 30px;
    margin-bottom: 30px;

    &-left {
      flex: 3;
      height: 100%;

      &-img {
        text-align: center;
        height: 80%;
        background: url('./images/person.png') 50% / contain no-repeat;
      }
      &-title {
        text-align: center;
        font-size: 18px;
        color: #d4d7df;
        line-height: 30px;
      }
    }

    &-center {
      flex: 3;
      display: flex;
      flex-direction: column;
      &-item {
        display: flex;
        flex: 1;
        line-height: 20px;
        color: #d4d7df;
        &-left {
          margin-right: 10px;
        }
        &-right {
          width: 140px;
          text-overflow: ellipsis;
          white-space: normal;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    &-right {
      flex: 5;
      /deep/.el-progress-bar__outer {
        background-color: #0b1946;
        border: 2px solid #0786c7;
      }
      &-title {
        color: #d4d7df;
        line-height: 50px;
        text-align: center;
      }
      &-body {
        line-height: 60px;
      }
      &-text {
        color: #05b2fb;
        line-height: 50px;
        text-align: center;
      }
    }
  }

  .bottom {
    flex: 3;
    border: 3px solid #0786c7;
    border-radius: 3px;
  }

  .show-item {
    width: 100%;
    height: calc(100% - 80px);
    display: flex;
    padding: 0px 50px;
    align-items: center;
    // 文字
    &-left {
      flex: 2;
      padding-left: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 100px;
      &-item {
        display: flex;
        color: #d4d7df;
        line-height: 30px;
        &-left {
          margin-right: 10px;
          // width: 120px;
          text-align: end;
        }
        &-right {
          // width: 250px;
          // white-space: break-spaces;
          word-break: keep-all;
          word-wrap: break-word;
          text-align: justify;
          white-space: pre-line;
        }
      }
    }

    // 图片
    &-right {
      flex: 2;
      display: flex;
      align-items: center;
      // height: 280px;
      text-align: center;
      justify-content: center;

      /deep/.el-carousel,
      /deep/.el-carousel--horizontal,
      /deep/.el-carousel__container {
        width: 100%;
        height: 300px;

        /deep/.small {
          background-color: #fff;
          height: 90%;
          // width: 900%;
        }
      }
      height: 280px;
      text-align: center;
      justify-content: center;
      img {
        height: 90%;
        object-fit: contain;
      }
    }
  }

  .step-bottom {
    padding-top: 100px;
    overflow-x: auto;
  }

  /deep/.el-image {
    img {
      max-width: 450px;
      max-height: 300px;
      object-fit: contain;
    }
  }

  /deep/.el-progress__text {
    display: none !important;
  }

  /deep/.el-carousel__item,
  /deep/.is-animating {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /deep/.ant-steps-item-title {
    width: 160px;
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 20px;
    background-color: #fff;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: lightgray;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #d18e43;
  }
  /*定义最上方和最下方的按钮*/
  ::-webkit-scrollbar-button {
    background-color: #000;
    // border: 1px solid rgb(255, 17, 0);
  }

  .step-text {
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .step-text2 {
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: -70px;
    left: 5px;
  }
}

.start-end {
  width: 20px;
  height: 20px;
}
</style>

