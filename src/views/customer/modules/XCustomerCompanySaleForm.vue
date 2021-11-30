<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="月份" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!--  :disabled-date="disabledDate" -->
              <a-month-picker
                :disabled="model.key ? true : false"
                v-decorator="['month', validatorRules.month]"
                placeholder="请选择月份"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="销售额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                type="number"
                v-decorator="['salesVolume', validatorRules.salesVolume]"
                placeholder="请输入销售额"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import { validateDuplicateValue } from '@/utils/util'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JDate from '@/components/jeecg/JDate'
import moment from 'moment'

export default {
  name: 'XCustomerCompanySaleForm',
  components: {
    JFormContainer,
    JDate,
  },
  props: {
    //流程表单data
    formData: {
      type: Object,
      default: () => {},
      required: false,
    },
    //表单模式：true流程表单 false普通表单
    formBpm: {
      type: Boolean,
      default: false,
      required: false,
    },
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      endMonth: '',
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {
        month: {
          rules: [{ required: true, message: '请选择月份!' }],
        },
        salesVolume: {
          rules: [{ required: true, message: '请输入销售额!' }],
        },
      },
      url: {
        add: '/credit/xCustomerCompanySale/add',
        edit: '/credit/xCustomerCompanySale/edit',
        queryById: '/credit/xCustomerCompanySale/queryById',
      },
    }
  },
  computed: {
    formDisabled() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return false
        }
        return true
      }
      return this.disabled
    },
    showFlowSubmitButton() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return true
        }
      }
      return false
    },
  },
  created() {
    //如果是流程中表单，则需要加载流程表单data
    // this.showFlowData()
  },
  methods: {
    add(endMonth) {
      if (endMonth) {
        this.endMonth = endMonth
      }
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'salesVolume'))
        this.form.setFieldsValue({ month: this.model.month ? moment(this.model.month) : null })
      })
    },
    //渲染流程表单数据
    showFlowData() {
      if (this.formBpm === true) {
        let params = { id: this.formData.dataId }
        getAction(this.url.queryById, params).then((res) => {
          if (res.success) {
            this.edit(res.result)
          }
        })
      }
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = Object.assign(this.model, values)
          formData.month = formData.month ? formData.month.format('YYYY-MM') : null
          this.$emit('ok', formData)
          // that.confirmLoading = true
          // let httpurl = ''
          // let method = ''
          // if (!this.model.id) {
          //   httpurl += this.url.add
          //   method = 'post'
          // } else {
          //   httpurl += this.url.edit
          //   method = 'put'
          // }
          // let formData = Object.assign(this.model, values)
          // console.log('表单提交数据', formData)
          // httpAction(httpurl, formData, method)
          //   .then((res) => {
          //     if (res.success) {
          //       that.$message.success(res.message)
          //       that.$emit('ok')
          //     } else {
          //       that.$message.warning(res.message)
          //     }
          //   })
          //   .finally(() => {
          //     that.confirmLoading = false
          //   })
        }
      })
    },
    disabledDate(current) {
      if (this.endMonth) {
        return current && current < moment(this.endMonth).endOf('month')
      }
      return false
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'month', 'salesVolume'))
    },
  },
}
</script>