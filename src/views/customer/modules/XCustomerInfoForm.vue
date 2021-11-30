<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="客户类型：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="['customerType']" placeholder="请选择客户类型" allowClear>
                <a-select-option v-for="(value, key, index) of customerType" :key="index" :value="key">{{
                  value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="借款人姓名：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['xm']" placeholder="请输入借款人姓名"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="证件类型：" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select v-decorator="['zjlx']" placeholder="请选择证件类型" allowClear>
                <a-select-option v-for="(value, key, index) of zjType" :key="index" :value="key">{{
                  value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="证件号码：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['zjhm']" placeholder="请输入证件号码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话：" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lxdh']" placeholder="请输入联系电话"></a-input>
            </a-form-item>
          </a-col>

          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm" :loading="confirmLoading">提 交</a-button>
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
import { customerType,zjType } from '@/utils/dictionary'

export default {
  name: 'XCustomerInfoForm',
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
      customerType,
      zjType,
      form: this.$form.createForm(this),
      model: {},
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
      confirmLoading: false,
      validatorRules: {},
      url: {
        add: '/credit/xCustomerInfo/add',
        edit: '/credit/xCustomerInfo/edit',
        queryById: '/credit/xCustomerInfo/queryById',
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
    add() {
      this.edit({ status: 0 })
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'customerType', 'xm', 'zjlx', 'zjhm', 'lxdh'))
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
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          console.log('表单提交数据', formData)
          httpAction(httpurl, formData, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok', res.result.xcustomerInfo)
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'customerType', 'xm', 'zjlx', 'zjhm', 'lxdh'))
    },
  },
}
</script>