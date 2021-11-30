<template>
  <div class="analysis">

    <div class="analysis-center">
      <div class="analysis-center-left">
        <div class="analysis-center-left-title">
          <div class="analysis-center-left-title-bgc">视频录播</div>

        </div>
        <div class="analysis-center-left-content">

        </div>
      </div>
      <div class="analysis-center-right">
        <div class="analysis-center-left-title">
          <div class="analysis-center-left-title-bgc">设备列表</div>
        </div>
        <div class="analysis-center-left-content">

        </div>
      </div>
    </div>

    <div class="analysis-bottom">
      <div class="analysis-bottom-first">
        <div class="analysis-bottom-first-title">
          <div class="analysis-bottom-first-title-bgc">报表模块</div>
        </div>
        <div class="analysis-bottom-first-content">
          <div id="myChart"></div>

        </div>
      </div>
      <div class="analysis-bottom-second">
        <div class="analysis-bottom-first-title">
          <div class="analysis-bottom-first-title-bgc">不合格产品历史记录</div>
        </div>
        <div class="analysis-bottom-first-content">
          <!-- <my-table :table="table2"></my-table> -->
        </div>
      </div>
      <div class="analysis-bottom-third">
        <div class="analysis-bottom-first-title">
          <div class="analysis-bottom-first-title-bgc">设备使用记录</div>
        </div>
        <div class="analysis-bottom-first-content">
          <!-- <my-table :table="table3"></my-table> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const table = {
  index: true,
  // more: true,
  tableData: [
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
    { aa: 'kk_001', bb: '智能头盔', wwcc: '在线', dd: '童海鹏' },
  ],
  tableColumn: [
    {
      id: 2,
      label: '设备名称',
      prop: 'bb',
      width: '',
      align: 'center',
    },
    {
      id: 1,
      label: '设备序列号',
      prop: 'aa',
      width: '',
      align: 'center',
    },

    {
      id: 3,
      label: '当前在线状态',
      prop: 'wwcc',
      width: '',
      align: 'center',
      slot: true,
    },
    {
      id: 4,
      label: '当前使用者',
      prop: 'dd',
      width: '',
      align: 'center',
    },
  ],
}

const table2 = {
  index: true,

  tableData: [
    { aa: 'kk_002', bb: '童海鹏', cc: '2021-09-13 13:10:10' },
    { aa: 'kk_002', bb: '童海鹏', cc: '2021-09-13 13:10:10' },
    { aa: 'kk_002', bb: '童海鹏', cc: '2021-09-13 13:10:10' },
    { aa: 'kk_002', bb: '童海鹏', cc: '2021-09-13 13:10:10' },
  ],
  tableColumn: [
    {
      id: 1,
      label: '产品型号',
      prop: 'aa',
      width: '',
      align: 'center',
    },
    {
      id: 2,
      label: '指定人',
      prop: 'bb',
      width: '',
      align: 'center',
    },
    {
      id: 3,
      label: '时间',
      prop: 'cc',
      width: '180',
      align: 'center',
    },
  ],
}

const table3 = {
  index: true,
  tableData: [
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
    { aa: 'kk_003', bb: '智能头盔001', cc: '2021-10-10 10:10:10' },
  ],
  tableColumn: [
    {
      id: 1,
      label: '序列号',
      prop: 'aa',
      width: '',
      align: 'center',
    },
    {
      id: 2,
      label: '设备名称',
      prop: 'bb',
      width: '160',
      align: 'center',
    },
    {
      id: 3,
      label: '最后登录时间',
      prop: 'cc',
      width: '180',
      align: 'center',
    },
  ],
}

import * as echarts from 'echarts'
export default {
  components: {},

  props: {
    // row: Object,
  },

  data() {
    return {
      table,
      table2,
      table3,
    }
  },

  mounted() {
    this.drawLine()
    // let chartDom = document.getElementById('myChart')
    // let myChart = echarts.init(chartDom)
  },

  created() {},

  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      let option = {
        title: [
          {
            text: '工单完成数',
            subtext: '年度',
            textStyle: {
              color: '#fff',
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['完成数', '工单数'],
          textStyle: {
            color: '#fff',
          },
        },
        toolbox: {
          show: true,
          // feature: {
          //   dataView: { show: true, readOnly: false },
          //   magicType: { show: true, type: ['line', 'bar'] },
          //   restore: { show: true },
          //   saveAsImage: { show: true },
          // },
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '完成数',
            type: 'bar',
            data: [113, 323, 703, 232, 256, 767, 1356, 162, 326, 200, 634, 333],
            markPoint: {
              data: [
                // { type: 'max', name: '最大值' },
                // { type: 'min', name: '最小值' },
              ],
            },
            markLine: {
              // data: [{ type: 'average', name: '平均值' }],
            },
          },
          {
            name: '工单数',
            type: 'bar',
            data: [10, 50, 100, 200, 300, 500, 1000, 10, 50, 100, 200, 300, 500],
            markPoint: {
              data: [
                // { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
                // { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 },
              ],
            },
            markLine: {
              // data: [{ type: 'average', name: '平均值' }],
            },
          },
        ],
        color: ['#91cc75', '#d53a35'],
        textStyle: {
          color: '#fff',
        },
      }
      option && myChart.setOption(option)
    },
  },
}
</script>
<style lang="less" scoped>
.analysis {
  padding: 30px 20px;
  height: 100%;
  background-color: #0b1946;
  display: flex;
  flex-direction: column;
  position: relative;
  &-top {
    height: 80px;
    display: flex;
    justify-content: center;

    &-title {
      height: 55px;
      line-height: 55px;
      width: 80%;
      display: flex;
      justify-content: center;
    }

    &-logo {
      position: absolute;
      left: 50px;
    }
  }
  .logo-img {
    width: 180px;
    height: 50px;
  }

  .title-img {
    height: 55px;
    width: 80%;
  }

  &-center {
    display: flex;
    flex: 1;
    &-left {
      flex: 1;
      margin-right: 40px;

      &-title {
        height: 38px;
        line-height: 38px;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        &-bgc {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          width: 100%;
          text-align: center;
          background-size: contain;
        }
      }

      &-content {
        border: 2px solid #05b2fb;
        height: calc(100% - 65px);
        padding: 10px;
        // overflow: auto;
        max-height: 457px;
      }
    }

    &-right {
      flex: 1;

      &-title {
        height: 40px;
        line-height: 40px;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
      }
      &-content {
        border: 2px solid #05b2fb;
        height: 100%;
      }
    }
  }

  &-bottom {
    display: flex;
    margin-top: 5px;
    &-first {
      flex: 1;
      &-title {
        height: 25px;
        line-height: 25px;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        &-bgc {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          width: 100%;
          text-align: center;
          background-size: contain;
        }
      }
      &-content {
        height: 260px;
        border: 2px solid #05b2fb;
        padding: 10px;
        // overflow: auto;
      }
    }
    &-second {
      flex: 1;
      margin: 0 20px;
    }
    &-third {
      flex: 1;
    }
  }
  #myChart {
    height: 100%;
    // background-color: #fff;
  }
}
</style>