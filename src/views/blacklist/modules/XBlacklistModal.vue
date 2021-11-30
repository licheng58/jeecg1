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
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="门店编号">
              <CustomerSelect
                placeholder="请输入门店编号"
                v-decorator="['code', validatorRules.code]"
                valueCode="code"
                @select="codeSelect"
              ></CustomerSelect>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="加盟酒店店名">
              <CustomerSelect
                placeholder="请输入加盟酒店店名"
                v-decorator="['customerName', validatorRules.customerName]"
                valueCode="jmjddm"
                @select="jmjddmSelect"
              ></CustomerSelect>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }" label="名单类型">
              <a-select v-decorator="['type', validatorRules.type]" placeholder="请选择黑名单类型" allowClear>
                <a-select-option v-for="(value, key, index) of hmdType" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }" label="录入原因">
              <a-textarea placeholder="请输入录入原因" v-decorator="['remake', validatorRules.remake]" />
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="role === '1'">
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="协查人员">
              <a-select
                placeholder="请选择协查人员"
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
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="是否需要协查">
              <a-switch v-model="isHasXC" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="role === '2'">
            <a-form-item :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" label="审查人员">
              <a-select placeholder="请选择审查人员" v-decorator="['userShenId', validatorRules.userShenId]" allowClear>
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
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { hmdType } from '@/utils/dictionary'

export default {
  name: 'XBlacklistModal',
  data() {
    return {
      hmdType,
      title: '操作',
      visible: false,
      model: {},
      role: '',
      userList: [],
      isHasXC: true,
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
        code: { rules: [{ required: true, message: '请输入门店编号' }] },
        customerName: { rules: [{ required: true, message: '请输入加盟酒店店名' }] },
        type: { rules: [{ required: true, message: '请选择黑名单类型' }] },
        remake: { rules: [{ required: true, message: '请输入录入原因' }] },
        userThirdId: { rules: [{ required: true, message: '请选择协查用户' }] },
        userShenId: { rules: [{ required: true, message: '请选择审查用户' }] },
      },
      url: {
        add: '/credit/xBlacklist/add',
        edit: '/credit/xBlacklist/edit',
        // edit: "/credit/xBlacklist/add",
        queryUserByRole: '/sys/role/queryUserByRole',
        customerList: '/credit/xCustomerInfo/list',
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

    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'code',
            // 'customerId',
            'customerName',
            'type',
            'remake',
            'ifXieCha',
            'userId',
            'userShenId',
            'userThirdId'
          )
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

          // 加上名单状态 && 流程状态
          formData.status = 2
          if (this.role === '2' && this.isHasXC == false) {
            formData.status = 3
          }
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
    getUserList() {
      /* 根据当前角色查下一级用户列表
       * role：1-品牌方客户经理, 2-财务公司客户经理, 3-财务公司审查人员, 4-财务公司审批人员, 5-财务公司后台管理
       */
      const param = {
        role: this.role === '1' ? '2' : '3',
      }
      getAction(this.url.queryUserByRole, param).then((res) => {
        if (res.success) {
          this.userList = res.result
        }
      })
    },
    codeSelect(customer) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          customerName: customer.jmjddm,
        })
        this.model.customerId = customer.id
        this.model.customerDepartment = customer.mdsspp
        this.model.zjlx = customer.zjlx
        this.model.zjhm = customer.zjhm
      })
    },
    jmjddmSelect(customer) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          code: customer.code,
        })
        this.model.customerId = customer.id
        this.model.customerDepartment = customer.mdsspp
        this.model.zjlx = customer.zjlx
        this.model.zjhm = customer.tyshxydm
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>