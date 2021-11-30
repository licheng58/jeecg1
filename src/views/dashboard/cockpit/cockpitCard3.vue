<template>
  <div class="cockpit-card3">
    <a-spin :spinning="loading">
      <a-row :gutter="24">
        <a-col :span="24">
          <div class="card-header">
            <span>业务占比</span>
            <!-- <a-icon type="up-circle" /> -->
            <a-icon type="down-circle" />
          </div>
        </a-col>
        <a-col :span="8">
          <cockpitCard3Chart ref="cockpitCard3Chart1" :type="1"></cockpitCard3Chart>
        </a-col>
        <a-col :span="8">
          <cockpitCard3Chart ref="cockpitCard3Chart2" :type="2"></cockpitCard3Chart>
        </a-col>
        <a-col :span="8">
          <cockpitCard3Chart ref="cockpitCard3Chart3" :type="3"></cockpitCard3Chart>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import cockpitCard3Chart from './cockpitCard3Chart'
import { getAction } from '@/api/manage'

export default {
  components: {
    cockpitCard3Chart,
  },
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      loading: false,
      dataSource: [],
      url: {
        getData: '/credit/xWarningRecord/cockpit5',
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    init(dataSource) {
      if (dataSource) {
        this.dataSource = dataSource
      }
    },
    loadData() {
      this.loading = true
      getAction(this.url.getData).then((res) => {
        if (res.success) {
          this.$refs.cockpitCard3Chart1.init(res.result.cockpitDtos1)
          this.$refs.cockpitCard3Chart2.init(res.result.cockpitDtos2)
          this.$refs.cockpitCard3Chart3.init(res.result.cockpitDtos3)
        }
        this.loading = false
      })
    },
  },
  filters: {
    titleFormat(type) {
      return type === 1 ? '银行排名统计' : type === 2 ? '品牌排名统计' : '省份排名统计'
    },
  },
}
</script>
<style lang="less">
.cockpit-card3 {
  .card-header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    margin: 16px 0 9px;
    text-align: center;
    span {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    i {
      font-size: 20px;
      margin-left: 8px;
      color: #7088C6;
    }
  }
}
</style>