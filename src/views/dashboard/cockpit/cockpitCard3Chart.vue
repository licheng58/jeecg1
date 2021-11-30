<template>
  <div class="card-col">
    <div class="card-col-header">
      {{ type | titleFormat }}
    </div>
    <div :id="'pie_container' + type" class="chart-contaier" v-if="dataSource.length > 0"></div>
    <a-empty :image="simpleImage" v-if="dataSource.length === 0" />
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import { triggerWindowResizeEvent } from '@/utils/util'
import { kxyt } from '@/utils/dictionary'
import { numCal } from '@/utils/util'

// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/pie')
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/line')
// require('echarts/lib/chart/graph')
// require('echarts/lib/chart/scatter')
// 引入提示框和title组件
// require('echarts/lib/component/singleAxis')
require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
require('echarts/lib/component/legend')
// require('echarts/lib/component/dataZoom')
// require('echarts/lib/component/dataZoomInside')
// require('echarts/lib/component/dataZoomSlider')
export default {
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      dataSource: [],
      chartPlot: null,
      option: {
        color: ['#7088C6', '#F8CA8F', '#57D4E9'],
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.75)',
          padding: 10,
          textStyle: {
            color: '#555454',
          },
          extraCssText: 'box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);',
          formatter: (params) => {
            let html = `${params.marker}${params.name}:${params.value} ${this.type == 3 ? '万' : '笔'}`
            return html
          },
        },
        legend: {
          bottom: 0,
        },
        grid: {
          top: '20px',
          bottom: '20px',
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '45%'],
            data: [
              // { value: 335, name: '经营性' },
              // { value: 310, name: '改造性' },
              // { value: 234, name: '新开' },
            ],
          },
        ],
      },
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  mounted() {
    triggerWindowResizeEvent()
  },
  methods: {
    init(dataSource) {
      if (dataSource) {
        this.dataSource = dataSource.map((item) => {
          return {
            name: item.name ? kxyt[item.name] : item.name,
            value: this.type === 3 ? numCal(item.zcount, 2, '万') : item.zcount,
          }
        })
        this.$nextTick(() => {
          this.initChart(this.dataSource)
        })
      }
    },
    initChart(seriesData) {
      if (!this.chartPlot) {
        this.chartPlot = echarts.init(document.getElementById('pie_container' + this.type))
      } else {
        this.chartPlot.clear()
      }
      this.option.series[0].data = seriesData
      this.chartPlot.setOption(this.option)
    },
  },
  filters: {
    titleFormat(type) {
      return type === 1 ? '申请笔数分布' : type === 2 ? '放款笔数分布' : '信贷投放金额分布'
    },
  },
}
</script>
<style lang="less">
.card-col {
  background: #ffffff;
  padding: 16px 0;
  min-height: 230px;
  .card-col-header {
    margin: 0 17px 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    padding-left: 12px;
    position: relative;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 18px;
      background: #4664b4;
      border-radius: 2px;
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -9px;
    }
  }
  .chart-contaier {
    width: 100%;
    height: 320px;
  }
}
</style>