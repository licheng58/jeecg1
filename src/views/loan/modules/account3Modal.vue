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
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发生时间">
              <a-date-picker placeholder="请选择发生时间" v-decorator="['fssj', {}]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发生金额(元)">
              <a-input placeholder="请输入发生金额" v-decorator="['fsje', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用途">
              <a-input placeholder="请输入用途" v-decorator="['yt', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="付款对象">
              <a-input placeholder="请输入付款对象" v-decorator="['fkdx', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上传附件">
              <!-- <a-input placeholder="请输入附件地址" v-decorator="['filePath', {}]" /> -->
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

      confirmLoading: false,
      form: this.$form.createForm(this),
      fileList: [],
      validatorRules: {},
      url: {
        add: '/credit/xTaskPurpose/add',
        edit: '/credit/xTaskPurpose/edit',
        uploadUrl: '/credit/xTaskPurpose/upload',
        download: '/credit/xTaskPurpose/download',
      },
    }
  },
  computed: {
    uploadUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.uploadUrl}`
    },
    download: function () {
      return `${window._CONFIG['domianURL']}/${this.url.download}`
    },
  },
  created() {},
  methods: {
    add(taskId) {
      this.edit({ taskId: taskId })
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'fsje', 'yt', 'fkdx', 'type'))
        //时间格式化
        this.form.setFieldsValue({ fssj: this.model.fssj ? moment(this.model.fssj) : null })
        if (this.model.filePath) {
          let file = {
            name: this.model.originalFilename + '.' + this.model.fileExtName,
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
          formData.fssj = formData.fssj ? formData.fssj.format('YYYY-MM-DD HH:mm:ss') : null
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
    handleChange(info) {
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          info.file.name = info.file.response.result.originalFilename + '.' + info.file.response.result.extName
          this.model.filePath = info.file.response.result.filePath
          this.model.fileExtName = info.file.response.result.extName
          this.model.originalFilename = info.file.response.result.originalFilename
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      } else if (info.file.status === 'removed') {
        this.fileList = []
        this.model.filePath = ''
        this.model.fileExtName = ''
        this.model.originalFilename = ''
      }
      if (info.file.status !== 'removed') {
        this.fileList = [info.file]
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>