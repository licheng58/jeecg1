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
                     label="设备序列号">
          <a-input placeholder="请输入设备序列号"
                   :maxLength='16'
                   :disabled="title === '编辑'"
                   v-decorator="['serialNo',validatorRules.serialNo]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="设备名称">
          <a-input placeholder="请输入设备名称"
                   v-decorator="['name', validatorRules.name]"
                   :maxLength='12' />
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="设备类型">

          <a-select v-decorator="['type',validatorRules.type]"
                    placeholder="请选择设备类型">

            <a-select-option v-for="(item,index) in DEVIVE_TYPES"
                             :key="index"
                             :value="item.value">
              {{item.value}}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import { mapState } from 'vuex'
import { lc_validateSerialNo } from '@/api/lc_api'
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
      validatorRules: {
        serialNo: {
          rules: [
            {
              required: true,
              message: '请输入设备序列号!',
            },
            {
              validator: this.validateSerialNo,
            },
          ],
        },

        name: {
          rules: [
            {
              required: true,
              message: '请输入设备名称!',
            },
          ],
        },

        status: {
          rules: [
            {
              required: true,
              message: '请选择头盔状态!',
            },
          ],
        },

        type: {
          rules: [
            {
              required: true,
              message: '请选择设备类型!',
            },
          ],
        },

        activeStatus: {
          rules: [
            {
              required: true,
              message: '请选择设备状态!',
            },
          ],
        },
      },
      url: {
        add: '/industry/industryHelmet/add',
        edit: '/industry/industryHelmet/edit',
      },
    }
  },

  computed: {
    ...mapState(['DEVIVE_TYPES']),
  },

  methods: {
    // 校验设备序列号
    async validateSerialNo(rule, value, callback) {
      if (this.title === '编辑') return
      const res = await lc_validateSerialNo(value)
      const { result } = res
      if (result === 1) {
        callback('设备序列号已存在!')
      }
    },

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
          // if (values.serialNo === undefined) {
          //   this.$message.error('设备序列号不能为空')
          //   return
          // }

          // if (values.name === undefined) {
          //   this.$message.error('设备名称不能为空')
          //   return
          // }

          // if (values.status === undefined) {
          //   this.$message.error('头盔状态不能为空')
          //   return
          // }

          // if (values.type === undefined) {
          //   this.$message.error('设备类型不能为空')
          //   return
          // }

          // if (values.activeStatus === undefined) {
          //   this.$message.error('设备状态不能为空')
          //   return
          // }

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