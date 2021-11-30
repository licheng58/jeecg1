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
                     label="设备序列号">
          <a-input placeholder="请输入设备序列号"
                   v-decorator="['serialNo', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="设备名称">
          <a-input placeholder="请输入设备名称"
                   v-decorator="['name', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="头盔状态">
          <a-select v-decorator="['status', {}]"
                    placeholder="请选择头盔状态">
            <a-select-option :value="1">
              在线
            </a-select-option>
            <a-select-option :value="0">
              离线
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
                     label="设备类型">
          <a-select v-decorator="['type', {}]"
                    placeholder="请选择设备类型">
            <a-select-option value="JX-X21">
              JX-X21
            </a-select-option>
            <!-- <a-select-option value="JX-TKA01">
                    JX-TKA01
                  </a-select-option>
                  <a-select-option value="JX-X20">
                    JX-X20
                  </a-select-option>
                  <a-select-option value="眼镜">
                    眼镜
                  </a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="设备状态 0-未激活 1-已激活未绑定 2-已绑定">
          <a-input placeholder="请输入设备状态 0-未激活 1-已激活未绑定 2-已绑定"
                   v-decorator="['activeStatus', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="客户信息">
          <a-input placeholder="请输入客户信息"
                   v-decorator="['customer', {}]" />
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
  name: 'IndustryHelmetModal',
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
        add: '/industry/industryHelmet/add',
        edit: '/industry/industryHelmet/edit',
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
          pick(this.model, 'serialNo', 'name', 'status', 'deptId', 'type', 'activeStatus', 'customer')
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
/** Button按钮间距 */
.ant-btn {
  margin-left: 30px;
  margin-bottom: 30px;
  float: right;
}
</style>