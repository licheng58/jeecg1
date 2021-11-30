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
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="门店编号">
              <CustomerSelect
                placeholder="请输入门店编号"
                v-decorator="['code', validatorRules.code]"
                valueCode="code"
                @select="codeSelect"
              ></CustomerSelect>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="加盟酒店店名">
              <CustomerSelect
                placeholder="请输入加盟酒店店名"
                v-decorator="['customerName', validatorRules.customerName]"
                valueCode="jmjddm"
                @select="jmjddmSelect"
              ></CustomerSelect>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="预警级别">
              <a-select placeholder="请选择预警级别" v-decorator="['yjjb', validatorRules.yjjb]" allowClear>
                <a-select-option value="1">高</a-select-option>
                <a-select-option value="2">中</a-select-option>
                <a-select-option value="3">低</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="预警来源">
              <a-select placeholder="请选择预警信息来源" v-decorator="['yjxxly', validatorRules.yjxxly]" allowClear>
                <a-select-option value="1">贷后监控活动</a-select-option>
                <a-select-option value="2">关注媒体</a-select-option>
                <a-select-option value="3">研究分析</a-select-option>
                <a-select-option value="4">金融监管机构披露</a-select-option>
                <a-select-option value="5">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" label="预警信号">
              <a-select v-decorator="['yjxh', validatorRules.yjxh]" placeholder="请选择预警信号" allowClear>
                <a-select-option v-for="(value, key, index) of yjxh" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }" label="预警详情">
              <a-textarea placeholder="请输入预警信息详情" v-decorator="['yjxxxq', validatorRules.yjxxxq]" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="role === '1'">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="协查用户">
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
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="是否协查">
              <a-switch v-model="isHasXC" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="role === '2'">
            <a-form-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="审查用户">
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
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getAction } from '@/api/manage'
import { yjxh } from '@/utils/dictionary'

export default {
  name: 'XWarningRecordModal',
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      yjxh,
      role: '',
      userList: [],
      confirmLoading: false,
      isHasXC: true,
      form: this.$form.createForm(this),
      validatorRules: {
        code:{ rules:  [{ required: true, message: '请输入门店编号' }]},
        customerName: { rules: [{ required: true, message: '请输入加盟酒店店名' }]},
        yjjb:{ rules:  [{ required: true, message: '请选择预警级别' }]},
        yjxxly:{ rules:  [{ required: true, message: '请选择预警信息来源' }]},
        yjxh: { rules: [{ required: true, message: '请选择预警信号' }]},
        yjxxxq: { rules: [{ required: true, message: '请输入预警信息详情' }]},
        userThirdId: { rules: [{ required: true, message: '请选择协查用户' }]},
        userShenId: { rules: [{ required: true, message: '请选择审查用户' }]},
      },
      url: {
        add: '/credit/xWarningRecord/add',
        edit: '/credit/xWarningRecord/edit',
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
          pick(this.model, 'code', 'customerName', 'yjjb', 'yjxxly', 'yjxh', 'yjxxxq', 'userThirdId', 'userShenId')
        )
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
          formData.status = 2
          if (this.role === '2' && this.isHasXC == false) {
            formData.status = 3
          }
          httpAction(httpurl, formData, method)
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
              // that.close()
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