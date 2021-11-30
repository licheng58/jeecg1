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
                     label="产品型号">
          <a-input placeholder="请输入产品型号"
                   v-decorator="['productNo', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="产品类别">
          <!-- <a-input placeholder="请输入产品类别"
                   v-decorator="['productType', {}]" /> -->

          <a-select v-decorator="['productType', {}]"
                    placeholder="请选择产品类别">
            <a-select-option value="1">
              中德热水器
            </a-select-option>
            <a-select-option value="2">
              其他
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="部门ID">
          <a-input placeholder="请输入部门ID"
                   v-decorator="['deptId', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="部门姓名">
          <a-input placeholder="请输入部门姓名"
                   v-decorator="['deptName', {}]" />
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
  name: 'IndustryProductModal',
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
        add: '/industry/industryProduct/add',
        edit: '/industry/industryProduct/edit',
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
        this.form.setFieldsValue(pick(this.model, 'productNo', 'productType', 'deptId', 'deptName'))
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
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
</style>