<template>
  <div>
    <PageTitle title="基本信息" fontSize="16px" hasBefore style="padding: 0 24px">
      <span
        class="upload-tag"
        v-if="this.type == 4 || ((this.model.role === '1' || this.model.ifCheck === 1) && this.model.status === 2)"
        >*红色为已修改信息</span
      >
    </PageTitle>
    <a-form class="my-descriptions-form" :form="form" labelAlign="left" layout="horizontal">
      <a-row :gutter="0">
        <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
          <a-form-item
            v-if="[1, 2, 4].includes(type)"
            :required="field.required"
            :label="field.name"
            :class="{
              'field-ative': fieldAtive(field.code),
            }"
          >
            <span v-if="[2, 3].includes(field.type)">
              <a-input
                :value="model[field.code] | typeFormat(field.types)"
                disabled
                :suffix="field.unit ? field.unit : ''"
              />
            </span>
            <span v-else-if="field.type === 4">
              <a-input
                :value="model[field.code] | moment('YYYY-MM-DD')"
                disabled
                :suffix="field.unit ? field.unit : ''"
              />
            </span>
            <span v-else-if="field.type === 6">
              <a-input
                :value="model[field.code] | distFormat(field.dictCode)"
                disabled
                :suffix="field.unit ? field.unit : ''"
              />
            </span>
            <span v-else-if="field.type === 7">
              <a-input
                :value="model[field.code] | cqdateFormat('YYYY-MM-DD')"
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
            <a-form-item :required="field.required" :label="field.name">
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
              <a-cascader
                v-if="field.type === 5"
                v-decorator="[field.code, field.rules]"
                :options="addressList"
                placeholder=""
                change-on-select
                @change="adressChange"
              />
              <j-dict-select-tag
                v-decorator="[field.code, field.rules]"
                v-if="field.type === 6"
                :triggerChange="true"
                :dictCode="field.dictCode"
                @change="dictChange"
              />
              <checkDate v-if="field.type === 7" v-decorator="[field.code, field.rules]" />
            </a-form-item>
          </a-tooltip>
        </a-col>
      </a-row>
    </a-form>
    <PageTitle
      title="操作信息"
      fontSize="16px"
      hasBefore
      style="padding: 0 24px"
      v-if="[1, 2, 4].includes(type) && viewType === 0"
    >
    </PageTitle>
    <a-descriptions
      bordered
      :column="3"
      size="middle"
      class="my-descriptions-card"
      v-if="[1, 2, 4].includes(type) && viewType === 0"
    >
      <a-descriptions-item label="更新人员">{{ model.createBy }}</a-descriptions-item>
      <a-descriptions-item label="更新机构">
        {{ model.createByDepartment }}
      </a-descriptions-item>
      <a-descriptions-item label="更新日期"> {{ model.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="更新原因" :span="3"> {{ model.createReson }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { filterObj } from '@/utils/util.js'
import { ifTypes, ifTypes2, zjType } from '@/utils/dictionary'
import { jycdsyq, ygrs, dtzjl, sqwz, szcsdf, ssppgsmc, ppfzjd } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import { getAction } from '@/api/manage'
import { isIdCard, isMobile, isCreditCode } from '@/utils/validate'
import JDictSelectTag from '@/components/dict/JDictSelectTag'
import { ywbz } from '@/utils/dictionary'
import checkDate from '@/components/jeecg/checkDate'

export default {
  components: {
    JDictSelectTag,
    checkDate,
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
    viewType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showOtherList: false,
      //1 input  2 select 3 radio 4 date 5 Cascader(级联选择) 6 数据字典的下拉 7 长期+时间
      fieldDefaultList: [
        {
          name: '是否为新开业门店',
          code: 'ifNew',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否为新开业门店!' }] },
          required: true,
        },
        {
          name: '门店编号',
          code: 'code',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入门店编号!' }] },
          required: true,
        },
        {
          name: '加盟酒店店名',
          code: 'jmjddm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, whitespace: true, message: '请输入加盟酒店店名!' }] },
          required: true,
        },

        {
          name: '工商注册名称',
          code: 'gszcmc',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, whitespace: true, message: '请输入工商注册名称!' }] },
          required: true,
        },
        {
          name: '门店开业时间',
          code: 'mdkysj',
          type: 4,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择门店开业时间!' }] },
          required: true,
        },
        {
          name: '门店所属品牌',
          code: 'mdsspp',
          type: 6,
          dictCode: 'brand_types',
          span: 8,
          rules: { rules: [{ required: true, message: '请选择门店所属品牌!' }] },
          required: true,
        },
        {
          name: '品牌发展阶段',
          code: 'ppfzjd',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择品牌发展阶段!' }] },
          required: true,
        },
        {
          name: '统一社会信用代码',
          code: 'tyshxydm',
          type: 1,
          span: 8,
          rules: {
            rules: [
              { required: true, whitespace: true, message: '请输入统一社会信用代码!' },
              { validator: this.tyshxydmValidator },
            ],
          },
          required: true,
        },

        {
          name: '注册资本',
          code: 'zczb',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入注册资本!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '注册币种',
          code: 'zcbz',
          type: 2,
          types: ywbz,
          span: 8,
          rules: { rules: [{ required: true, message: '请输入注册币种!' }] },
          required: true,
        },
        {
          name: '经营范围',
          code: 'jyfw',
          type: 1,
          span: 16,
          rules: { rules: [{ required: true, whitespace: true, message: '请输入经营范围!' }] },
          required: true,
        },
        {
          name: '营业执照成立日期',
          code: 'yyqxqsr',
          type: 4,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择营业期限登记日!' }] },
          required: true,
        },
        {
          name: '营业期限到期日',
          code: 'yyqxdqr',
          type: 7,
          span: 16,
          rules: { rules: [{ required: true, message: '请选择营业期限到期日!' }] },
          required: true,
        },

        {
          name: '基本账户开户银行',
          code: 'jbzhkhyh',
          type: 1,
          span: 8,
          rules: {},
          required: false,
        },
        {
          name: '基本账户开户名称',
          code: 'jbzhkhmc',
          type: 1,
          span: 8,
          rules: {},
          required: false,
        },
        {
          name: '基本账户开户账号',
          code: 'jbzhkhzh',
          type: 1,
          span: 8,
          rules: {},
          required: false,
        },
        {
          name: '特种行业许可证号',
          code: 'txhyxkzh',
          type: 1,
          span: 8,
          rules: {},
          required: false,
        },
        {
          name: '特种行业许可证有效期',
          code: 'txhyxkyxq',
          type: 7,
          span: 16,
          rules: {},
          required: false,
        },
        {
          name: '是否涉诉',
          code: 'sfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否涉诉!' }] },
          required: true,
        },
        {
          name: '是否有征信疑问',
          code: 'sfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          rules: { rules: [{ required: true, message: '请选择是否有征信疑问!' }] },
          required: true,
        },
        {
          name: '征信疑问说明',
          code: 'zxywsm',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
        {
          name: '法定代表人姓名',
          code: 'xm',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, whitespace: true, message: '请输入法定代表人姓名!' }] },
          required: true,
        },

        {
          name: '证件类型',
          code: 'zjlx',
          type: 2,
          types: zjType,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择证件类型!' }] },
          required: true,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          rules: {
            rules: [{ required: true, message: '请输入证件号码!' }, { validator: this.zjhmValidator }],
          },
          required: true,
        },
        {
          name: '法人是否涉诉',
          code: 'frsfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择法人是否涉诉!' }] },
          required: true,
        },
        {
          name: '法人是否有征信疑问',
          code: 'frsfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          rules: { rules: [{ required: true, message: '请选择法人是否有征信疑问!' }] },
          required: true,
        },
        {
          name: '法人征信疑问说明',
          code: 'frzxywsm',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
        {
          name: '加盟协议起始时间',
          code: 'jmxyqssj',
          type: 4,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择加盟协议起始时间!' }] },
          required: true,
        },
        {
          name: '加盟协议终止时间',
          code: 'jmxyqzzsj',
          type: 4,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择加盟协议终止时间!' }] },
          required: true,
        },
        {
          name: '过往合作期限',
          code: 'gwhzqix',
          filter: { code: 'ifNew', value: '0' },
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入过往合作期限!' }] },
          required: true,
          unit: '年',
        },
        {
          name: '历史加盟违约次数',
          code: 'lsjmwycs',
          filter: { code: 'ifNew', value: '0' },
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入历史加盟违约次数!' }] },
          required: true,
        },
        {
          name: '已加盟酒店数量',
          code: 'yjmjdsl',
          filter: { code: 'ifNew', value: '0' },
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入已加盟酒店数量!' }] },
          required: true,
        },
        {
          name: '物业地址',
          code: 'wydz',
          type: 5,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择物业地址!' }] },
          required: true,
        },
        {
          name: '物业情况',
          code: 'wyqk',
          type: 2,
          types: jycdsyq,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择物业情况!' }] },
          required: true,
        },
        {
          name: '年租金',
          code: 'nzj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入年租金!' }] },
          required: true,
          unit: '万元',
        },
        {
          name: '物业建筑面积',
          code: 'wymj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入物业建筑面积!' }] },
          required: true,
          unit: '平米',
        },
        {
          name: '客房数',
          code: 'kfs',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入客房数!' }] },
          required: true,
          unit: '间',
        },
        {
          name: '员工人数',
          code: 'ygrs',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请选择员工人数!' }] },
          required: true,
          unit: '人',
        },
        {
          name: '交通便利度',
          code: 'jtbld',
          type: 2,
          types: dtzjl,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择交通便利度!' }] },
          required: true,
        },
        {
          name: '商圈发展程度',
          code: 'sqfzcd',
          type: 2,
          types: sqwz,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择商圈发展程度!' }] },
          required: true,
        },
        {
          name: '城市级别',
          code: 'csjb',
          type: 2,
          types: szcsdf,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择城市级别!' }] },
          required: true,
        },
        {
          name: '可控营收资金比例',
          code: 'kkyszjbl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入可控营收资金比例!' }] },
          required: true,
          unit: '%',
        },
        {
          name: '是否有过往酒店投资历史',
          filter: { code: 'ifNew', value: '1' },
          code: 'ifygjdtzls',
          type: 3,
          types: ifTypes,
          span: 8,
          rules: { rules: [{ required: true, message: '请选择是否有过往酒店投资历史!' }] },
          required: true,
        },
        {
          name: '自筹资金率',
          code: 'zczjl',
          filter: { code: 'ifNew', value: '1' },
          type: 1,
          inputType: 'number',
          span: 16,
          rules: { rules: [{ required: true, message: '请输入自筹资金率!' }] },
          required: true,
          unit: '%',
        },
        {
          name: '门店联系人',
          code: 'mdlxr',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, whitespace: true, message: '请输入门店联系人!' }] },
          required: true,
        },
        {
          name: '门店联系方式',
          code: 'mdlxfs',
          type: 1,
          span: 16,
          rules: { rules: [{ required: true, message: '请输入门店联系方式!' }, { validator: this.phoneValidator }] },
          required: true,
        },
        {
          name: '品牌联系人',
          code: 'pplxr',
          type: 1,
          span: 8,
          rules: { rules: [{ required: true, whitespace: true, message: '请输入品牌联系人!' }] },
          required: true,
        },
        {
          name: '品牌联系方式',
          code: 'pplxfs',
          type: 1,
          span: 16,
          rules: { rules: [{ required: true, message: '请输入品牌联系方式!' }, { validator: this.phoneValidator }] },
          required: true,
        },
        {
          name: '说明',
          code: 'sm',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
      ],
      fieldList: [],
      model: {},
      uploadFields: [],
      uploadFieldData: {},
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
      addressList: [],
      url: {
        queryListAll: '/credit/dataGovScore/queryListAll',
      },
    }
  },
  computed: {
    fieldAtive: function () {
      return function (code) {
        return (
          this.uploadFieldData.hasOwnProperty(code) &&
          (this.type == 4 || ((this.model.role === '1' || this.model.ifCheck === 1) && this.model.status === 2))
        )
      }
    },
  },
  created() {
    this.fieldList = this.fieldDefaultList
    if ([0, 3].includes(this.type)) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          ifNew: '0',
        })
      })
      this.queryListAll()
    }
  },
  methods: {
    init(record) {
      if (record) {
        this.fieldList = this.fieldDefaultList.filter((item) => !item.filter || item.filter.value === record.ifNew)
        this.fieldList[4].name = record.ifNew === '0' ? '门店开业时间' : '预计开业时间'
        this.$nextTick(() => {
          this.model = Object.assign({}, record)
          //修改记录
          if (record.lastUpdataIndex) {
            let uploadData = JSON.parse(record.lastUpdataIndex)
            //修改人跟审批人查看 修改记录
            if ((this.model.role === '1' || this.model.ifCheck === 1) && this.model.status === 2) {
              this.model = Object.assign(this.model, uploadData)
            }
            if ([1, 4].includes(this.type)) {
              this.uploadFieldData = uploadData
            }
          }
          if ([0, 3].includes(this.type)) {
            let dateField = {}
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
            dateField.wydz = this.model.wydz ? this.model.wydz.split('/') : []
            dateField = Object.assign(pick(this.model, fields), dateField)
            this.form.setFieldsValue(dateField)
          }
        })
      }
    },
    onValuesChange(props, values) {
      // 【是否为新开业门店】
      // 若为否，原页面不动，
      // 若为是，原页面，【门店开业时间】变为【预计开业时间】，
      // 去掉【过往合作期限】、【历史加盟违约次数】、【已加盟酒店数量】
      //  增加【自筹资金率(%)】、【是否有过往酒店投资历史】
      if (values.hasOwnProperty('ifNew')) {
        this.fieldList = this.fieldDefaultList.filter(
          (item) => !item.filter || item.filter.value === values[item.filter.code]
        )
        this.fieldList[4].name = values.ifNew === '0' ? '门店开业时间' : '预计开业时间'
      }
      //  触发 门店运营数据的租金占营收比 计算
      if ([0, 3].includes(this.type) && values.hasOwnProperty('nzj') && (values.nzj || values.nzj === 0)) {
        this.$emit('nzjChange', values.nzj)
      }
      //选择自有物业时，年租金自动显示0
      if (values.hasOwnProperty('wyqk') && values.wyqk === '1') {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            nzj: 0,
          })
        })
      }

      let keys = Object.keys(values)
      if (keys.length > 1) {
        return
      }
      this.$nextTick(() => {
        let errMsgs = props.form.getFieldError(keys[0])
        let index = this.fieldList.findIndex((item) => item.code === keys[0])
        if (index > -1) {
          if (errMsgs) {
            this.fieldList[index].errMsg = errMsgs.join(',')
            this.$forceUpdate()
          } else if (this.fieldList[index].errMsg) {
            this.fieldList[index].errMsg = ''
            this.$forceUpdate()
          }
        }
      })
    },

    getData(type) {
      if (type === 1) {
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
          this.$message.warning('请检查门店基础信息必填验证!')
          return false
        }
      }
      let fieldsValue = Object.assign({}, this.form.getFieldsValue())
      //时间字段
      this.fieldList
        .filter((item) => item.type === 4)
        .map((item) => {
          fieldsValue[item.code] = fieldsValue[item.code] ? fieldsValue[item.code].format('YYYY-MM-DD') : null
        })
      //物业地址
      fieldsValue.wydz = fieldsValue.wydz ? fieldsValue.wydz.join('/') : null

      //修改申请 记录修改的字段
      if (this.type === 3) {
        let uploadFieldData = {}
        Object.keys(fieldsValue)
          .filter((key) => !(!fieldsValue[key] && !this.model[key]) && fieldsValue[key] !== this.model[key])
          .map((key) => {
            uploadFieldData[key] = fieldsValue[key]
          })
        fieldsValue.lastUpdataIndex = JSON.stringify(uploadFieldData)
      }
      let formData = filterObj(Object.assign(this.model, fieldsValue))
      if (Object.keys(formData).length === 0) {
        return null
      }
      return formData
    },
    adressChange(value, selectedOptions) {
      if (selectedOptions && selectedOptions.length > 0) {
        let score = selectedOptions[selectedOptions.length - 1].score
        let level = '4'
        if (score >= 90) {
          level = '1'
        } else if (score >= 75 && score < 90) {
          level = '2'
        } else if (score >= 60 && score < 75) {
          level = '3'
        }
        this.form.setFieldsValue({ csjb: level })
      }
    },
    queryListAll() {
      getAction(this.url.queryListAll).then((res) => {
        if (res.success) {
          let data = res.result
          this.addressList = this.format(data, null, -1)
        }
      })
    },
    //格式化物业地址
    format(data, code, index) {
      index++
      return data
        .filter((item) => item.pareGovCode === code)
        .map((item) => {
          return {
            value: item.govName,
            label: item.govName,
            code: item.govCode,
            score: item.scoreResult,
            //最多两层
            children: index === 2 ? [] : this.format(data, item.govCode, index),
          }
        })
    },
    dictChange(value, dictData) {
      if (dictData) {
        this.$nextTick(() => {
          this.form.setFieldsValue({ ppfzjd: dictData.description })
        })
      }
    },
    //身份证验证
    zjhmValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      let zjlx = this.form.getFieldValue('zjlx')
      if (zjlx === '1' && !isIdCard(value)) {
        callback('身份证号码格式不正确!')
      }
      callback()
    },
    // 统一社会信用代码
    tyshxydmValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (!isCreditCode(value)) {
        callback('统一社会信用代码格式不正确!')
      }
      callback()
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
  },
}
</script>