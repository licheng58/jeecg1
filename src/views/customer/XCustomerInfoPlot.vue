<template>
  <div class="page-customer-plot">
    <a-card :bordered="false" :body-style="{ margin: '0px 0px 16px', padding: '16px 24px 0' }">
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.back()"> 客户管理 </a-breadcrumb-item>
        <a-breadcrumb-item> 客户画像 </a-breadcrumb-item>
      </a-breadcrumb>
      <PageTitle title="客户画像" fontSize="20px">
        <span>查看版本:</span>
        <a-select v-model="queryParam.id" placeholder="请选择查看版本" style="width: 200px" @change="onChange">
          <a-select-option v-for="(item, index) of historyList" :key="index" :value="item.id">{{
            item.createTime
          }}</a-select-option>
        </a-select>
        <a-button @click="$router.back()">返回</a-button>
      </PageTitle>
    </a-card>
    <a-spin :spinning="loading">
      <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0px', padding: '16px' }">
        <div class="card-header-wrapper" slot="title">
          <img class="header-img" src="../../assets/ic_user.png" slot="头像" />
          <div class="header-inner">
            <h1>{{ xcustomerInfo.jmjddm }}</h1>
            <span v-if="xcustomerInfo.ifNew == '0'">{{ xcustomerInfo.code }}</span>
            <span v-else>新开业门店</span>
            <a-divider type="vertical" />
            <span>{{ xcustomerInfo.mdsspp | distFormat('brand_types') }}</span>
            <a-divider type="vertical" />
            <span>{{ xcustomerInfo.ppfzjd | typeFormat(ppfzjd) }}</span>
            <a-divider type="vertical" />
            <span v-if="xcustomerInfo.ifNew == '0'"
              >门店开业时间：{{ xcustomerInfo.mdkysj | moment('YYYY-MM-DD') }}</span
            >
            <span v-else>预计开业时间：{{ xcustomerInfo.mdkysj | moment('YYYY-MM-DD') }}</span>
          </div>
          <div class="header-right">
            <div class="right-tabs">
              <div class="tabs-wrapper">
                <h2>打分卡得分</h2>
                <h1>{{ dfkResult }}</h1>
              </div>
              <div class="tabs-wrapper">
                <h2 class="other">客户评级</h2>
                <h1>—</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="card-wrapper">
          <a-row :gutter="24">
            <a-col :span="6" :offset="2">
              <div :class="`card-item-wrapper`">
                <div class="item-wrapper-header">门店基础信息</div>
                <ul class="item-wrapper-ul">
                  <li v-for="field of customerFields" :key="field.code">
                    <span>{{ field.name }}：</span>
                    <span v-if="field.type === 1">{{ xcustomerInfo[field.code] }}</span>
                    <span v-else-if="field.type === 3">{{ xcustomerInfo[field.code] | moment(field.format) }}</span>
                    <span v-else-if="field.type === 4">{{ xcustomerInfo[field.code] | numberFormat(2) }}</span>
                    <span v-else>{{ xcustomerInfo[field.code] | typeFormat(field.types) }} </span>
                  </li>
                </ul>
              </div>
            </a-col>
            <a-col :span="6">
              <div :class="`card-item-wrapper`">
                <div class="item-wrapper-header">门店运营信息</div>
                <ul class="item-wrapper-ul">
                  <li v-for="field of operationFields" :key="field.code">
                    <span>{{ field.name }}：</span>
                    <span v-if="field.type === 1">{{ xcustomerOperationStatus[field.code] }}</span>
                    <span v-else-if="field.type === 4">{{
                      xcustomerOperationStatus[field.code] | numberFormat(2)
                    }}</span>
                    <span v-else>{{ xcustomerOperationStatus[field.code] | typeFormat(field.types) }} </span>
                  </li>
                </ul>
              </div>
            </a-col>
            <a-col :span="8">
              <div :class="`card-item-wrapper`">
                <div class="item-wrapper-header">投资人信息</div>
                <ul class="item-wrapper-ul">
                  <li v-for="(item, index) of otherCustomerInfos" :key="index">
                    <a-row :gutter="12">
                      <a-col :span="24" style="margin-bottom: 5px">
                        <span>{{ `第${index + 1}大股东名` }}：</span>
                        <span>{{ item.gdxm }} </span>
                      </a-col>
                      <a-col :span="12">
                        <span>持股比例：</span>
                        <span>{{ item.cgbl }}%</span>
                      </a-col>
                      <a-col :span="12">
                        <span>实际出资额：</span>
                        <span>{{ item.sjczje | numberFormat(2) }}万</span>
                      </a-col>
                    </a-row>
                  </li>
                </ul>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
