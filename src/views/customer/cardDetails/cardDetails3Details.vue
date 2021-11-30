<template>
  <div>
    <a-form class="my-descriptions-form" :form="form" labelAlign="left" layout="horizontal">
      <a-row :gutter="0">
        <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
          <a-form-item
            v-if="[1, 2, 4].includes(type)"
            :required="field.required"
            :label="field.name"
            :class="{
              'field-ative': fieldAtive(field.code),
            }"
          >
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
            <a-form-item :required="field.required" :label="field.name">
              <comInput
                v-if="field.type === 1"
                v-decorator="[field.code, field.rules]"
                :placeholder="field.placeholder ? field.placeholder : ''"
                :type="field.inputType ? field.inputType : 'text'"
                :unit="field.unit ? field.unit : ''"
              />
              <!-- <template v-if="field.type === 1">
                <a-input-number v-if="field.inputType === 'number'" v-decorator="[field.code, field.rules]" />
                <a-input v-else v-decorator="[field.code, field.rules]" :suffix="field.unit ? field.unit : ''" />
              </template> -->
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
import { filterObj } from '@/utils/util.js'
import { ifTypes2, zjType, gdType } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import { isIdCard, isMobile, isCreditCode } from '@/utils/validate'

export default {
  props: {
    type: {
      type: Number,
      default: 0,
    },
    record: {
      type: Object,
      default: () => {},
    },
    handleInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      fieldList: [],
      companyFieldList: [
        {
          name: '股东类型',
          code: 'type',
          type: 3,
          types: gdType,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入股东类型' }] },
          required: true,
        },
        {
          name: '股东名称',
          code: 'gdxm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入股东名称!' }] },
          required: true,
        },
        {
          name: '持股比例',
          code: 'cgbl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入持股比例(%)!' }, { validator: this.cgblValidator }] },
          required: true,
          unit: '%',
        },
        {
          name: '实际出资金额',
          code: 'sjczje',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入实际出资金额!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '工商注册名称',
          code: 'gszcmc',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入工商注册名称!' }] },
          required: true,
        },
        {
          name: '统一社会信用代码',
          code: 'tyshxydm',
          type: 1,
          span: 8,
          rules: {
            rules: [{ required: true, message: '请输入统一社会信用代码!' }, { validator: this.tyshxydmValidator }],
          },
          required: true,
        },
        {
          name: '注册资本',
          code: 'zczb',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入注册资本!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '联系人',
          code: 'lxr',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入联系人!' }] },
          required: true,
        },
        {
          name: '联系方式',
          code: 'lxfs',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入联系方式!' }, { validator: this.phoneValidator }] },
          required: true,
        },

        {
          name: '实际营业地址',
          code: 'sjjydz',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入实际营业地址!' }] },
          required: true,
        },

        {
          name: '是否涉诉',
          code: 'sfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入是否涉诉!' }] },
          required: true,
        },
        {
          name: '是否有征信疑问',
          code: 'sfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入是否有征信疑问!' }] },
          required: true,
        },
        {
          name: '征信疑问说明',
          code: 'zxywsm',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
        {
          name: '法定代表人姓名',
          code: 'xm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入法定代表人姓名!' }] },
          required: true,
        },

        {
          name: '证件类型',
          code: 'zjlx',
          type: 2,
          types: zjType,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择证件类型!' }] },
          required: true,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入证件号码!' }, { validator: this.zjhmValidator }] },
          required: true,
        },
        {
          name: '是否涉诉',
          code: 'fdsfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否涉诉!' }] },
          required: true,
        },
        {
          name: '是否有征信疑问',
          code: 'fdsfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          rules: { rules: [{ required: true, message: '请选择是否有征信疑问!' }] },
          required: true,
        },
        {
          name: '征信疑问说明',
          code: 'fdzxywsm',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
        {
          name: '实际控制人姓名',
          code: 'sjxm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入实际控制人姓名!' }] },
          required: true,
        },

        {
          name: '证件类型',
          code: 'sjzjlx',
          type: 2,
          types: zjType,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择证件类型!' }] },
          required: true,
        },
        {
          name: '证件号码',
          code: 'sjzjhm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入证件号码!' }, { validator: this.zjhmValidator }] },
          required: true,
        },
        {
          name: '是否涉诉',
          code: 'sjsfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否涉诉!' }] },
          required: true,
        },
        {
          name: '是否有征信疑问',
          code: 'sjsfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          rules: { rules: [{ required: true, message: '请选择是否有征信疑问!' }] },
          required: true,
        },
        {
          name: '征信疑问说明',
          code: 'sjzxywsm',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
      ],
      personFieldList: [
        {
          name: '股东类型',
          code: 'type',
          type: 3,
          types: gdType,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择股东类型!' }] },
          required: true,
        },
        {
          name: '股东名称',
          code: 'gdxm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入股东名称!' }] },
          required: true,
        },
        {
          name: '持股比例',
          code: 'cgbl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入持股比例(%)!' }, { validator: this.cgblValidator }] },
          required: true,
          unit: '%',
        },
        {
          name: '实际出资金额',
          code: 'sjczje',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入实际出资金额!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '证件类型',
          code: 'zjlx',
          type: 2,
          types: zjType,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择证件类型!' }] },
          required: true,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入证件号码!' }, { validator: this.zjhmValidator }] },
          required: true,
        },

        {
          name: '联系方式',
          code: 'lxfs',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入联系方式!' }, { validator: this.phoneValidator }] },
          required: true,
        },

        {
          name: '联系地址',
          code: 'sjjydz',
          type: 1,
          span: 16,
          rules: { rules: [{ required: true, message: '请输入联系地址!' }] },
          required: true,
        },

        {
          name: '是否涉诉',
          code: 'sfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否涉诉!' }] },
          required: true,
        },
        {
          name: '是否有征信疑问',
          code: 'sfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          rules: { rules: [{ required: true, message: '请选择是否有征信疑问!' }] },
          required: true,
        },
        {
          name: '征信疑问说明',
          code: 'zxywsm',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
      ],
      model: {},
      uploadFields: [],
      uploadFieldData: {},
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
    }
  },

  computed: {
    fieldAtive: function () {
      return function (code) {
        return (
          this.uploadFieldData.hasOwnProperty(code) &&
          (this.type == 4 ||
            ((this.handleInfo.role === '1' || this.handleInfo.ifCheck === 1) && this.handleInfo.status === 2))
        )
      }
    },
  },
  created() {
    this.fieldList = this.companyFieldList
    if (this.record.type === 2) {
      this.fieldList = this.personFieldList
    }
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.model = Object.assign({}, this.record)
        if (this.record.lastUpdataIndex) {
          let uploadData = JSON.parse(this.record.lastUpdataIndex)
          //修改人跟审批人查看 修改记录
          if ((this.handleInfo.role === '1' || this.handleInfo.ifCheck === 1) && this.handleInfo.status === 2) {
            this.model = Object.assign(this.model, uploadData)
          }
          if (this.type !== 3) {
            this.uploadFieldData = uploadData
          }
        }
        if ([0, 3].includes(this.type)) {
          let dateField = {}
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
    },
    onValuesChange(props, values) {
      let keys = Object.keys(values)
      if (keys.length > 1) {
        return
      }
      // this.uploadFieldData = Object.assign(this.uploadFieldData, values)
      // if (values[keys[0]] === this.model[keys[0]]) {
      //   delete this.uploadFieldData[keys[0]]
      // }
      if (keys[0] === 'type') {
        this.fieldList = values[keys[0]] === 1 ? this.companyFieldList : this.personFieldList
        this.fieldList
          .filter((item) => item.errMsg)
          .map((item) => {
            item.errMsg = ''
          })
        props.form.resetFields()
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
    getUpdateField() {
      return JSON.stringify(this.uploadFieldData)
    },

    getData(type) {
      if (type === 1) {
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
          return false
        }
      }
      let fieldsValue = Object.assign({}, this.form.getFieldsValue())
      //时间字段
      this.fieldList
        .filter((item) => item.type === 4)
        .map((item) => {
          fieldsValue[item.code] = fieldsValue[item.code] ? fieldsValue[item.code].format('YYYY-MM-DD') : null
        })
      //修改申请 记录修改的字段
      if (this.type === 3) {
        let uploadFieldData = {}
        Object.keys(fieldsValue)
          .filter((key) => !(!fieldsValue[key] && !this.model[key]) && fieldsValue[key] !== this.model[key])
          .map((key) => {
            uploadFieldData[key] = fieldsValue[key]
          })
        fieldsValue.lastUpdataIndex = JSON.stringify(uploadFieldData)
      }
      let formData = filterObj(Object.assign(this.model, fieldsValue))
      if (Object.keys(formData).length === 0) {
        return null
      }
      return formData
    },
    //身份证验证
    zjhmValidator(rule, value, callback) {
      console.log(rule)
      if (!value) {
        callback()
      }
      let typeName = 'zjlx'
      if (rule.field === 'sjzjhm') {
        typeName = 'sjzjlx'
      }
      let zjlx = this.form.getFieldValue(typeName)
      if (zjlx === '1' && !isIdCard(value)) {
        callback('身份证号码格式不正确!')
      }
      callback()
    },
    // 统一社会信用代码
    tyshxydmValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (!isCreditCode(value)) {
        callback('统一社会信用代码格式不正确!')
      }
      callback()
    },
    //手机号码
    phoneValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (!isMobile(value)) {
        callback('手机号码格式不正确!')
      }
      callback()
    },
    //持股比例 限制>0,<=100
    cgblValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (value < 0 || value > 100) {
        callback('持股比例>0,<=100!')
      }
      callback()
    },
  },
}
</script>