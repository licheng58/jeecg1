<template>
  <div>
    <a-form class="my-descriptions-form" :form="form" labelAlign="left" layout="horizontal" v-if="isShow">
      <a-row :gutter="0">
        <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
          <a-form-item v-if="type === 2" :required="field.required" :label="field.name">
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
              />
            </span>
          </a-form-item>
          <a-tooltip :title="field.errMsg" v-else>
            <a-form-item :label="field.name">
              <comInput
                v-if="field.type === 1"
                v-decorator="[field.code, field.rules]"
                :placeholder="field.placeholder ? field.placeholder : ''"
                :type="field.inputType ? field.inputType : 'text'"
                :unit="field.unit ? field.unit : ''"
              />
              <a-select v-if="field.type === 2" v-decorator="[field.code, field.rules]">
                <a-select-option v-for="(value, key, index) of field.types" :key="index" :value="key">{{
                  value
                }}</a-select-option>
              </a-select>
              <a-radio-group v-if="field.type === 3" v-decorator="[field.code, field.rules]">
                <a-radio v-for="(item, index) of field.types" :key="index" :value="item.value">
                  {{ item.name }}
                </a-radio>
              </a-radio-group>
              <a-date-picker v-if="field.type === 4" v-decorator="[field.code, field.rules]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-tooltip>
        </a-col>
      </a-row>
    </a-form>
    <a-empty v-else :image="simpleImage" />
  </div>
</template>
<script>
import { filterObj, numCal } from '@/utils/util'
import { customerType, ifTypes, sexTypes } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import { getAction } from '@/api/manage'
import { isMobile } from '@/utils/validate'
import { Empty } from 'ant-design-vue'
import { mapGetters } from 'vuex'

