<template>
  <div style="margin-bottom: 100px">
    <p v-if="errMsg" class="err-msg">*{{ errMsg }}</p>
    <a-form class="my-descriptions-form" :form="form" labelAlign="left" layout="horizontal">
      <a-row :gutter="0">
        <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
          <a-form-item v-if="type === 2" :required="field.required" :label="field.name">
            <span v-if="[2, 3].includes(field.type)">
              <a-input
                :value="model[field.code] | typeFormat(field.types)"
                disabled
                :suffix="field.unit ? field.unit : ''"
              />
            </span>
            <span v-else>
              <comInput
                :value="model[field.code]"
                disabled
                :type="field.inputType ? field.inputType : 'text'"
                :unit="field.unit ? field.unit : ''"
              />
            </span>
          </a-form-item>
          <a-tooltip :title="field.errMsg" v-else>
            <a-form-item v-if="field.code === 'code'" :label="field.name">
              <CustomerSelect
                v-decorator="[field.code, field.rules]"
                :valueCode="field.code"
                :ifNew="ifNew"
                @select="codeSelect"
              ></CustomerSelect>
            </a-form-item>
            <a-form-item v-else-if="field.code === 'jmjddm'" :label="field.name">
              <CustomerSelect
                v-decorator="[field.code, field.rules]"
                :valueCode="field.code"
                :ifNew="ifNew"
                @select="jmjddmSelect"
              ></CustomerSelect>
            </a-form-item>
            <a-form-item v-else-if="field.code === 'zjr'" :label="field.name">
              <a-select v-decorator="[field.code, field.rules]" @select="zjrSelect">
                <a-select-option v-for="(item, index) of userList" :key="index" :value="item.name">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item v-else :label="field.name">
              <comInput
                v-if="field.type === 1"
                v-decorator="[field.code, field.rules]"
                :placeholder="field.placeholder ? field.placeholder : ''"
                :type="field.inputType ? field.inputType : 'text'"
                :unit="field.unit ? field.unit : ''"
              />

              <a-select v-if="field.type === 2" v-decorator="[field.code, field.rules]">
                <a-select-option v-for="(value, key, index) of field.types" :key="index" :value="key">{{
                  value
                }}</a-select-option>
              </a-select>
              <a-radio-group v-if="field.type === 3" v-decorator="[field.code, field.rules]">
                <a-radio v-for="(item, index) of field.types" :key="index" :value="item.value">
                  {{ item.name }}
                </a-radio>
              </a-radio-group>
              <a-date-picker v-if="field.type === 4" v-decorator="[field.code, field.rules]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-tooltip>
        </a-col>
      </a-row>
    </a-form>
    <PageTitle title="其他借款人" fontSize="16px" hasBefore style="padding: 0 24px">
      <a-button @click="handleAdd" v-if="[0, 1].includes(type)" type="primary" icon="plus" :loading="loading"
        >新增其他借款人</a-button
      >
    </PageTitle>
    <a-collapse v-model="activeKey" :bordered="false" class="my-collapse m024">
      <a-collapse-panel
        :header="`借款人${index + 1}`"
        v-for="(item, index) of dataSource"
        :key="`${index}`"
        :style="customStyle"
      >
        <step1List :ref="`step1List${index}`" :record="item" :type="type"></step1List>
        <a-icon slot="extra" type="delete" @click="handleDel(index)" v-if="type !== 2" />
      </a-collapse-panel>
    </a-collapse>
    <a-empty v-if="dataSource.length === 0" :image="simpleImage" />
  </div>
</template>
<script>
import { customerType, ifTypes, kxyt } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import { getAction, postAction } from '@/api/manage'
import step1List from './step1List'
import { Empty } from 'ant-design-vue'
import { filterObj, numCal } from '@/utils/util'

