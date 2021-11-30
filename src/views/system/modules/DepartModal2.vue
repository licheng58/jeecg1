<template>
  <a-modal :title="title"
           :width="800"
           :ok="false"
           :visible="visible"
           :confirmLoading="confirmLoading"
           :okButtonProps="{ props: { disabled: disableSubmit } }"
           @ok="handleOk"
           @cancel="handleCancel"
           cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="机构名称"
                     :hidden="false"
                     hasFeedback>
          <a-input id="departName"
                   placeholder="请输入机构/机构名称"
                   v-decorator="['departName', validatorRules.departName]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="机构编码">
          <a-input placeholder="请输入机构编码"
                   v-decorator="['orgCode', validatorRules.orgCode]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="银企通企业编号">
          <a-input placeholder="请输入银企通企业编号"
                   v-decorator="['fax', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="上级机构"
                     hasFeedback>
          <a-tree-select style="width: 100%"
                         :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                         :treeData="departTree"
                         v-decorator="['parentId', validatorRules.parentId]"
                         placeholder="暂无"
                         allowClear>
          </a-tree-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="联系电话">
          <a-input placeholder="请输入联系电话"
                   v-decorator="['mobile', validatorRules.mobile]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="地址">
          <a-input placeholder="请输入地址"
                   v-decorator="['address', {}]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="排序">
          <a-input-number v-decorator="['departOrder', { initialValue: 0 }]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="备注">
          <a-textarea placeholder="请输入备注"
                      :rows='3'
                      :maxLength='100'
                      v-decorator="['memo', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import { queryIdTree } from '@/api/api'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'SysDepartModal',
  components: { ATextarea },
  data() {
    return {
      departTree: [],
      orgTypeData: [],
      phoneWarning: '',
      departName: '',
      title: '操作',
      seen: false,
      visible: false,
      condition: true,
      disableSubmit: false,
      model: {},
      menuhidden: false,
      menuusing: true,
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
      validatorRules: {
        departName: { rules: [{ required: true, message: '请输入机构/机构名称!' }] },
        orgCode: { rules: [{ required: true, message: '请输入机构编码!' }] },
        mobile: { rules: [{ validator: this.validateMobile }] },
      },
      url: {
        add: '/sys/sysDepart/add',
        edit: '/sys/sysDepart/edit',
      },
      dictDisabled: true,
    }
  },
  created() {},
  methods: {
    loadTreeData() {
      var that = this
      queryIdTree().then((res) => {
        if (res.success) {
          that.departTree = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.departTree.push(temp)
          }
        }
      })
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.loadTreeData()
      this.form.resetFields()
      this.model = Object.assign({}, record)
      if (this.model.hasOwnProperty('parentId')) {
        this.model.parentId = this.model.parentId ? this.model.parentId : undefined
      }
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'departName', 'orgCode', 'parentId', 'mobile', 'fax', 'address', 'departOrder', 'memo')
        )
      })
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
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
          if (formData.id && formData.id === formData.parentId) {
            that.$message.warning('上级机构不能是自身!')
            return
          }
          if (formData.hasOwnProperty('parentId')) {
            formData.parentId = formData.parentId ? formData.parentId : ''
          }
          console.log(formData)
          that.confirmLoading = true
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadTreeData()
              that.$emit('ok')
              that.close()
            } else {
              that.$message.warning(res.message)
            }
            that.confirmLoading = false
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
  },
}
</script>

<style scoped>
</style>