<template>
  <div>
    <a-form class="my-descriptions-form" :form="form" labelAlign="left" layout="horizontal">
      <a-row :gutter="0">
        <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
          <a-form-item v-if="!isEdit" :required="field.required" :label="field.name">
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
  </div>
</template>
<script>
import { filterObj, numCal } from '@/utils/util'
import { customerType, ifTypes, sexTypes } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import { getAction } from '@/api/manage'

export default {
  data() {
    return {
      fieldList: [],
      fieldDefaultList: [
        {
          name: '打分卡得分',
          code: 'dfkdfjg',
          type: 1, //1 input  2 select 3 radio
          span: 8,
          rules: { rules: [{ required: true, message: '请输入打分卡得分!' }] },
          required: true,
        },
        {
          name: '客户评级',
          code: 'jykhpj',
          type: 1,
          span: 8,
          rules: {},
          required: false,
        },
        {
          name: '贷款期限',
          code: 'qx',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入客户评级!' }] },
          required: true,
          unit: '月',
        },
        {
          name: '申请金额',
          code: 'amount',
          inputType: 'number',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入申请金额!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '建议贷款额度',
          code: 'jydked',
          inputType: 'number',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入建议贷款额度!' }, { validator: this.jydkedValidator }] },
          required: true,
          unit: '万元',
        },
        {
          name: '建议贷款利率',
          code: 'jydkll',
          inputType: 'number',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入建议贷款利率!' }, { validator: this.handlevalidator4 }] },
          required: true,
          unit: '%',
        },
        {
          name: '偿债保障比率',
          code: 'czbzbl',
          inputType: 'number',
          filter: [{ code: 'kxyt', value: '3' }],
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入EBITDA率!' }] },
          required: true,
          unit: '%',
        },
        {
          name: '建议贷款意见',
          code: 'jydkyj',
          type: 1,
          span: 24,
          rules: { rules: [{ required: true, message: '请输入建议贷款意见!' }] },
          required: true,
        },
        {
          name: '最终审批额度',
          code: 'zzsped',
          inputType: 'number',
          filter: [
            { code: 'status', value: 3 },
            { code: 'status', value: 4 },
          ],
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入最终审批额度!' }, { validator: this.zzspedValidator }] },
          required: true,
          unit: '万元',
        },
        {
          name: '最终审批利率',
          code: 'zzspll',
          inputType: 'number',
          filter: [
            { code: 'status', value: 3 },
            { code: 'status', value: 4 },
          ],
          type: 1,
          span: 16,
          rules: { rules: [{ required: true, message: '请输入最终审批利率!' }, { validator: this.handlevalidator4 }] },
          required: true,
          unit: '%',
        },
      ],
      model: {},
      role: '',
      isEdit: false,
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
      url: {
        queryDfk: '/credit/xCustomerInfoMainLog/queryDafenkaByCustomerId',
      },
    }
  },

  methods: {
    init(record, isEdit) {
      this.fieldDefaultList[7].span = record.kxyt === '3' ? 16 : 24
      this.fieldList = this.fieldDefaultList.filter(
        (item) => !item.filter || item.filter.some((data) => data.value === record[data.code])
      )

      if (record.status === 1) {
        this.queryDfk(record.customerId)
      }
      this.isEdit = isEdit
      if (record) {
        this.$nextTick(() => {
          this.model = Object.assign({}, record)
          if (this.isEdit) {
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

            //查询打分卡
          }
        })
      }
    },
    onValuesChange(props, values) {
      let keys = Object.keys(values)
      if (keys.length > 1) {
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

    getData() {
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
        this.$message.warning('请检查授信页面必填验证!')
        return false
      }
      let formData = Object.assign({}, this.form.getFieldsValue())
      this.fieldList
        .filter((item) => item.type === 4)
        .map((item) => {
          formData[item.code] = formData[item.code] ? formData[item.code].format('YYYY-MM-DD') : null
        })
      return formData
    },
    //查询 打分卡
    queryDfk(id) {
      const param = {
        customerId: id,
      }
      getAction(this.url.queryDfk, param).then((res) => {
        if (res.success) {
          this.$nextTick(() => {
            this.form.setFieldsValue({
              dfkdfjg: numCal(res.result, 4),
            })
          })
        }
      })
    },
    //建议贷款额度
    jydkedValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      let amount = this.form.getFieldValue('amount')
      if (!amount && amount !== 0) {
        callback()
      }

      if (value > amount) {
        callback('建议贷款额度<=申请额度!')
      }
      callback()
    },
    //最终审批额度
    zzspedValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      let jydked = this.form.getFieldValue('jydked')
      if (!jydked && jydked !== 0) {
        callback()
      }
      if (value > jydked) {
        callback('最终审批额度<=建议额度!')
      }
      callback()
    },
    handlevalidator4(rule, value, callback) {
      let valueStr = value + ''
      let arr = valueStr.split('.')
      if (arr.length >= 2 && arr[1].length > 4) {
        callback('小数点最多保留四位！')
      }
      callback()
    },
  },
}
</script>