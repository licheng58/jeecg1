<template>
  <div id="chart_container"
       :style="{ height: height + 'px' }"
       class="chart-contaier"></div>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
// require('echarts/lib/chart/pie')
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/line')
require('echarts/lib/chart/graph')
// require('echarts/lib/chart/scatter')
// 引入提示框和title组件
// require('echarts/lib/component/singleAxis')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
// require('echarts/lib/component/legend')
// require('echarts/lib/component/dataZoom')
// require("echarts/lib/component/dataZoomInside");
// require('echarts/lib/component/dataZoomSlider')
export default {
  name: 'chart',
  props: {
    height: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      chartPlot: null,
      option: {
        grid: {
          left: 100,
          right: 100,
        },
        series: [],
      },
      seriesData: {
        type: 'graph',
        layout: 'force',
        symbolSize: 100,
        roam: true,
        draggable: true,
        label: {
          show: true,
          fontSize: 14,
          formatter: (param) => {
            return param.name
              .replace(/[^\x00-\xff]/g, '$&\x01')
              .replace(/.{8}\x01?/g, '$&\n')
              .replace(/\x01/g, '')
          },
        },
        force: {
          repulsion: 500,
          gravity: 0.03,
          edgeLength: 200,
          layoutAnimation: true,
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 10],
        edgeLabel: {
          fontSize: 14,
          normal: {
            show: true,
            formatter: (param) => {
              return param.data.relation
            },
          },
        },
        data: [],
        links: [],
        lineStyle: {
          width: 2,
        },
      },
    }
  },
  mounted() {
    triggerWindowResizeEvent()
    this.initChart({
      nodes: [],
      edges: [],
    })
  },
  methods: {
    initChart(data) {
      if (!this.chartPlot) {
        this.chartPlot = echarts.init(document.getElementById('chart_container'))
      } else {
        this.chartPlot.clear()
      }
      this.seriesData.data = data.nodes
      this.seriesData.links = data.edges
      this.option.series = [this.seriesData]
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