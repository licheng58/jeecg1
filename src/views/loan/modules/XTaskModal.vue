<template>
  <j-modal
    :title="title"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="业务类型">
          <a-select v-model="model.type" placeholder="请选择业务类型" allowClear>
            <a-select-option v-for="(value, key, index) of kxyt" :key="index" :value="key">{{ value }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { kxyt } from '@/utils/dictionary'

export default {
  name: 'XTaskModal',
  data() {
    return {
      kxyt,
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
      url: {},
    }
  },
  created() {},
  methods: {
    init() {
      this.model = {}
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      if (!this.model.type) {
        this.$message.warning('请选择业务类型!')
        return
      }
      this.visible = false
      this.$emit('ok', this.model.type)
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
</style>