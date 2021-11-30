<template>
  <div class="page-customer-details">
    <a-card :bordered="false" :body-style="{ margin: '0px 0px 16px', padding: '16px 24px 0' }">
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.back()"> 资产保全 </a-breadcrumb-item>
        <a-breadcrumb-item> 责任认定 </a-breadcrumb-item>
      </a-breadcrumb>
      <div></div>
      <PageTitle title="责任认定" fontSize="20px">
        <a-button @click="$router.back()">返回</a-button>
        <a-button @click="handleSave" type="primary">确认</a-button>
      </PageTitle>
    </a-card>

    <a-spin :spinning="loading">
      <!-- 初始化isLoad="false"不加载,默认为false -->
      <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0', padding: '16px 23px 16px' }">
        <a-form class="my-descriptions-form" :form="form" labelAlign="left" layout="horizontal">
          <a-row :gutter="0">
            <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
              <a-tooltip :title="field.errMsg">
                <a-form-item v-if="field.code === 'userShenId'" :label="field.name" help="">
                  <a-select v-decorator="['userShenId', field.rules]" allowClear>
                    <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                      item.realname
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item v-else help="" :label="field.name">
                  <a-input v-if="field.type === 1" v-decorator="[field.code, field.rules]" :disabled="field.disabled" />
                  <a-select v-if="field.type === 2" v-decorator="[field.code, field.rules]" :disabled="field.disabled">
                    <a-select-option v-for="(value, key, index) of field.types" :key="index" :value="key">{{
                      value
                    }}</a-select-option>
                  </a-select>
                  <a-radio-group
                    v-if="field.type === 3"
                    v-decorator="[field.code, field.rules]"
                    :disabled="field.disabled"
                  >
                    <a-radio v-for="(item, index) of field.types" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-radio>
                  </a-radio-group>
                  <a-date-picker
                    v-if="field.type === 4"
                    v-decorator="[field.code, field.rules]"
                    format="YYYY-MM-DD"
                    :disabled="field.disabled"
                  />
                </a-form-item>
              </a-tooltip>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { filterObj } from '@/utils/util.js'
import pick from 'lodash.pick'
import moment from 'moment'
import { customerType, ifTypes, zrlb, zrsx, ywbz } from '@/utils/dictionary'
import { zcfl } from '@/utils/dictionary'
import { getAction, postAction } from '@/api/manage'
import { putAction } from '../../api/manage'

