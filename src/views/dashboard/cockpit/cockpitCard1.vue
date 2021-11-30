<template>
  <div class="cockpit-card1">
    <a-spin :spinning="loading">
      <a-row :gutter="24">
        <a-col :span="8">
          <div class="item-wrapper">
            <div class="item-left">
              <img class="img1" src="@/assets/cockpit-item1.png" alt="信贷投放" />
            </div>
            <div class="item-content">
              <p>信贷投放总额（万元）</p>
              <p>{{ formData.zamount | numberFormat(2, '%万%') }}</p>
              <!-- <p>{{ formData.zamount | numberFormat(2) }}</p> -->

              <!-- <p>
                比上个月<a-icon :type="`arrow-${formData.zamountd < 0 ? 'down' : 'up'}`" />{{
                  formData.zamountd | numberFormat(2, '%', true)
                }}
              </p> -->
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="item-wrapper">
            <div class="item-left">
              <img class="img2" src="@/assets/cockpit-item2.png" alt="放款总数" />
            </div>
            <div class="item-content">
              <p>放款总数（笔）</p>
              <p>{{ formData.isYydh | numberFormat }}</p>
              <!-- <p>
                比上个月<a-icon :type="`arrow-${formData.zamountd < 0 ? 'down' : 'up'}`" />
                {{ formData.isYydhd | numberFormat(2, '%', true) }}
              </p> -->
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="item-wrapper">
            <div class="item-left">
              <img class="img3" src="@/assets/cockpit-item3.png" alt="申请总数" />
            </div>
            <div class="item-content">
              <p>申请总数（笔）</p>
              <p>{{ formData.zcount | numberFormat }}</p>
              <!-- <p>
                比上个月<a-icon :type="`arrow-${formData.zamountd < 0 ? 'down' : 'up'}`" />{{
                  formData.zcountd | numberFormat(2, '%', true)
                }}
              </p> -->
            </div>
          </div>
        </a-col>
        <a-col :span="24">
          <div class="chart-wrapper">
            <PageTitle title="月份统计" fontSize="16px" hasBefore> </PageTitle>
            <cockpitCard1Chart ref="cockpitCard1Chart"></cockpitCard1Chart>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import cockpitCard1Chart from './cockpitCard1Chart'
import { getAction } from '@/api/manage'
import { numCal } from '@/utils/util'
import CAL from '@/utils/calculation'

export default {
  components: {
    cockpitCard1Chart,
  },
  data() {
    return {
      loading: false,
      formData: {
        zamount: 0,
        isYydh: 0,
        zcount: 0,
      },
      dataSource: [],
      url: {
        getData: '/credit/xWarningRecord/cockpit1',
      },
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      getAction(this.url.getData).then((res) => {
        if (res.success && res.result && res.result.length > 0) {
          this.dataSource = res.result
          this.dataSource.map((item) => {
            this.formData.zamount = CAL.accAdd(this.formData.zamount, item.zamount)
            this.formData.isYydh = CAL.accAdd(this.formData.isYydh, item.isYydh)
            this.formData.zcount = CAL.accAdd(this.formData.zcount, item.zcount)
          })
          this.initChart()
        }
        this.loading = false
      })
    },
    initChart() {
      let data = [
        {
          name: '放款总数',
          type: 'bar',
          barMaxWidth: 35,
          yAxisIndex: 0,
          data: [],
        },
        {
          name: '申请总数',
          type: 'bar',
          barMaxWidth: 35,
          yAxisIndex: 0,
          data: [],
        },
        {
          name: '信贷投放金额',
          type: 'line',
          barMaxWidth: 35,
          yAxisIndex: 1,
          data: [],
        },
      ]
      let numData = []
      let mountData = []
      this.dataSource.map((item) => {
        data[0].data.push([item.date, item.isYydh ? item.isYydh : 0])
        data[1].data.push([item.date, item.zcount ? item.zcount : 0])
        data[2].data.push([item.date, item.zamount ? numCal(item.zamount, 2, '万') : 0])
        // data[2].data.push([item.date, item.zamount ? numCal(item.zamount, 2) : 0])
        if (item.isYydh) {
          numData.push(item.isYydh)
        }
        if (item.zcount) {
          numData.push(item.zcount)
        }
        if (item.zamount) {
          mountData.push(numCal(item.zamount, 2, '万'))
        }
      })
      console.log(data, numData, mountData)
      this.$refs.cockpitCard1Chart.initChart(data, numData, mountData)
    },
  },
}
</script>
<style lang="less">
.cockpit-card1 {
  .item-wrapper {
    width: 100%;
    height: 126px;
    background: #ffffff;
    .item-left {
      display: inline-block;
      width: 60px;
      height: 60px;
      background: #f5f7fa;
      margin: 33px 24px 0 40px;
      text-align: center;
      vertical-align: top;
      border-radius: 50%;
      position: relative;
      img {
        width: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -15px;
      }
      .img1 {
        height: 28px;
        margin-top: -14px;
      }
      .img2 {
        height: 31px;
        margin-top: -15px;
      }
      .img3 {
        height: 33px;
        margin-top: -16px;
      }
    }
    .item-content {
      display: inline-block;
      vertical-align: top;
      margin-top: 18px;

      p {
        font-size: 34px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #1b1617;
        line-height: 45px;
        margin-bottom: 4px;

        &:first-of-type {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #99999a;
          line-height: 20px;
        }
        // &:last-of-type {
        //   font-size: 12px;
        //   font-family: MicrosoftYaHei;
        //   color: #99999a;
        //   font-weight: 400;
        //   line-height: 16px;
        // }
        .anticon-arrow-up {
          color: #4cb325;
        }
        .anticon-arrow-down {
          color: #eb4e33;
        }
      }
    }
  }
  .chart-wrapper {
    margin: 30px 0 0;
    padding: 0 16px 24px;
    width: 100%;
    background: #ffffff;
  }
}
</style>