<template>
  <j-modal
    :title="title"
    :width="500"
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
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="附件类型">
              <a-input placeholder="请输入附件类型" v-decorator="['fjlx', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传附件">
              <a-upload
                :multiple="false"
                :fileList="fileList"
                :headers="tokenHeader"
                :action="uploadUrl"
                @change="handleChange"
              >
                <a-button> <a-icon type="upload" /> 上传文件 </a-button>
              </a-upload>
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
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'XTaskPurposeModal',
  data() {
    return {
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },

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
      uploadLoading: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      fileList: [],
      validatorRules: {},
      url: {
        add: '/credit/xCustomerFile/add',
        edit: '/credit/xCustomerFile/edit',
        uploadUrl: '/credit/xFileRecord/upload',
      },
    }
  },
  computed: {
    uploadUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.uploadUrl}`
    },
  },
  created() {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.fileList = []
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({ fjlx: this.model.fjlx })
        //时间格式化
        if (this.model.fjcode) {
          let file = {
            name: this.model.fjname,
            uid: +new Date(),
            status: 'done',
          }
          this.fileList = [file]
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      // 触发表单验证
      if (!this.model.fjcode) {
        this.$message.warning('请上传附件')
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = Object.assign(this.model, values)
          formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
          if (!this.model.key) {
            formData.key = +new Date()
            this.$emit('add', formData)
          } else {
            this.$emit('edit', formData)
          }
          this.close()
        }
      })
    },
    handleCancel() {
      this.close()
    },
    handleChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.model.fjcode = info.file.response.result.fileCode
          this.model.fjname = info.file.name
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      } else if (info.file.status === 'removed') {
        this.fileList = []
        this.model.fjcode = ''
        this.model.fjname = ''
      }
      if (info.file.status !== 'removed') {
        this.fileList = [info.file]
      }
    },
  },
}
</script>
