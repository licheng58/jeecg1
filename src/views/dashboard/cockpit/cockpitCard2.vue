<template>
  <div class="cockpit-card2">
    <a-spin :spinning="loading">
      <a-row :gutter="24">
        <a-col :span="24">
          <div class="card-header">
            <span>{{ type | titleFormat }}</span>
            <!-- <a-icon type="up-circle" /> -->
            <a-icon type="down-circle" />
          </div>
        </a-col>
        <a-col :span="8">
          <cockpitCard2Col ref="cockpitCard2Col1" :ptype="type" :type="1"></cockpitCard2Col>
        </a-col>
        <a-col :span="8">
          <cockpitCard2Col ref="cockpitCard2Col2" :ptype="type" :type="2"></cockpitCard2Col>
        </a-col>
        <a-col :span="8">
          <cockpitCard2Col ref="cockpitCard2Col3" :ptype="type" :type="3"></cockpitCard2Col>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import cockpitCard2Col from './cockpitCard2Col'
import { getAction } from '@/api/manage'

export default {
  components: {
    cockpitCard2Col,
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
      formData: {},
      dataSource: [],
      url: {
        getData1: '/credit/xWarningRecord/cockpit2',
        getData2: '/credit/xWarningRecord/cockpit3',
        getData3: '/credit/xWarningRecord/cockpit4',
      },
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      let url = this.type === 1 ? this.url.getData1 : this.type === 2 ? this.url.getData2 : this.url.getData3
      getAction(url).then((res) => {
        if (res.success) {
          this.$refs.cockpitCard2Col1.init(res.result.cockpitDtos1)
          this.$refs.cockpitCard2Col2.init(res.result.cockpitDtos2)
          this.$refs.cockpitCard2Col3.init(res.result.cockpitDtos3)
        }
        this.loading = false
      })
    },
  },
  filters: {
    titleFormat(type) {
      return type === 1 ? '融资机构排名统计' : type === 2 ? '品牌排名统计' : '省份排名统计'
    },
  },
}
</script>
<style lang="less">
.cockpit-card2 {
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
      color: #7088c6;
    }
  }
}
</style>