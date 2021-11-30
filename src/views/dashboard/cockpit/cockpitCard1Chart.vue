<template>
  <div :id="'chart_container' + flag" :style="{ height: height + 'px' }" class="chart-contaier"></div>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import moment from 'moment'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
// require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// require('echarts/lib/chart/graph')
// require('echarts/lib/chart/scatter')
// 引入提示框和title组件
// require('echarts/lib/component/singleAxis')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
// require('echarts/lib/component/dataZoom')
require('echarts/lib/component/dataZoomInside')
require('echarts/lib/component/dataZoomSlider')
import { calMin, calMax } from '@/utils/util'

export default {
  name: 'chart',
  props: {
    height: {
      type: Number,
      default: 428,
    },
    flag: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      chartPlot: null,
      option: {
        color: ['#7088C6', '#F8CA8F', '#57D4E9'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.75)',
          padding: 10,
          textStyle: {
            color: '#555454',
          },
          extraCssText: 'box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);',
        },
        legend: {
          top: 0,
        },
        grid: {
          left: '50px',
          right: '70px',
          bottom: '60px',
        },
        dataZoom: [
          {
            ype: 'slider',
            start: 0,
            end: 100,
          },
        ],
        xAxis: {
          type: 'category',
          splitLine: {
            lineStyle: {
              color: ['#E4EAEF'],
              type: 'dashed',
            },
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: [
          {
            name: '数量（笔）',
            type: 'value',
            // min: Min1,
            // max: Max1,
            splitNumber: 5,
            // interval: (Max1 - Min1) / 5,
            splitLine: {
              lineStyle: {
                color: ['#E4EAEF'],
                type: 'dashed',
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          {
            name: '金额（万）',
            type: 'value',
            // min: Min2,
            // max: Max2,
            splitNumber: 5,
            // interval: (Max2 - Min2) / 5,
            splitLine: {
              lineStyle: {
                color: ['#E4EAEF'],
                type: 'dashed',
              },
            },
            axisLabel: {
              width: 150,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [],
      },
    }
  },
  mounted() {
    triggerWindowResizeEvent()
    this.initChart([], [], [])
  },
  methods: {
    initChart(seriesData, numData, mountData) {
      let Max1 = 10,
        Min1 = 0,
        Max2 = 10,
        Min2 = 0
      if (numData) {
        Max1 = calMax(numData)
        Min1 = calMin(numData)
      }
      if (mountData) {
        Max2 = calMax(mountData)
        Min2 = calMin(mountData)
      }
      this.option.yAxis[0].min = Min1
      this.option.yAxis[0].max = Max1
      this.option.yAxis[0].interval = (Max1 - Min1) / 5
      this.option.yAxis[1].min = Min2
      this.option.yAxis[1].max = Max2
      this.option.yAxis[1].interval = (Max2 - Min2) / 5
      if (!this.chartPlot) {
        this.chartPlot = echarts.init(document.getElementById('chart_container' + this.flag))
        window.addEventListener('resize', () => {
          this.chartPlot.resize()
        })
      } else {
        this.chartPlot.clear()
      }
      this.option.series = seriesData
      this.chartPlot.setOption(this.option)
    },
  },
}
</script>
<style lang="less" scoped>
.chart-contaier {
  width: 100%;
}
</style>