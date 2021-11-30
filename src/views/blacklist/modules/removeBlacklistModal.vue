<template>
  <j-modal
    :title="title"
    :width="600"
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
            <a-form-item :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }" label="解禁原因">
              <a-textarea placeholder="请输入解禁原因" v-decorator="['yjyy', validatorRules.yjyy]" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="role === '1'">
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="协查用户">
              <a-select
                placeholder="请选择协查用户"
                v-decorator="['userThirdId', validatorRules.userThirdId]"
                allowClear
              >
                <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                  item.realname
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="role === '2'">
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="是否协查">
              <a-switch v-model="ifXieCha" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="role === '2'">
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="审查用户">
              <a-select placeholder="请选择审查用户" v-decorator="['userShenId', validatorRules.userShenId]" allowClear>
                <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                  item.realname
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getAction, putAction } from '@/api/manage'

export default {
  name: 'removeBlacklistModal',
  data() {
    return {
      title: '解禁申请',
      visible: false,
      ifXieCha: false,
      model: {},
      role: '',
      userList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        yjyy: { rules: [{ required: true, message: '请输入解禁原因' }] },
        userThirdId: { rules: [{ required: true, message: '请选择协查用户' }] },
        userShenId: { rules: [{ required: true, message: '请选择审查用户' }] },
      },
      url: {
        jieJinSave: '/credit/xBlacklist/jieJinSave',
        queryUserByRole: '/sys/role/queryUserByRole',
      },
    }
  },
  created() {
    this.role = this.userInfo().role
    this.getUserList()
  },
  methods: {
    //获取用户信息
    ...mapGetters(['userInfo']),
    init(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
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
          let formData = Object.assign(this.model, values)
          formData.status = 2
          formData.ifXieCha = this.ifXieCha ? 1 : 0
          if (this.role === '2' && formData.ifXieCha === 0) {
            formData.status = 3
          }
          putAction(this.url.jieJinSave, formData)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    getUserList() {
      const param = {
        role: this.role === '1' ? '2' : '3',
      }
      getAction(this.url.queryUserByRole, param).then((res) => {
        if (res.success) {
          this.userList = res.result
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>