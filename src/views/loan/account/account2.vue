<template>
  <div>
    <a-spin :spinning="loading">
      <a-form class="my-descriptions-form" :form="form" labelAlign="left" layout="horizontal">
        <a-row :gutter="0">
          <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
            <a-form-item :required="field.required" :label="field.name">
              <span v-if="[2, 3].includes(field.type)">
                <a-input
                  :value="model[field.code] | typeFormat(field.types)"
                  disabled
                  :suffix="field.unit ? field.unit : ''"
                />
              </span>
              <span v-else>
                <comInput
                  :value="model[field.code]"
                  disabled
                  :type="field.inputType ? field.inputType : 'text'"
                  :unit="field.unit ? field.unit : ''"
                /> </span
            ></a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <PageTitle title="贷款回执信息" fontSize="16px" hasBefore> </PageTitle>
      <div class="standard-table-container p0">
        <a-table
          ref="table"
          class="standard-table"
          size="small"
          rowKey="id"
          :bordered="false"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
        >
        </a-table>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { filterObj } from '@/utils/util.js'
import { customerType, ifTypes, sexTypes, kxyt, ywbz } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import { getAction, postAction } from '@/api/manage'
export default {
  components: {},
  data() {
    return {
      fieldList: [
        {
          name: '客户类型',
          code: 'customerType',
          type: 2,
          types: customerType,
          span: 8,
          required: true,
        },
        {
          name: '主借人',
          code: 'zjr',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '申请金额',
          code: 'amount',
          inputType: 'number',
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
          unit: '万元',
        },

        {
          name: '申请期限',
          code: 'qx',
          inputType: 'number',
          type: 1,
          span: 8,
          required: true,
          unit: '月',
        },

        {
          name: '是否异地贷款',
          code: 'isYddk',
          type: 3,
          types: ifTypes,
          span: 8,
          required: true,
        },

        {
          name: '款项用途',
          code: 'kxyt',
          type: 2,
          types: kxyt,
          span: 8,
          required: true,
        },
        {
          name: '还款来源',
          code: 'hkly',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '合作方名称',
          code: 'partnerName',
          type: 1, //1 input  2 select 3 radio
          span: 8,
          required: true,
        },
        {
          name: '合作方产品',
          code: 'partnerProName',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '业务品种',
          code: 'ywpz',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '业务币种',
          code: 'ywbz',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '最终审批额度',
          code: 'zzsped',
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
          unit: '万元',
        },
        {
          name: '贷款期限',
          code: 'dkqx',
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
          unit: '月',
        },
        {
          name: '贷款利率',
          code: 'zzspll',
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
          unit: '%',
        },
        {
          name: '贷款申请日期',
          code: 'sqsj',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '计息方式',
          code: 'jxfs',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '还款方式',
          code: 'hkfs',
          type: 1,
          span: 8,
          required: true,
        },
      ],
      model: {},
      id: Number(this.$route.query.id),
      loading: false,
      form: this.$form.createForm(this),
      otherInfos: [],
      dataSource: [],
      columns: [
        {
          title: '交易流水号',
          dataIndex: 'paydebtNo',
          width: 150,
          align: 'center',
        },
        {
          title: '贷款金额(元)',
          dataIndex: 'debtMny',
          align: 'center',
          width: 100,
        },
        {
          title: '贷款日期',
          dataIndex: 'loanApplyDate',
          width: 150,
          align: 'center',
          // customRender: function (t, r, index) {
          //   return t ? moment(t).format('YYYY-MM-DD') : ''
          // },
        },
        {
          title: '还款金额(元)',
          dataIndex: 'repaymentAmount',
          align: 'center',
          width: 100,
        },
        {
          title: '还款日期',
          dataIndex: 'repaymentDate',
          width: 150,
          align: 'center',
          // customRender: function (t, r, index) {
          //   return t ? moment(t).format('YYYY-MM-DD') : ''
          // },
        },
        {
          title: '还款截止日期',
          dataIndex: 'repaymentClosingDate',
          width: 150,
          align: 'center',
          // customRender: function (t, r, index) {
          //   return t ? moment(t).format('YYYY-MM-DD') : ''
          // },
        },
        {
          title: '贷款余额(元)',
          dataIndex: 'dkyeAmount',
          align: 'center',
          width: 100,
        },
      ],
      url: {
        queryById: '/credit/xTask/queryById',
      },
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    getDetails() {
      let param = {
        id: this.id,
      }
      this.loading = true
      getAction(this.url.queryById, param).then((res) => {
        if (res.success) {
          this.initData(res.result.xtask)
          // this.otherInfos = res.result.otherInfos
          if (res.result.zyqtPayments) {
            this.dataSource = res.result.zyqtPayments
          }
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    initData(record) {
      // this.$refs.account2Card.init(record)
      if (record) {
        this.model = Object.assign({}, record)
      }
    },
  },
}
</script>