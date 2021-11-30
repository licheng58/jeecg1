<template>
  <j-modal :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           switchFullscreen
           @ok="handleOk"
           @cancel="handleCancel"
           :ok-button-props="{ props: { disabled: loading } }"
           cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="资源名称">
          <a-input placeholder="请输入资源名称"
                   :maxLength='12'
                   v-decorator="['title', validatorRules.title]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="产品型号">
          <a-select v-decorator="['productNo',validatorRules.productNo]"
                    placeholder="请选择产品型号">

            <a-select-option v-for="val in productNoList"
                             :key="val.id"
                             :value='val.productNo'>
              {{ val.productNo }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="文件上传">
          <a-upload v-decorator="[
              'fileList',
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
              },
              
            ]"
                    name="file"
                    :action="uploadUrl"
                    @change="handleChange"
                    :headers="tokenHeader"
                    list-type="picture"
                    :data="{ bucketName: 'industry' }">
            <!-- :beforeUpload="beforeImageUpload" -->
            <a-button :loading="loading">
              <a-icon type="upload" />文件上传
            </a-button>
          </a-upload>
        </a-form-item>

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
// import { uploadFile } from '@/api/api'
import pick from 'lodash.pick'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { lc_validateTitle } from '@/api/lc_api'

export default {
  name: 'IndustryResourcesModal',

  props: {
    productNoList: {
      type: Array,
      default: [],
    },
  },

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
      loading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        title: {
          rules: [
            {
              required: true,
              message: '请输入资源名称!',
            },
            {
              validator: this.validateTitle,
            },
          ],
        },

        productNo: {
          rules: [
            {
              required: true,
              message: '请选择产品型号!',
            },
          ],
        },

        fileList: {
          rules: [
            {
              required: true,
              message: '请选择文件!',
            },
          ],
        },
      },
      url: {
        add: '/industry/industryResources/add',
        edit: '/industry/industryResources/edit',
      },
    }
  },

  computed: {
    uploadUrl: function () {
      return `${window._CONFIG['domianURL']}/sys/upload/uploadFile`
    },
  },

  methods: {
    // 资源名称型号
    async validateTitle(rule, value, callback) {
      if (this.title === '编辑') return
      const res = await lc_validateTitle(value)
      const { result } = res
      if (result !== 0) {
        callback('资源名称已存在!')
      }
    },

    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.success) {
          this.model.fileType = info.file.type
          this.model.url = info.file.response.message
          console.log(this.model, '---------------')
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },

    beforeImageUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/bmp'
      if (!isJPG) {
        this.$message.error('请上传图片文件')
      }
      const isLt2M = file.size / 1024 < 1024 * 16 && file.size / 1024 > 10
      if (!isLt2M) {
        this.$message.error('文件大小应在10KB~200KB之间')
      }
      return isJPG && isLt2M
    },

    add() {
      this.edit({})
    },

    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList.slice(-1)
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'title', 'resourceType', 'url', 'fileType', 'deptId', 'deptName'))
        //  时间格式化
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
          if (values.fileList === undefined) {
            this.$message.error('文件上传不能为空')
            return
          }
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
          //  时间格式化

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
