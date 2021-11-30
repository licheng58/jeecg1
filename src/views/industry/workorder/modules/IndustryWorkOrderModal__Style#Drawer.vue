<template>
  <a-drawer :title="title"
            :width="800"
            placement="right"
            :closable="false"
            @close="close"
            :visible="visible">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="名称">
          <a-input placeholder="请输入名称"
                   v-decorator="['name', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="状态">
          <a-input-number v-decorator="[ 'status', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="工作流id">
          <a-input placeholder="请输入工作流id"
                   v-decorator="['workFlowId', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="工作流name">
          <a-input placeholder="请输入工作流name"
                   v-decorator="['workFlowName', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="指定部门id">
          <a-input placeholder="请输入指定部门id"
                   v-decorator="['deptId', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="指定部门name">
          <a-input placeholder="请输入指定部门name"
                   v-decorator="['deptName', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="开始时间">
          <a-date-picker showTime
                         format='YYYY-MM-DD HH:mm:ss'
                         v-decorator="[ 'startTime', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="结束时间">
          <a-date-picker showTime
                         format='YYYY-MM-DD HH:mm:ss'
                         v-decorator="[ 'endTime', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="备注">
          <a-textarea placeholder="请输入备注"
                      :rows='3'
                      :maxLength='100'
                      v-decorator="['remake', {}]" />
        </a-form-item>

      </a-form>
    </a-spin>
    <a-button type="primary"
              @click="handleOk">确定</a-button>
    <a-button type="primary"
              @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'IndustryWorkOrderModal',
  data() {
    return {
      title: '操作',
      visible: false,
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
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: '/industry/industryWorkOrder/add',
        edit: '/industry/industryWorkOrder/edit',
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
        this.form.setFieldsValue(
          pick(this.model, 'name', 'status', 'workFlowId', 'workFlowName', 'deptId', 'deptName', 'remake')
        )
        //时间格式化
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
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
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

          console.log(formData)
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
  },
}
</script>

<style lang="less" scoped>
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
</style>