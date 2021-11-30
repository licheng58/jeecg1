<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="申请流水号">
              <CustomerSelect
                placeholder="请输入申请流水号"
                v-decorator="['taskNo', {}]"
                valueCode="task_no"
                :type="2"
                @select="taskNoSelect"
              ></CustomerSelect>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="客户类型">
              <a-select v-decorator="['customerType', {}]" placeholder="请选择客户类型" allowClear disabled>
                <a-select-option v-for="(value, key, index) of customerType" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="客户名称">
              <a-input placeholder="请输入客户名称" v-decorator="['xm', {}]" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="业务品种">
              <a-select v-decorator="['ywpz', {}]" placeholder="请选择业务品种" allowClear disabled>
                <a-select-option v-for="(value, key, index) of ywpz" :key="index" :value="value">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="业务币种">
              <a-select v-decorator="['ywbz', {}]" placeholder="请选择业务币种" allowClear disabled>
                <a-select-option v-for="(value, key, index) of ywbz" :key="index" :value="value">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="贷款金额(元)">
              <a-input placeholder="请输入贷款金额(元)" v-decorator="['dkje', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="分类月份">
              <a-month-picker placeholder="请输入分类月份" v-decorator="['month', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="资产分类结果">
              <a-select v-decorator="['xtzcfl', {}]" placeholder="请选择资产分类结果" allowClear>
                <a-select-option v-for="(value, key, index) of zcfl" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { customerType, zcfl, tzzcflStatus, ywbz, ywpz } from '@/utils/dictionary'

export default {
  name: 'XTaskAssetModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      customerType,
      zcfl,
      ywpz,
      ywbz,
      tzzcflStatus,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: '/credit/xTaskAsset/add',
        edit: '/credit/xTaskAsset/edit',
      },
    }
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'taskNo', 'customerType', 'xm', 'dkje', 'ywpz', 'ywbz', 'xtzcfl'))
        //时间格式化
        this.form.setFieldsValue({ month: this.model.month ? moment(this.model.month) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
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
          formData.month = formData.month ? moment(formData.month).format('YYYY-DD') : ''
          //时间格式化
          formData.status = 0
          httpAction(httpurl, formData, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    taskNoSelect(customer) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          customerType: customer.customer_type,
          xm: customer.zjr,
          ywpz: customer.ywpz,
          ywbz: customer.ywbz,
          dkje: customer.loan_amount,
        })
        this.model.taskId = customer.id
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>