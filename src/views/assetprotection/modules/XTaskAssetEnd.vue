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
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="责任类别">
              <a-select v-decorator="['zrlb', {}]" placeholder="请选择责任类别" allowClear>
                <a-select-option v-for="(value, key, index) of zrlb" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="责任属性">
              <a-select v-decorator="['zrsx', {}]" placeholder="请选择责任属性" allowClear>
                <a-select-option v-for="(value, key, index) of zrsx" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="所在机构">
              <a-input placeholder="请输入责任人所在机构" v-decorator="['zrrszjg', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="责任认定人">
              <a-input placeholder="请输入责任认定人" v-decorator="['zrrxm', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" label="责任描述">
              <a-textarea placeholder="请输入责任描述" v-decorator="['zrms', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" label="追究意见">
              <a-textarea placeholder="请输入责任追究意见" v-decorator="['zrzjyj', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" label="落实情况">
              <a-textarea placeholder="请输入责任追究落实情况" v-decorator="['zrzjlsqk', {}]" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="是否协查">
              <a-switch v-model="ifXieCha" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="审查用户">
              <a-select placeholder="请选择审查用户" v-decorator="['userShenId', {}]" allowClear>
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
import { getAction, putAction } from '@/api/manage'
import { zrlb, zrsx } from '@/utils/dictionary'

export default {
  name: 'XTaskAssetEnd',
  data() {
    return {
      title: '转终结',
      visible: false,
      zrlb,
      zrsx,
      model: {},
      ifXieCha: false,
      userList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        queryById: '/credit/xTaskAssetProtection/queryById',
        queryUserByRole: '/sys/role/queryUserByRole',
        edit: '/credit/xTaskAssetProtection/edit', //提交 转终结
      },
    }
  },
  created() {
    this.getUserList()
  },
  computed: {},
  methods: {
    //获取用户信息

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
          let param = {
            xtaskAssetProtection: that.model,
            xtaskAssetProtectionResponsibility: Object.assign({}, values),
          }
          param.xtaskAssetProtection.status = 2
          param.xtaskAssetProtection.userShenId = values.userShenId
          param.xtaskAssetProtectionResponsibility.protectionId = param.xtaskAssetProtection.id
          param.xtaskAssetProtectionResponsibility.taskId = param.xtaskAssetProtection.taskId
          param.xtaskAssetProtectionResponsibility.taskNo = param.xtaskAssetProtection.taskNo
          param.xtaskAssetProtectionResponsibility.userId = param.xtaskAssetProtection.userId
          //需要协查
          if (that.ifXieCha) {
            param.xtaskAssetProtection.status = 1
          }
          putAction(this.url.edit, param)
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
        role: '3',
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

<style>
</style>