export default {
  components: {
    step1List,
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  data() {
    return {
      customStyle: 'background: #fffffff;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
      activeKey: '0',
      userList: [],
      fieldDefaultList: [
        {
          name: '门店编号',
          code: 'code',
          type: 1, //1 input  2 select 3 radio
          span: 8,
          rules: { rules: [{ required: true, message: '请输入门店编号!' }] },
          required: true,
        },
        {
          name: '加盟酒店店名',
          code: 'jmjddm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入加盟酒店店名!' }] },
          required: true,
        },
        {
          name: '客户类型',
          code: 'customerType',
          type: 2,
          types: customerType,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入客户类型!' }] },
          required: true,
        },
        {
          name: '主借人',
          code: 'zjr',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入主借人!' }] },
          required: true,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入证件号码!' }] },
          required: true,
        },
        {
          name: '企业征信贷款余额',
          code: 'mddkye',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '万元',
        },
        {
          name: '锦江系贷款余额',
          code: 'jjdkye',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '万元',
        },
        {
          name: '大股东征信贷款余额',
          code: 'dgddkye',
          filter: { code: 'zjlx', value: '1' },
          hidden: true,
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '万元',
        },
        {
          name: '大股东锦江系贷款余额',
          code: 'jjxdkye',
          filter: { code: 'zjlx', value: '1' },
          type: 1,
          inputType: 'number',
          hidden: true,
          span: 8,
          rules: {},
          required: false,
          unit: '万元',
        },
        {
          name: '申请金额',
          code: 'amount',
          inputType: 'number',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入申请金额(万)!' }] },
          required: true,
          unit: '万元',
        },

        {
          name: '申请期限',
          code: 'qx',
          inputType: 'number',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入申请期限(月)!' }] },
          required: true,
          unit: '月',
        },

        {
          name: '是否异地贷款',
          code: 'isYddk',
          type: 3,
          types: ifTypes,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否异地贷款!' }] },
          required: true,
        },

        {
          name: '款项用途',
          code: 'kxyt',
          type: 2,
          types: kxyt,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择款项用途!' }] },
          required: true,
        },
        {
          name: '还款来源',
          code: 'hkly',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入还款来源!' }] },
          required: true,
        },
        {
          name: '已支付加盟费',
          code: 'yzfjmf',
          filter: { code: 'kxyt', value: '3' },
          inputType: 'number',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入已支付加盟费!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '已支付租金',
          code: 'yzfzj',
          inputType: 'number',
          filter: { code: 'kxyt', value: '3' },
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入已支付租金!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '装修投资预算',
          code: 'zxtzys',
          inputType: 'number',
          filter: { code: 'kxyt', value: '3' },
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入装修投资预算!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '单房造价',
          code: 'dfzj',
          inputType: 'number',
          filter: { code: 'kxyt', value: '3' },
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入单房造价!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '装修总进度',
          code: 'zxzjd',
          inputType: 'number',
          filter: { code: 'kxyt', value: '3' },
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入装修总进度!' }] },
          required: true,
          unit: '%',
        },
        {
          name: 'EBITDA',
          code: 'ebitda',
          inputType: 'number',
          filter: { code: 'kxyt', value: '3' },
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入EBITDA!' }] },
          required: true,
          unit: '万元/年',
        },
        {
          name: 'EBITDA率',
          code: 'ebitdal',
          inputType: 'number',
          filter: { code: 'kxyt', value: '3' },
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入EBITDA率!' }] },
          required: true,
          unit: '%',
        },
        // {
        //   name: '偿债保障比率',
        //   code: 'czbzbl',
        //   inputType: 'number',
        //   filter: { code: 'kxyt', value: '3' },
        //   type: 1,
        //   span: 8,
        //   rules: { rules: [{ required: true, message: '请输入偿债保障比率!' }] },
        //   required: true,
        //   unit: '%',
        // },

        {
          name: '备注',
          code: 'remake',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
      ],
      fieldList: [],
      model: {
        zjlx: '2',
      },
      dataSource: [],
      loading: false,
      errMsg: '',
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
      //模糊查询 是否为新开酒店
      ifNew: '0',
      url: {
        queryCustomerByLike: '/credit/xTask/queryCustomerByLike',
        checkCustomerInfo: '/credit/xTask/checkCustomerInfo',
        queryDkye: '/credit/xTask/queryDkye',
      },
    }
  },
  created() {
    //款项用途
    if (this.$route.query.purpose) {
      let kxyt = this.$route.query.purpose + ''
      this.model.kxyt = kxyt
      this.ifNew = kxyt === '3' ? '1' : '0'
      this.fieldDefaultList[21].span = this.model.zjlx === '2' && this.model.kxyt === '3' ? 16 : 24
      this.fieldDefaultList[13].span = this.model.zjlx === '1' && this.model.kxyt !== '3' ? 16 : 8
      this.fieldList = this.fieldDefaultList.filter(
        (item) => !item.filter || item.filter.value === this.model[item.filter.code]
      )
      this.$nextTick(() => {
        this.form.setFieldsValue({ kxyt: kxyt, customerType: '1' })
      })
    }
  },

  methods: {
    init(record, otherInfos, xcustomerInfo) {
      if (record) {
        this.fieldDefaultList[5].name = record.customerType === '1' ? '个人征信贷款余额' : '企业征信贷款余额'
        this.fieldDefaultList[21].span = record.zjlx === '2' && record.kxyt === '3' ? 16 : 24
        this.fieldDefaultList[13].span = record.zjlx === '1' && record.kxyt !== '3' ? 16 : 8
        this.fieldList = this.fieldDefaultList.filter(
          (item) => !item.filter || item.filter.value === record[item.filter.code]
        )
        this.$nextTick(() => {
          this.model = Object.assign({}, record)
          if (this.type !== 2) {
            let dateField = {}
            //时间格式数据先转换格式
            this.fieldList
              .filter((item) => item.type === 4)
              .map((item) => {
                dateField[item.code] = this.model[item.code] ? moment(this.model[item.code]) : null
              })
            let fields = this.fieldList
              .filter((item) => item.type !== 4)
              .map((item) => {
                return item.code
              })
            dateField = Object.assign(pick(this.model, fields), dateField)
            this.form.setFieldsValue(dateField)
          }
        })
      } else {
        this.fieldList = this.fieldDefaultList
      }
      this.dataSource = otherInfos
      this.customerData = xcustomerInfo
      this.userList = this.getZJR()
    },
    handleAdd() {
      this.loading = true
      setTimeout(() => {
        let data = {
          jkrsf: '1',
        }
        this.dataSource.push(data)
        this.activeKey = `${this.dataSource.length - 1}`
        this.loading = false
      }, 500)
    },
    handleDel(index) {
      this.dataSource.splice(index, 1)
    },
    codeSelect(customerData) {
      this.customerData = customerData
      this.userList = this.getZJR()
      this.$nextTick(() => {
        this.form.setFieldsValue({
          jmjddm: this.customerData.jmjddm,
        })
      })
      this.model.customerId = this.customerData.id
      this.model.createByDepartment = this.customerData.mdsspp
      //省保存到贷款  驾驶舱省排名
      let wydzs = this.customerData.wydz ? this.customerData.wydz.split('/') : []
      if (wydzs.length > 0) {
        this.model.city = wydzs[0]
      }
      this.checkCustomer()
      this.$emit('cusChange', this.customerData.id)
    },
    jmjddmSelect(customerData) {
      this.customerData = customerData
      this.userList = this.getZJR()
      this.$nextTick(() => {
        this.form.setFieldsValue({
          code: this.customerData.code,
        })
      })
      this.model.customerId = this.customerData.id
      this.model.createByDepartment = this.customerData.mdsspp
      //省保存到贷款  驾驶舱省排名
      let wydzs = this.customerData.wydz ? this.customerData.wydz.split('/') : []
      if (wydzs.length > 0) {
        this.model.city = wydzs[0]
      }
      this.checkCustomer()
      this.$emit('cusChange', this.customerData.id)
    },
    zjrSelect(key, option) {
      let index = option.data.key
      let user = this.userList[index]
      if (user.cardNum) {
        this.model.zjlx = user.customerTpye + ''
        this.$nextTick(() => {
          this.form.setFieldsValue({
            zjhm: user.cardNum,
          })
        })
      }
      this.fieldDefaultList[21].span = this.model.zjlx === '2' && this.model.kxyt === '3' ? 16 : 24
      this.fieldDefaultList[13].span = this.model.zjlx === '1' && this.model.kxyt !== '3' ? 16 : 8
      //主借人 为 门店工商注册名称时 显示 大股东征信贷款余额 大股东锦江系贷款余额
      //调整字段 span 占比
      this.fieldList = this.fieldDefaultList.filter(
        (item) => !item.filter || item.filter.value === this.model[item.filter.code]
      )

      //查询贷款余额
      let param = {
        content: user.cardNum,
        type: Number(user.type),
      }
      this.queryDkye(param)
    },

    onValuesChange(props, values) {
      let keys = Object.keys(values)
      if (keys.length > 1) {
        return
      }
      if (values.hasOwnProperty('kxyt')) {
        this.model.kxyt = values.kxyt
        this.fieldDefaultList[21].span = this.model.zjlx === '2' && this.model.kxyt === '3' ? 16 : 24
        this.fieldDefaultList[13].span = this.model.zjlx === '1' && this.model.kxyt !== '3' ? 16 : 8
        this.fieldList = this.fieldDefaultList.filter(
          (item) => !item.filter || item.filter.value === this.model[item.filter.code]
        )
        this.ifNew = values.kxyt === '3' ? '1' : '0'
      }
      if (values.hasOwnProperty('customerType')) {
        this.model.customerType = values.customerType
        this.userList = this.getZJR()
        this.fieldDefaultList[5].name = values.customerType === '1' ? '个人征信贷款余额' : '企业征信贷款余额'
        this.fieldList[5].name = values.customerType === '1' ? '个人征信贷款余额' : '企业征信贷款余额'
        this.$emit('cusTypeChange', values.customerType)
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
    getZJR() {
      if (!this.customerData) {
        return []
      }
      let customerType = this.model.customerType
      let customerList = []
      if (this.customerData.gszcmc) {
        //门店工商注册名称
        customerList.push({
          type: '2',
          customerTpye: 1,
          customerId: this.customerData.id,
          name: this.customerData.gszcmc,
          cardNum: this.customerData.tyshxydm,
        })
      }
      if (this.customerData.xm) {
        // 门店法定代表人名
        customerList.push({
          type: '1',
          customerTpye: 2,
          name: this.customerData.xm,
          cardNum: this.customerData.zjhm,
        })
      }
      if (this.customerData.otherInfos) {
        this.customerData.otherInfos.map((item) => {
          //企业股东
          if (item.type === 1) {
            if (item.gszcmc) {
              customerList.push({
                type: '2',
                customerTpye: 3,
                name: item.gszcmc,
                cardNum: item.tyshxydm,
              })
            }
            //法定代表人
            if (item.xm) {
              customerList.push({
                type: '1',
                name: item.xm,
                customerTpye: 4,
                cardNum: item.zjhm,
              })
            }
            //实际控制人
            if (item.sjxm) {
              customerList.push({
                type: '1',
                name: item.sjxm,
                customerTpye: 5,
                cardNum: item.sjzjhm,
              })
            }
          } else {
            //自然人
            if (item.gdxm) {
              customerList.push({
                type: '1',
                customerTpye: 6,
                name: item.gdxm,
                cardNum: item.zjhm,
              })
            }
          }
        })
      }
      let dataList = []
      let names = []
      customerList.map((item) => {
        if (!names.includes(item.name) && (!customerType || (customerType && item.type === customerType))) {
          dataList.push(item)
          names.push(item.name)
        }
      })
      return dataList
    },

    getData(status) {
      if (status === 1) {
        let isErr = false
        this.form.validateFields((err, values) => {
          if (err) {
            isErr = true
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
          }
        })
        if (isErr) {
          this.$message.warning('请检查贷款申请信息必填验证!')
          return false
        }
      }
      let formData = Object.assign(this.model, this.form.getFieldsValue())
      this.fieldList
        .filter((item) => item.type === 4)
        .map((item) => {
          formData[item.code] = formData[item.code] ? formData[item.code].format('YYYY-MM-DD') : null
        })

      return filterObj(formData)
    },

    getOtherData() {
      let list = this.dataSource.map((item, index) => {
        return this.$refs[`step1List${index}`][0].getData()
      })
      return list
    },
    //检验门店是否 加入 黑名单 预警 等提醒
    checkCustomer() {
      const param = {
        id: this.customerData.id,
        code: this.customerData.code,
      }
      postAction(this.url.checkCustomerInfo, param).then((res) => {
        this.errMsg = res.success ? '' : res.message
      })
    },
    //查询 贷款余额
    queryDkye(param) {
      getAction(this.url.queryDkye, param).then((res) => {
        if (res.success) {
          let obj = {}
          if (res.result && res.result.dkye) {
            obj.jjdkye = numCal(res.result.dkye, 2, '万')
          }
          if (res.result && res.result.maxGDYE) {
            obj.jjxdkye = numCal(res.result.maxGDYE, 2, '万')
          }
          if (Object.keys(obj).length > 0) {
            this.$nextTick(() => {
              this.form.setFieldsValue(obj)
            })
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.err-msg {
  margin: 0 30px;
  color: red;
}
</style>