export default {
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  data() {
    return {
      fieldList: [
        {
          name: '银企通企业编号',
          code: 'CORP_ID',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入银企通企业编号' }] },
          required: true,
        },
        {
          name: '手机银行注册邮编',
          code: 'POST_CODE',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入手机银行注册邮编' }] },
          required: true,
        },
        {
          name: '手机银行注册地址',
          code: 'ADDRESS',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入手机银行注册地址' }] },
          required: true,
        },
        {
          name: '手机银行注册手机号',
          code: 'DEPUTY_TEL',
          type: 1,
          span: 8,
          rules: {
            rules: [{ required: true, message: '请输入手机银行注册手机号' }, { validator: this.phoneValidator }],
          },
          required: true,
        },
        {
          name: '近一年订单金额(元)',
          code: 'YEAR_MNY',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入近一年订单金额' }] },
          required: true,
        },
        {
          name: '近一年退货金额(元)',
          code: 'RETURN_MNY',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入近一年退货金额' }] },
          required: true,
        },
        {
          name: '前一年订单金额(元)',
          code: 'BEFORE_YEAR_MNY',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入前一年订单金额' }] },
          required: true,
        },
        {
          name: '近一年回款额(元)',
          code: 'YEAR_PAYABLE',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入近一年回款额' }] },
          required: true,
        },

        {
          name: '近三个月订单金额(元)',
          code: 'THREE_MONTH_MNY',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入近三个月订单金额' }] },
          required: true,
        },

        {
          name: '近一年月均订单金额(元)',
          code: 'AVG_MONTH_MNY',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入近一年月均订单金额' }] },
          required: true,
        },
        {
          name: '近两年订单总额(元)',
          code: 'TOW_YEAR_MNY',
          type: 1,
          inputType: 'number',
          span: 16,
          rules: { rules: [{ required: true, message: '请输入近两年订单总额' }] },
          required: true,
        },
      ],
      isShow: false,
      record: {},
      model: {
        CORP_ID: this.userInfo().CORP_ID,
        RETURN_MNY: 0,
        YEAR_PAYABLE: 0,
      },
      handleInfo: {},
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
      url: {
        queryOperationStatus: '/credit/xTask/queryOperationStatus',
      },
    }
  },
  created() {},
  methods: {
    ...mapGetters(['userInfo']),
    init(record) {
      this.record = record
      if (record.partnerName === '建设银行' && record.partnerProName === '个人快贷') {
        this.isShow = true
      }
      if (this.isShow && record.partnerNeed) {
        this.$nextTick(() => {
          let partnerNeed = JSON.parse(record.partnerNeed)
          this.model = Object.assign({}, partnerNeed)
          if (this.type !== 2) {
            let dateField = {}
            //时间格式数据先转换格式
            this.fieldList
              .filter((item) => item.type === 4)
              .map((item) => {
                dateField[item.code] = this.model[item.code] ? moment(this.model[item.code]) : null
              })
            let fields = this.fieldList
              .filter((item) => item.type !== 4)
              .map((item) => {
                return item.code
              })
            dateField = Object.assign(pick(this.model, fields), dateField)
            this.form.setFieldsValue(dateField)
          }
        })
      }
    },
    initForm() {
      this.$nextTick(() => {
        let dateField = {}
        //时间格式数据先转换格式
        this.fieldList
          .filter((item) => item.type === 4)
          .map((item) => {
            dateField[item.code] = this.model[item.code] ? moment(this.model[item.code]) : null
          })
        let fields = this.fieldList
          .filter((item) => item.type !== 4)
          .map((item) => {
            return item.code
          })
        dateField = Object.assign(pick(this.model, fields), dateField)
        this.form.setFieldsValue(dateField)
      })
    },

    //是否显示 建行个贷 的合作方
    showChange(isShow) {
      this.isShow = isShow
      if (this.isShow) {
        this.initForm(this.model)
      }
    },
    onValuesChange(props, values) {
      let keys = Object.keys(values)
      if (keys.length != 1) {
        return
      }
      this.$nextTick(() => {
        let errMsgs = props.form.getFieldError(keys[0])
        let index = this.fieldList.findIndex((item) => item.code === keys[0])
        if (errMsgs) {
          this.fieldList[index].errMsg = errMsgs.join(',')
          this.$forceUpdate()
        } else if (this.fieldList[index].errMsg) {
          this.fieldList[index].errMsg = ''
          this.$forceUpdate()
        }
      })
    },

    getData(status) {
      if (status === 1) {
        let isErr = false
        this.form.validateFields((err, values) => {
          if (err) {
            isErr = true
            this.$nextTick(() => {
              let errKeys = Object.keys(err)
              errKeys.map((key) => {
                let index = this.fieldList.findIndex((item) => item.code === key)
                if (index > -1) {
                  this.fieldList[index].errMsg = err[key].errors
                    .map((item) => {
                      return item.message
                    })
                    .join(',')
                }
              })
              this.$forceUpdate()
            })
          }
        })
        if (isErr) {
          this.$message.warning('请检查合作方所需信息必填验证!')
          return false
        }
      }
      let formData = Object.assign(this.model, this.form.getFieldsValue())
      this.fieldList
        .filter((item) => item.type === 4)
        .map((item) => {
          formData[item.code] = formData[item.code] ? formData[item.code].format('YYYY-MM-DD') : null
        })
      formData = filterObj(formData)
      if (Object.keys(formData).length === 0) {
        return ''
      }
      return formData
    },
    //查询 运营数据
    queryYyData(id) {
      const param = {
        customerId: id,
      }
      getAction(this.url.queryOperationStatus, param).then((res) => {
        if (res.success) {
          this.model.THREE_MONTH_MNY = numCal(res.result.threeValuesMonth, 4)
          this.model.YEAR_MNY = numCal(res.result.fristValuesNear, 4)
          this.model.AVG_MONTH_MNY = numCal(res.result.fristValuesNearAVG, 4)
          this.model.TOW_YEAR_MNY = numCal(res.result.secondValuesNear, 4)
          this.model.BEFORE_YEAR_MNY = numCal(res.result.fristValuesLast, 4)
          this.model.TOW_YEAR_MNY = numCal(res.result.secondValuesLast, 4)
          if (this.isShow) {
            this.initForm(this.model)
          }
        }
      })
    },
    phoneValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (!isMobile(value)) {
        callback('手机号码格式不正确!')
      }
      callback()
    },
  },
}
</script>
