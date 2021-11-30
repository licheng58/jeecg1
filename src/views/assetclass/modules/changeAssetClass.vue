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
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="资产分类结果：">
              <a-select v-decorator="['tzzcfl', {}]" placeholder="请选择资产分类结果" allowClear>
                <a-select-option v-for="(value, key, index) of zcfl" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="审查用户">
              <a-select placeholder="请选择审查用户" v-decorator="['nextUserId', {}]" allowClear>
                <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                  item.realname
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" label="分类调整原因">
              <a-textarea placeholder="请输入分类调整原因" v-decorator="['tzyy', {}]" />
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
import { zcfl } from '@/utils/dictionary'

export default {
  name: 'removeBlacklistModal',
  data() {
    return {
      title: '分类调整申请',
      visible: false,
      ifXieCha: false,
      zcfl,
      model: {},
      role: '',
      userList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        changeSave: '/credit/xTaskAsset/checkTask',
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
          let xtaskAsset = Object.assign(this.model, values)
          let formData = {
            nextUserId: xtaskAsset.nextUserId,
            xtaskAsset: xtaskAsset,
          }
          putAction(this.url.changeSave, formData)
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