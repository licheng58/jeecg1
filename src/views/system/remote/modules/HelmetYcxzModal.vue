<template>
  <j-modal :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           switchFullscreen
           @ok="handleOk"
           @cancel="handleCancel"
           cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="菊风云code">
          <a-input placeholder="请输入菊风云code"
                   v-decorator="['code', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="用户账号">
          <a-input placeholder="请输入用户账号"
                   v-decorator="['userAcount', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="用户密码">
          <a-input placeholder="请输入用户密码"
                   v-decorator="['passWord', {}]" />
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="设备id">
          <a-input-number v-decorator="[ 'helmetId', {}]" />
        </a-form-item> -->
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="设备名称">
          <a-input placeholder="请输入设备名称" v-decorator="['helmetName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="设备部门">
          <a-input placeholder="请输入设备部门" v-decorator="['helmetDept', {}]" />
        </a-form-item> -->

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  name: 'HelmetYcxzModal',
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
        add: '/industry/helmetYcxz/add',
        edit: '/industry/helmetYcxz/edit',
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
          pick(this.model, 'code', 'userAcount', 'passWord', 'helmetId', 'helmetName', 'helmetDept')
        )
        //时间格式化
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
</style>