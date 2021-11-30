<template>
  <div class="analysis">
    <!-- top模块 -->
    <div class="top">
      <!-- top左边 -->
      <div class="top-l">
        <h3 class="top-l-title">工 单 待 办</h3>
        <div class="top-l-content">
          <div class="started">
            <div class="started-l">
              <img src="./images/Frame19@2x.png" alt="" style="width:70%" />
            </div>
            <div class="started-r">
              <div class="started-r-first">正 在 进 行</div>
              <div class="started-r-second">{{ topData.start }}</div>
            </div>
          </div>
          <div class="not-started">
            <div class="not-started-l">
              <img src="./images/Vector@2x.png" alt="" style="width:70%" />
            </div>
            <div class="not-started-r">
              <div class="not-started-r-first">暂 未 开 始</div>
              <div class="not-started-r-second">{{ topData.noStart }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- top右边 -->
      <div class="top-r">
        <!-- 工单状态 -->
        <div class="top-r-workStatus">
          <div id="workStatus" :style="{ width: '100%', minHeight: '150px', height: '100%', margin: '0 auto' }"></div>
        </div>

        <!-- 在线状态 -->
        <div class="top-r-onlineStatus">
          <div id="onlineStatus" :style="{ width: '100%', minHeight: '150px', height: '100%', margin: '0 auto' }"></div>
        </div>
      </div>
    </div>

    <!-- center模块 -->
    <div class="center">
      <div class="title">工 单 报 表</div>
      <div class="content" ref="content">
        <div id="workReport" :style="{ width: '100%', minHeight: '320px', height: '100%', margin: '0 auto' }"></div>
      </div>

      <!-- 年 月 周 切换 -->
      <div class="check-time">
        <div
          class="item"
          :class="currentClick === item.id ? 'click-item' : ''"
          v-for="item in timeInfo"
          :key="item.id"
          style="cursor:pointer"
          @click="getTimeInfo(item.id)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <!-- bottom模块 -->
    <div class="bottom">
      <div class="bottom-l">
        <div class="bottom-l-title">设 备 状 态</div>
        <div class="bottom-l-table">
          <my-table :table="table" />
        </div>
      </div>
      <div class="bottom-r">
        <div class="bottom-r-title">远 程 协 作</div>
        <div class="bottom-r-table">
          <my-table :table="table2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var echarts = require('echarts')
import myTable from './compoments/my_table.vue'
import { lc_getHomeInfo, lc_getTimeInfo } from '@/api/lc_api'

const timeInfo = [
  { id: 1, label: '周' },
  { id: 2, label: '月' },
  { id: 3, label: '季度' }
]
const table = {
  index: true,
  // more: true,
  height: '300',
  tableData: [],
  tableColumn: [
    {
      id: 2,
      label: '设备类型',
      prop: 'type',
      width: '120',
      align: 'center'
    },
    {
      id: 1,
      label: 'SN号',
      prop: 'serialNo',
      width: '',
      align: 'center'
    },
    {
      id: 4,
      label: '绑定用户',
      prop: 'realname',
      width: '150',
      align: 'center',
      slot: true
    },

    {
      id: 3,
      label: '状态',
      prop: 'activeStatus',
      width: '60',
      align: 'center',
      slot: true
    }
  ]
}

const table2 = {
  index: true,
  // more: true,
  height: '300',
  tableData: [
    {
      id: 1,
      type: '张三',
      serialNo: '头盔终端用户',
      status: '正常'
    },
    {
      id: 2,
      type: '封承利',
      serialNo: '平台管理员',
      status: '正常'
    },
    {
      id: 3,
      type: '俞恩东	',
      serialNo: '头盔终端用户',
      status: '正常'
    },
    {
      id: 4,
      type: '贾玉玺	',
      serialNo: '平台管理员	',
      status: '正常'
    },
    {
      id: 5,
      type: '李四',
      serialNo: '头盔终端用户',
      status: '正常'
    }
  ],
  tableColumn: [
    {
      id: 2,
      label: '用户姓名',
      prop: 'type',
      width: '120',
      align: 'center'
    },
    {
      id: 1,
      label: '用户角色',
      prop: 'serialNo',
      width: '',
      align: 'center'
    },

    {
      id: 3,
      label: '状态',
      prop: 'activeStatus',
      width: '120',
      align: 'center',
      slot: true
    }
  ]
}
export default {
  components: {
    myTable
  },

  data() {
    return {
      table,
      table2,
      timeInfo,
      currentClick: '', //点击的时间
      topData: {
        start: '',
        noStart: ''
      }
    }
  },

  created() {
    this.getHomeInfo()
    this.getTimeInfo(1)
    // console.log(this.$store.getters.opened)
  },

  watch: {
    '$store.getters.opened': (val, old) => {
      if (val !== old) {
        setTimeout(() => {
          const myChart = echarts.init(document.getElementById('workReport'))
          const myChart2 = echarts.init(document.getElementById('onlineStatus'))
          const myChart3 = echarts.init(document.getElementById('workStatus'))
          myChart.resize() //echarts得重绘方法
          myChart2.resize() //echarts得重绘方法
          myChart3.resize() //echarts得重绘方法
        }, 100)
      }
    }
  },

  methods: {
    // 获取时间数据
    async getTimeInfo(type) {
      this.currentClick = type
      const res = await lc_getTimeInfo(type)
      // console.log(res.result)

      if (res.result) {
        if (type !== 3) {
          res.result = res.result.sort(this.sortData('datetime', true))
        } else {
          res.result = res.result
            .map(v => {
              return {
                ...v,
                datetimeSort: +v.datetime.split('.')[0],
                datetime: `第${v.datetime.split('.')[0]}季度`
              }
            })
            .sort(this.sortData('datetimeSort', true))
        }

        let result = {
          finishes: [], //完成数
          workOrders: [], //工单数
          times: [] //时间参数
        }

        res.result.forEach(v => {
          result.finishes.push(v.finishCount)
          result.workOrders.push(v.taskorderCount)
          result.times.push(v.datetime)
        })
        // console.log(result)

        this.initWorkReport(result)
      }
    },

    // 日期排序
    sortData(property, bol) {
      //property是你需要排序传入的key,bol为true时是升序，false为降序
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        if (bol) {
          // 升序
          return Date.parse(value1) - Date.parse(value2)
        } else {
          // 降序
          return Date.parse(value2) - Date.parse(value1)
        }
      }
    },

    // 获取数据
    async getHomeInfo() {
      const res = await lc_getHomeInfo()
      this.topData = {
        start: res.result.workorderMap.underwayCount,
        noStart: res.result.workorderMap.noStartCount
      }

      this.table.tableData = res.result.industryHelmets.map(v => {
        if (v.activeStatus === 1) {
          v.activeStatus = '在线'
        } else if (v.activeStatus === 0) {
          v.activeStatus = '离线'
        } else {
          v.activeStatus = ''
        }
        return v
      })
      this.initWorkStatus(res.result)
      this.initOnlineStatus(res.result)
    },

    // 工单状态饼图
    initWorkStatus(res) {
      const myChart = echarts.init(document.getElementById('workStatus'))

      myChart.setOption({
        tooltip: {
          trigger: 'item'
          // formatter: '{b}{d}%',
        },

        title: {
          text: '工 单 状 态',
          // subtext: '模拟数据',
          // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',

          textStyle: {
            fontSize: 16,
            fontWeight: 'bolder',
            color: '#fff'
          }
        },

        legend: {
          orient: 'horizontal',
          icon: 'circle',
          itemWidth: 5,
          // right: 20,
          top: 'bottom',
          data: ['正在进行', '未开始', '已完成', '异常'],
          textStyle: {
            fontSize: '12',
            color: () => {} // 把颜色这里做成函数就可以了
          }
        },

        // 设置值域的那指向线
        labelLine: {
          normal: {
            show: false // show设置线是否显示，默认为true，可选值：true ¦ false
          }
        },

        color: ['#32cbf8', '#fdcd62', '#87f693', '#f56c6c'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['50%', '50%'],
            // roseType: 'area',
            label: {
              show: false,
              position: 'center'
            },
            // 圈中心显示数据
            emphasis: {
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold',
                formatter: '{d}%'
              }
            },
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: res.workorderMap.underwayCount, name: '正在进行' },
              { value: res.workorderMap.noStartCount, name: '未开始' },
              { value: res.workorderMap.finishCount, name: '已完成' },
              { value: res.workorderMap.unusualCount, name: '异常' }
            ]
          }
        ]
      })
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },

    // 在线状态饼图
    initOnlineStatus(res) {
      const myChart = echarts.init(document.getElementById('onlineStatus'))

      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },

        title: {
          text: '设 备 状 态',
          // subtext: '模拟数据',
          // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',

          textStyle: {
            fontSize: 16,
            fontWeight: 'bolder',
            color: '#fff'
          }
        },

        legend: {
          orient: 'horizontal',
          icon: 'circle',
          itemWidth: 5,
          // right: 20,
          top: 'bottom',
          data: ['离线', '在线'],
          textStyle: {
            fontSize: '12',
            color: () => {} // 把颜色这里做成函数就可以了
          }
        },

        // 设置值域的那指向线
        labelLine: {
          normal: {
            show: false // show设置线是否显示，默认为true，可选值：true ¦ false
          }
        },

        color: ['#87f693', '#cdcdcd'],

        series: [
          {
            name: '',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['50%', '50%'],
            // roseType: 'area',
            label: {
              show: false,
              position: 'center'
            },

            // 圈中心显示数据
            emphasis: {
              label: {
                show: true,
                fontSize: '12',
                fontWeight: 'bold',
                formatter: '{d}%'
              }
            },

            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: res.helmetMap.onlineCount, name: '在线' },
              { value: res.helmetMap.unlineCount, name: '离线' }
            ]
          }
        ]
      })

      window.addEventListener('resize', function() {
        myChart.resize()
      })
    },

    // 工单报表柱状图
    initWorkReport(result) {
      const colors = ['#00c7ff', '#7997ff']
      const myChart = echarts.init(document.getElementById('workReport'))
      // console.log(this.$refs.content.style)
      myChart.setOption({
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },

        toolbox: {
          feature: {
            // dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['line', 'bar'],
              iconStyle: {
                borderColor: '#fff'
                // color: '#1ecad6',
              },
              emphasis: {
                iconStyle: {
                  textPosition: 'top'
                }
              }
            }

            // restore: { show: true },
            // saveAsImage: { show: true },
          },
          tooltip: {
            show: true,
            position: 'top'
          }
        },

        grid: {
          top: '35px',
          left: '10px',
          right: '10px',
          bottom: '0',
          containLabel: true
        },

        legend: {
          itemWidth: 10,
          itemHeight: 10,
          data: ['完成数', '工单数'],
          textStyle: {
            color: '#fff',
            padding: [0, 10]
          }
        },
        xAxis: [
          {
            type: 'category',
            data: result.times,
            axisTick: {
              // alignWithLabel: true,
              type: 'shadow'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#00c7ff',
                width: 1,
                type: 'solid'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '工单完成数',
            //y轴样式
            axisLine: {
              show: true,
              lineStyle: {
                color: '#00c7ff',
                width: 1,
                type: 'solid'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#00c7ff'
              },
              formatter: '{value} '
            },

            splitLine: {
              //分割线样式
              show: true,
              lineStyle: {
                color: '#7997ff'
                // type: 'dashed', //分割线设置为虚线
              }
            }
          }
        ],

        series: [
          {
            name: '完成数',
            type: 'bar',
            label: {
              color: '#fff'
            },
            colorBy: 'series',
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: {
                    //数值样式
                    color: '#ccc',
                    fontSize: 12
                  }
                }
              }
            },
            data: result.finishes
          },
          {
            name: '工单数',
            type: 'bar',
            // yAxisIndex: 1,
            label: {
              color: '#fff'
            },
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: {
                    //数值样式
                    color: '#ccc',
                    fontSize: 12
                  }
                }
              }
            },
            data: result.workOrders
          }
          // {
          //   name: '',
          //   type: 'line',
          //   // yAxisIndex: 2,
          //   label: {
          //     color: colors[0],
          //   },
          //   data: result.finishes,
          // },

          // {
          //   name: '',
          //   type: 'line',
          //   // yAxisIndex: 2,
          //   label: {
          //     color: colors[1],
          //   },
          //   data: result.workOrders,
          // },
        ]
      })
      window.addEventListener('resize', function() {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.analysis {
  padding: 20px 30px;
  height: 100%;
  background-color: #0b1946;
  display: flex;
  flex-direction: column;
  position: relative;

  .top {
    flex: 1;
    display: flex;

    &-l {
      flex: 1;
      background-color: #112151;
      margin-right: 20px;
      padding: 10px 20px;

      &-title {
        color: #fff;
        text-align: center;
        height: 26px;
        font-weight: 700;
      }
      &-content {
        display: flex;
        height: calc(100% - 46px);
        .started {
          flex: 1;
          display: flex;
          margin-right: 20px;
          background: url('./images/蓝色背景@1x.png') 100% / cover no-repeat;
          &-l {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          &-r {
            flex: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            &-first {
              font-size: 18px;
            }
            &-second {
              font-size: 30px !important;
            }
          }
        }
        .not-started {
          flex: 1;
          display: flex;
          background: url('./images/紫色背景@1x.png') 100% / cover no-repeat;
          &-l {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          &-r {
            flex: 2;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            &-first {
              font-size: 18px;
            }
            &-second {
              font-size: 30px !important;
            }
          }
        }
      }
    }

    // top右边
    &-r {
      flex: 1;
      display: flex;
      background-color: #112151;
      padding: 10px 20px 10px 20px;
      &-workStatus {
        flex: 1;
      }

      &-onlineStatus {
        flex: 1;
      }
    }
  }

  .center {
    background-color: #112151;
    flex: 2;
    margin: 20px 0;
    padding: 10px 50px 20px 50px;
    position: relative;
    .title {
      text-align: center;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      height: 24px;
      line-height: 24px;
    }
    .content {
      height: calc(100% - 24px);
    }

    .check-time {
      width: 150px;
      color: #fff;
      // background-color: #fff;
      height: 30px;
      line-height: 30px;
      position: absolute;
      top: 34px;
      right: 110px;
      border-radius: 5px;
      display: flex;
      .item {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
  }

  .click-item {
    // background-color: #ccc;
    color: #29caf0;
  }

  .click-item:nth-child(1) {
    border-radius: 5px 0 0 5px;
  }

  .click-item:nth-child(3) {
    border-radius: 0 5px 5px 0;
  }

  .bottom {
    flex: 2;
    display: flex;
    // width: calc(100% - 0px);
    &-l {
      flex: 1;
      background-color: #112151;
      margin-right: 20px;
      padding: 0 20px;
      &-title {
        text-align: center;
        color: #fff;
        padding: 10px;
        font-size: 16px;
        font-weight: 700;
      }
      &-table {
        height: calc(100% - 54px);
      }
    }
    &-r {
      flex: 1;
      background-color: #112151;
      &-title {
        text-align: center;
        color: #fff;
        padding: 10px;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
}
</style>