import { ifTypes, jycdsyq, sqwz, dtzjl, ygrs, szcsdf, ppfzjd } from '@/utils/dictionary'
import { filterDictTextByCache } from '@/components/dict/JDictSelectUtil'
import CAL from '@/utils/calculation'

export default {
  components: {},
  data() {
    return {
      loading: false,
      id: Number(this.$route.query.id),
      queryParam: {
        id: '',
      },
      ppfzjd,
      dfkResult: '',
      historyList: [],
      xcustomerInfo: {},
      xcustomerOperationStatus: {},
      otherCustomerInfos: [],
      customerDefaultFields: [
        {
          name: '加盟起始日',
          code: 'jmxyqssj',
          type: 3,
          format: 'YYYY-MM-DD',
        },
        {
          name: '加盟终止日',
          code: 'jmxyqzzsj',
          type: 3,
          format: 'YYYY-MM-DD',
        },
        {
          name: '物业情况',
          code: 'wyqk',
          type: 2,
          types: jycdsyq,
        },
        {
          name: '物业地址',
          code: 'wydz',
          type: 1,
        },
        {
          name: '商圈发展程度',
          code: 'sqfzcd',
          type: 2,
          types: sqwz,
        },
        {
          name: '交通便利度',
          code: 'jtbld',
          type: 2,
          types: dtzjl,
        },
        {
          name: '城市级别',
          code: 'csjb',
          type: 1,
        },
        {
          name: '客房数(间)',
          code: 'kfs',
          type: 4,
        },
        // {
        //   name: '员工数(人)',
        //   code: 'ygrs',
        //   type: 4,
        // },
        {
          name: '历史加盟违约次数',
          code: 'lsjmwycs',
          filter: { code: 'ifNew', value: '0' },
          type: 1,
        },
        {
          name: '已加盟酒店数量',
          code: 'yjmjdsl',
          filter: { code: 'ifNew', value: '0' },
          type: 1,
        },
        {
          name: '可控营收资金比例(%)',
          code: 'kkyszjbl',
          type: 1,
          inputType: 'number',
        },
        {
          name: '是否有过往酒店投资历史',
          filter: { code: 'ifNew', value: '1' },
          code: 'ifygjdtzls',
          type: 2,
          types: ifTypes,
        },
        {
          name: '自筹资金率(%)',
          code: 'zczjl',
          filter: { code: 'ifNew', value: '1' },
          type: 1,
        },
      ],
      operationDefaultFields: [
        {
          name: '当年平均房价(元)',
          code: 'dnpjfj',
          type: 4,
        },
        {
          name: '当年RevPAR(元)',
          code: 'dnRecpar',
          type: 4,
        },
        {
          name: '当年出租率(%)',
          code: 'dnpjczl',
          type: 4,
        },
        {
          name: '租金占营收比(%)',
          code: 'zjzysb',
          type: 4,
        },
        {
          name: '当年累计营收(元)',
          code: 'dnljyshj',
          type: 4,
        },
        {
          name: '当年客房营收(元)',
          code: 'dnkfyshj',
          type: 4,
        },
        {
          name: '当年餐饮营收(元)',
          code: 'dncyyshj',
          type: 4,
        },
        {
          name: '当年其他营收(元)',
          code: 'dnqtyshj',
          type: 4,
        },
        {
          name: '上一自然年度平均月营业收(元)',
          code: 'qyzrndyshj',
          filter: { code: 'ifNew', value: '0' },
          type: 4,
        },
        {
          name: '上一自然年度RevPAR(元)',
          code: 'qyzrnrecpar',
          filter: { code: 'ifNew', value: '0' },
          type: 4,
        },

        {
          name: '下一自然年度预测平均月营业收(元)',
          code: 'hyzrndyshj',
          filter: { code: 'ifNew', value: '1' },
          type: 4,
        },
        {
          name: '下一自然年度预测RevPAR(元)',
          code: 'hyzrnrecpar',
          filter: { code: 'ifNew', value: '1' },
          type: 4,
        },
      ],
      customerFields: [],
      operationFields: [],
      url: {
        queryByCustomerId: '/credit/xCustomerInfoMainLog/queryByCustomerId',
        queryCustomerHistoryDetail: '/credit/xCustomerInfoMainLog/queryCustomerHistoryDetail', //查看
      },
    }
  },

  created() {
    this.getHistoryList()
  },
  methods: {
    getHistoryList() {
      let param = {
        customerId: this.id,
      }
      this.loading = true
      getAction(this.url.queryByCustomerId, param).then((res) => {
        this.loading = false
        if (res.success) {
          this.historyList = res.result

          if (this.historyList.length > 0) {
            this.queryParam.id = this.historyList[0].id
            this.loadPlotData()
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    onChange(value) {
      this.loadPlotData()
    },
    loadPlotData() {
      let param = {
        customerMainLogId: this.queryParam.id,
      }
      this.loading = true
      getAction(this.url.queryCustomerHistoryDetail, param).then((res) => {
        if (res.success) {
          this.xcustomerInfo = res.result.xcustomerInfo
          this.xcustomerOperationStatus = res.result.xcustomerOperationStatus
          this.dfkResult = res.result.dfkResult
          this.otherCustomerInfos = res.result.xcustomerOtherInfos

          this.xcustomerOperationStatus.qyzrndyshj = CAL.accDiv(this.xcustomerOperationStatus.qyzrndyshj, 12)
          this.xcustomerOperationStatus.hyzrndyshj = CAL.accDiv(this.xcustomerOperationStatus.hyzrndyshj, 12)

          this.customerFields = this.customerDefaultFields.filter(
            (item) => !item.filter || item.filter.value === this.xcustomerInfo[item.filter.code]
          )
          this.operationFields = this.operationDefaultFields.filter(
            (item) => !item.filter || item.filter.value === this.xcustomerOperationStatus[item.filter.code]
          )

          // this.xcustomerOperationStatus.occ = this.formatOCC(
          //   this.xcustomerOperationStatus.gyfws,
          //   this.xcustomerCompanyInfo.fjs
          // )
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    formatOCC(gyfws, fjs) {
      console.log(gyfws, fjs)
      try {
        if (!gyfws || !fjs) {
          return 0
        }
        let data = Number(gyfws) / (Number(fjs) * 360)
        return data.toFixed(2)
      } catch (error) {
        return 0
      }
    },
  },
}
</script>
<style lang="less">
.page-customer-plot {
  position: relative;
  .card-header-wrapper {
    width: 100%;
    padding: 2px 0px 7px 16px;
    display: inline-block;
    .header-img {
      width: 72px;
      height: 72px;
      vertical-align: middle;
    }
    .header-inner {
      display: inline-block;
      vertical-align: middle;
      margin-left: 24px;
      h1 {
        display: block;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 28px;
      }
      span {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #7d7d7d;
        line-height: 22px;
      }
    }
    .header-right {
      float: right;
      margin-right: 23px;
      .right-tabs {
        display: inline-block;
        .tabs-wrapper {
          display: inline-block;
          position: relative;
          padding: 0 24px;
          &:not(:last-of-type)::after {
            content: '';
            width: 1px;
            height: 40px;
            display: block;
            position: absolute;
            background: #e9e9e9;
            top: 17px;
            right: 0;
          }
          h2 {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
            line-height: 22px;
            padding: 5px 0 4px 14px;
            text-align: center;
            position: relative;
            &::before {
              content: '';
              width: 6px;
              height: 6px;
              background: #00b700;
              display: inline-block;
              position: absolute;
              border-radius: 50%;
              top: 50%;
              left: 0;
              margin-top: -3px;
            }
            &.other::before {
              background: #fd9e00;
            }
          }
          h1 {
            font-size: 30px;
            font-family: HelveticaNeue;
            color: rgba(0, 0, 0, 0.85);
            line-height: 38px;
            margin: 0;
            text-align: center;
          }
        }
      }
    }
  }
  .card-wrapper {
    width: 100%;
    min-height: 642px;
    position: relative;
    .card-center-wrapper {
      width: 118px;
      height: 118px;
      background: #fef4e7;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -69px;
      margin-left: -69px;
      .inner {
        display: inline-block;
        width: 100px;
        height: 100px;
        background: #f8ca8f;
        margin-top: 9px;
        margin-left: 9px;
        text-align: center;
        border-radius: 50%;
        span {
          display: inline-block;
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 20px;
          &:first-of-type {
            font-size: 14px;
            margin-top: 23px;
            margin-bottom: 5px;
          }
        }
      }
    }
    .card-item-wrapper {
      margin-top: 50px;
      .item-wrapper-header {
        width: 200px;
        height: 40px;
        line-height: 40px;
        background: #4664b4;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        margin: 0 auto;
        text-align: center;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 90px;
          bottom: -12px;
          width: 0;
          height: 0;
          border-width: 6px;
          border-color: #4664b4 transparent transparent transparent;
          border-style: solid;
        }
      }
      .item-wrapper-ul {
        list-style: none;
        border-radius: 10px;
        border: 1px solid #c3c3c3;
        margin-top: 19px;
        padding: 12px 11px;
        min-height: 300px;
        li {
          list-style: none;
          padding: 4px 0px;
          span {
            display: inline-block;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1f1d1d;
            line-height: 20px;

            word-break: break-all;
            &:last-of-type {
              font-weight: 600;
              color: #4664b4;
            }
          }
        }
      }
    }
    .ml50 {
      margin-left: 50px;
    }
  }
}
</style>