export default {
  name: '',
  data() {
    return {
      description: 'x_task_report管理页面',
      id: Number(this.$route.query.id),
      customerType,
      ifTypes,
      zrlb,
      zrsx,
      loading: false,
      model: {},
      xtaskAssetProtection: {},
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
      userList: [],
      fieldList: [
        {
          name: '申请流水号',
          code: 'taskNo',
          type: 1, //1 input  2 select 3 radio
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        {
          name: '客户类型',
          code: 'customerType',
          type: 2,
          types: customerType,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        {
          name: '主借人',
          code: 'xm',
          type: 1,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        {
          name: '贷款金额',
          code: 'dkje',
          type: 1,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        {
          name: '到期日期',
          code: 'dqrq',
          type: 4,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        {
          name: '业务品种',
          code: 'ywpz',
          type: 1,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        // {
        //   name: '发生类型',
        //   code: 'fslx',
        //   inputType: 'number',
        //   type: 1,
        //   span: 8,
        //   rules: {},
        //   disabled: true,
        //   infoType: 1,
        // },
        {
          name: '业务币种',
          code: 'ywbz',
          type: 1,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },

        // {
        //   name: '回收金额',
        //   code: 'hsje',
        //   type: 1,
        //   span: 8,
        //   rules: {},
        //   disabled: true,
        //   infoType: 1,
        // },

        // {
        //   name: '当前余额',
        //   code: 'dqye',
        //   type: 1,
        //   span: 8,
        //   rules: {},
        //   disabled: true,
        //   infoType: 1,
        // },
        {
          name: '五级分类',
          code: 'wjfl',
          type: 2,
          types: zcfl,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        {
          name: '资产状态',
          code: 'ifEnd',
          type: 1,
          span: 8,
          rules: {},
          disabled: true,
          infoType: 1,
        },
        {
          name: '责任人所在机构',
          code: 'zrrszjg',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入责任人所在机构!' }] },
          disabled: false,
          infoType: 2,
        },
        {
          name: '责任认定人',
          code: 'zrrxm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入责任认定人!' }] },
          disabled: false,
          infoType: 2, //
        },
        {
          name: '责任类别',
          code: 'zrlb',
          type: 2,
          types: zrlb,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择责任类别!' }] },
          disabled: false,
          infoType: 2,
        },
        {
          name: '责任属性',
          code: 'zrsx',
          type: 2,
          types: zrsx,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择责任属性!' }] },
          disabled: false,
          infoType: 2,
        },
        {
          name: '是否需要协查',
          code: 'isHas',
          type: 3,
          types: ifTypes,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否需要协查!' }] },
          disabled: false,
          infoType: 1,
        },
        {
          name: '审查用户',
          code: 'userShenId',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择审查用户!' }] },
          disabled: false,
          infoType: 1,
        },
        {
          name: '责任描述',
          code: 'zrms',
          type: 1,
          span: 24,
          rules: { rules: [{ required: true, message: '请输入责任描述!' }] },
          disabled: false,
          infoType: 2,
        },
        {
          name: '责任追究意见',
          code: 'zrzjyj',
          type: 1,
          span: 24,
          rules: { rules: [{ required: true, message: '请输入责任追究意见!' }] },
          disabled: false,
          infoType: 2,
        },
        {
          name: '责任追究落实情况',
          code: 'zrzjlsqk',
          type: 1,
          span: 24,
          rules: { rules: [{ required: true, message: '请输入责任追究落实情况!' }] },
          disabled: false,
          infoType: 2,
        },
      ],
      url: {
        queryById: '/credit/xTaskAssetProtection/queryById',
        queryUserByRole: '/sys/role/queryUserByRole',
        zeRenRenDing: '/credit/xTaskAssetProtection/zeRenRenDing',
      },
    }
  },

  created() {
    this.loadData()
    this.getUserList()
  },
  methods: {
    //获取用户信息
    loadData() {
      const param = {
        id: this.id,
      }
      this.loading = true
      getAction(this.url.queryById, param).then((res) => {
        if (res.success) {
          this.xtaskAssetProtection = res.result.xtaskAssetProtection
          this.init(res.result.xtaskAssetProtection)
        }
        this.loading = false
      })
    },
    init(record, type) {
      if (record) {
        this.model = Object.assign({}, record)
        this.$nextTick(() => {
          let dateField = {}
          //时间格式数据先转换格式
          let fields = this.fieldList
            .filter((item) => item.disabled)
            .map((item) => {
              return item.code
            })
          dateField = Object.assign({}, pick(this.model, fields))
          dateField.isHas = 0
          this.form.setFieldsValue(dateField)
        })
      }
    },
    onValuesChange(props, values) {
      let keys = Object.keys(values)
      if (keys.length > 1) {
        return
      }
      this.$nextTick(() => {
        let errMsgs = props.form.getFieldError(keys[0])
        let index = this.fieldList.findIndex((item) => item.code === keys[0])
        if (errMsgs) {
          this.fieldList[index].errMsg = errMsgs.join(',')
          this.$forceUpdate()
        } else if (this.fieldList[index].errMsg) {
          this.fieldList[index].errMsg = ''
          this.$forceUpdate()
        }
      })
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
    handleSave() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.submit(values)
        } else {
          this.$nextTick(() => {
            let errKeys = Object.keys(err)
            errKeys.map((key) => {
              let index = this.fieldList.findIndex((item) => item.code === key)
              if (index > -1) {
                this.fieldList[index].errMsg = err[key].errors
                  .map((item) => {
                    return item.message
                  })
                  .join(',')
              }
            })
            this.$forceUpdate()
          })
          this.$message.warning('表单验证失败,请检查输入项!')
        }
      })
    },
    //状态-2拒绝 -1驳回 0系统生成 1待协查 2待审查 3待审批 4审批完成
    submit(values) {
      let param = {
        xtaskAssetProtection: Object.assign({}, this.xtaskAssetProtection),
        xtaskAssetProtectionResponsibility: {},
      }
      param.xtaskAssetProtection.status = 2
      param.xtaskAssetProtection.userShenId = values.userShenId
      param.xtaskAssetProtectionResponsibility.protectionId = param.xtaskAssetProtection.id
      param.xtaskAssetProtectionResponsibility.taskId = param.xtaskAssetProtection.taskId
      param.xtaskAssetProtectionResponsibility.taskNo = param.xtaskAssetProtection.taskNo
      param.xtaskAssetProtectionResponsibility.userId = param.xtaskAssetProtection.userId
      //需要协查
      if (values.isHas === 1) {
        param.xtaskAssetProtection.status = 1
      }
      this.fieldList.map((item) => {
        if (item.infoType === 2) {
          param.xtaskAssetProtectionResponsibility[item.code] = values[item.code]
        }
      })
      this.loading = true
      putAction(this.url.zeRenRenDing, param).then((res) => {
        if (res.success) {
          this.$router.back()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
  },
}
</script> 

// <style lang="less" scoped>
// @import '~@assets/less/common.less';
//
</style>