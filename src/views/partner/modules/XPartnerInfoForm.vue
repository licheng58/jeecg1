<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="合作方名称" :labelCol="labelCol" :wrapperCol="wrapperCol" style="align: left">
              <a-input v-decorator="['partnerName', validatorRules.partnerName]" placeholder="请输入合作方名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="产品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partnerProName', validatorRules.partnerProName]" placeholder="请输入产品名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="业务品种" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="['ywpz', validatorRules.ywpz]" placeholder="请选择业务品种" allowClear>
                <a-select-option v-for="(value, key, index) of ywpz" :key="index" :value="value">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="业务币种" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="['ywbz', validatorRules.ywbz]" placeholder="请选择业务品种" allowClear>
                <a-select-option v-for="(value, key, index) of ywbz" :key="index" :value="value">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="额度上限(万)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dkedsx', validatorRules.dkedsx]" placeholder="请输入贷款额度上限"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="贷款利率(%)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dkll', validatorRules.dkll]" placeholder="请输入贷款利率"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="贷款期限(月)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dkqx', validatorRules.dkqx]" placeholder="请输入贷款期限"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="计息方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <!-- <a-input v-decorator="['jxfs']" placeholder="请输入计息方式"></a-input> -->
              <a-select mode="tags" v-decorator="['jxfs']" :token-separators="[',']" placeholder="请输入计息方式">
                <a-select-option v-for="(value, key, index) of jxfs" :key="index" :value="value">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="还款方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select mode="tags" v-decorator="['hkfs']" :token-separators="[',']" placeholder="请输入还款方式">
                <a-select-option v-for="(value, key, index) of hkfs" :key="index" :value="value">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="材料清单" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select mode="tags" v-decorator="['clqd']" :token-separators="[',']" placeholder="请输入材料清单">
                <a-select-option v-for="(value, key, index) of clqd" :key="index" :value="value">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="产品介绍" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input type="textarea" v-decorator="['cpjs']" placeholder="请输入产品介绍"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="产品要求" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input type="textarea" v-decorator="['cpyq']" placeholder="请输入产品要求"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="产品联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cplxr']" placeholder="请输入产品联系人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['cplxfs', validatorRules.cplxfs]" placeholder="请输入联系方式"></a-input>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import { validateDuplicateValue } from '@/utils/util'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JDate from '@/components/jeecg/JDate'
import { jxfs, hkfs, clqd, ywpz, ywbz } from '@/utils/dictionary'
import { isMobile } from '@/utils/validate'

export default {
  name: 'XPartnerInfoForm',
  components: {
    JFormContainer,
    JDate,
  },
  props: {
    //流程表单data
    formData: {
      type: Object,
      default: () => {},
      required: false,
    },
    //表单模式：true流程表单 false普通表单
    formBpm: {
      type: Boolean,
      default: false,
      required: false,
    },
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      model: {},
      jxfs,
      hkfs,
      clqd,
      ywpz,
      ywbz,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {
        partnerName: { rules: [{ required: true, message: '请输入合作方名称' }] },
        partnerProName: { rules: [{ required: true, message: '请输入产品名称' }] },
        ywpz: { rules: [{ required: true, message: '请选择业务品种' }] },
        ywbz: { rules: [{ required: true, message: '请输入录入原因' }] },
        dkedsx: { rules: [{ required: true, message: '请输入贷款额度上限' }] },
        dkll: { rules: [{ required: true, message: '请输入贷款利率' }] },
        dkqx: { rules: [{ required: true, message: '请输入贷款期限' }] },
        cplxfs: { rules: [{ validator: this.phoneValidator }] },
      },
      url: {
        add: '/credit/xPartnerInfo/add',
        edit: '/credit/xPartnerInfo/edit',
        queryById: '/credit/xPartnerInfo/queryById',
      },
    }
  },
  computed: {
    formDisabled() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return false
        }
        return true
      }
      return this.disabled
    },
    showFlowSubmitButton() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return true
        }
      }
      return false
    },
  },
  created() {
    //如果是流程中表单，则需要加载流程表单data
    this.showFlowData()
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      // 将字符串转为数组
      // console.log(this.model.jxfs)
      if (this.model.jxfs) {
        this.model.jxfs = this.model.jxfs.split(',')
      }
      if (this.model.hkfs) {
        this.model.hkfs = this.model.hkfs.split(',')
      }
      if (this.model.clqd) {
        this.model.clqd = this.model.clqd.split(',')
      }
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'partnerName',
            'partnerProName',
            'ywpz',
            'ywbz',
            'dkedsx',
            'dkll',
            'dkqx',
            'jxfs',
            'hkfs',
            'cpjs',
            'cpyq',
            'clqd',
            'cplxfs',
            'cplxr'
          )
        )
      })
    },
    //渲染流程表单数据
    showFlowData() {
      if (this.formBpm === true) {
        let params = { id: this.formData.dataId }
        getAction(this.url.queryById, params).then((res) => {
          if (res.success) {
            this.edit(res.result)
          }
        })
      }
    },
    submitForm() {
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
          console.log('表单提交数据', formData)
          // 拼接数组中的字符串
          if (formData.jxfs) {
            formData.jxfs = formData.jxfs.join(',')
          }
          if (formData.hkfs) {
            formData.hkfs = formData.hkfs.join(',')
          }
          if (formData.clqd) {
            formData.clqd = formData.clqd.join(',')
          }
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
            })
        }
      })
    },
    //手机号码
    phoneValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (!isMobile(value)) {
        callback('手机号码格式不正确!')
      }
      callback()
    },
    popupCallback(row) {
      this.form.setFieldsValue(
        pick(
          row,
          'partnerName',
          'partnerProName',
          'ywpz',
          'ywbz',
          'dkedsx',
          'dkll',
          'dkqx',
          'jxfs',
          'hkfs',
          'cpjs',
          'cpyq'
        )
      )
    },
  },
}
</script>