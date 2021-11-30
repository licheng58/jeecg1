<template>
  <div>
    <PageTitle title="门店运营数据" fontSize="16px" hasBefore style="padding: 0 24px">
      <span
        class="upload-tag"
        v-if="
          this.type == 4 ||
          ((this.handleInfo.role === '1' || this.handleInfo.ifCheck === 1) && this.handleInfo.status === 2)
        "
        >*红色为已修改信息</span
      >
      <a-button
        v-if="[0, 3].includes(type)"
        :loading="uploadLoading"
        @click="downloadMoban('月销售额模板')"
        type="primary"
      >
        下载月销售额模板
      </a-button>
      <a-upload
        v-if="[0, 3].includes(type)"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="uploadUrl"
        @change="handleChange"
      >
        <a-button :loading="uploadLoading" type="primary"> 上传月销售数据 </a-button>
      </a-upload>
      <a-button @click="viewMoban" type="primary" v-if="this.companySales.length > 0"> 查看月销售额 </a-button>
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
              <!-- <template v-if="field.type === 1">
                <a-input-number v-if="field.inputType === 'number'" :min="0" v-decorator="[field.code, field.rules]" />
                <a-input
                  v-else
                  v-decorator="[field.code, field.rules]"
                  :placeholder="field.placeholder ? field.placeholder : ''"
                  :suffix="field.unit ? field.unit : ''"
                />
              </template> -->
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
      <a-descriptions-item label="更新人员">{{ handleInfo.createBy }}</a-descriptions-item>
      <a-descriptions-item label="更新机构">
        {{ handleInfo.createByDepartment }}
      </a-descriptions-item>
      <a-descriptions-item label="更新日期"> {{ handleInfo.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="更新原因" :span="3"> {{ handleInfo.createReson }}</a-descriptions-item>
    </a-descriptions>
    <cardDetails2ModalList ref="cardDetails2ModalList"></cardDetails2ModalList>
  </div>
</template>
<script>
import { filterObj, numCal } from '@/utils/util'
import { ifTypes2 } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { downFile } from '@/api/manage'
import CAL from '@/utils/calculation'
import cardDetails2ModalList from './cardDetails2ModalList'
export default {
  components: {
    cardDetails2ModalList,
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
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      fieldList: [],
      fieldList0: [
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
          name: '当年RevPAR',
          code: 'dnRecpar',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入当年RevPAR!' }] },
          required: true,
          unit: '元',
        },
        {
          name: '当年平均出租率',
          code: 'dnpjczl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入当年平均出租率!' }] },
          required: true,
          unit: '%',
        },
        {
          name: '当年平均房价',
          code: 'dnpjfj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入当年平均房价!' }] },
          required: true,
          unit: '元',
        },
        {
          name: '当年累计营收合计(元)',
          code: 'dnljyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {
            rules: [{ required: true, message: '请输入当年累计营收合计!' }, { validator: this.totalValidator }],
          },
          required: true,
          unit: '元',
        },
        {
          name: '租金占营收比',
          code: 'zjzysb',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入租金占营收比!' }, { validator: this.zjzysbValidator }] },
          required: true,
          unit: '%',
        },
        {
          name: '当年客房营收合计',
          code: 'dnkfyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {
            rules: [{ required: true, message: '请输入当年客房营收合计!' }],
          },
          required: true,
          unit: '元',
        },
        {
          name: '当年餐饮营收合计',
          code: 'dncyyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入当年餐饮营收合计!' }] },
          required: true,
          unit: '元',
        },

        {
          name: '当年其他营收合计',
          code: 'dnqtyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入当年其他营收合计!' }] },
          required: true,
          unit: '元',
        },
      ],
      fieldList1: [
        {
          name: '前一自然年度营业收入',
          code: 'qyzrndyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入前一自然年度营业收入!' }] },
          required: true,
          unit: '元',
        },
        {
          name: '前二自然年度营业收入',
          code: 'qezrndyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '前三自然年度营业收入',
          code: 'qszrndyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '前一自然年度平均房价',
          code: 'qyzrndpjfj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '前二自然年度平均房价',
          code: 'qezrndpjfj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '前三自然年度平均房价',
          code: 'qszrndpjfj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '前一自然年度RevPAR',
          code: 'qyzrnrecpar',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入前一自然年度RevPAR!' }] },
          required: true,
          unit: '元',
        },
        {
          name: '前二自然年度RevPAR',
          code: 'qezrnrecpar',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '前三自然年度RevPAR',
          code: 'qszrnrecpar',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '前一自然年度平均出租率',
          code: 'qyzrnpjczl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '%',
        },
        {
          name: '前二自然年度平均出租率',
          code: 'qezrnpjczl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '%',
        },
        {
          name: '前三自然年度平均出租率',
          code: 'qszrnpjczl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '%',
        },
        {
          name: '备注',
          code: 'remake',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
      ],

      fieldList2: [
        {
          name: '后一自然年度预测营业收入',
          code: 'hyzrndyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入后一自然年度预测营业收入!' }] },
          required: true,
          unit: '元',
        },
        {
          name: '后二自然年度预测营业收入',
          code: 'hezrndyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '后三自然年度预测营业收入',
          code: 'hszrndyshj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '后一自然年度预测平均房价',
          code: 'hyzrndpjfj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '后二自然年度预测平均房价',
          code: 'hezrndpjfj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '后三自然年度预测平均房价',
          code: 'hszrndpjfj',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '后一自然年度预测RevPAR',
          code: 'hyzrnrecpar',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: { rules: [{ required: true, message: '请输入后一自然年度预测RevPAR!' }] },
          required: true,
          unit: '元',
        },
        {
          name: '后二自然年度预测RevPAR',
          code: 'hezrnrecpar',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '后三自然年度预测RevPAR',
          code: 'hszrnrecpar',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '元',
        },
        {
          name: '后一自然年度预测平均出租率',
          code: 'hyzrnpjczl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '%',
        },
        {
          name: '后二自然年度预测平均出租率',
          code: 'hezrnpjczl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '%',
        },
        {
          name: '后三自然年度预测平均出租率',
          code: 'hszrnpjczl',
          type: 1,
          inputType: 'number',
          span: 8,
          rules: {},
          required: false,
          unit: '%',
        },
        {
          name: '备注',
          code: 'remake',
          type: 1,
          span: 24,
          rules: {},
          required: false,
        },
      ],
      model: {},
      handleInfo: {},
      uploadFields: [],
      uploadFieldData: {},
      uploadLoading: false,
      companySales: [],
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
      url: {
        importExcel: '/credit/xCustomerCompanySale/importExcel',
        exportExcel: '/credit/xCustomerCompanySale/exportExcel',
      },
      //年租金   租金占营收比=年租金/前一自然年营业收入或后一自然年预测营收
      nzjData: null,
    }
  },
  computed: {
    fieldAtive: function () {
      return function (code) {
        return (
          this.uploadFieldData.hasOwnProperty(code) &&
          (this.type == 4 ||
            ((this.handleInfo.role === '1' || this.handleInfo.ifCheck === 1) && this.handleInfo.status === 2))
        )
      }
    },
    uploadUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcel}`
    },
  },
  created() {
    this.fieldList = this.fieldList0.concat(this.fieldList1)
    if ([0, 3].includes(this.type)) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          ifNew: '0',
        })
      })
    }
  },
  methods: {
    init(record, handleInfo, xcustomerCompanySales) {
      this.handleInfo = handleInfo
      if (record) {
        if (record.ifNew === '1') {
          this.fieldList = this.fieldList0.concat(this.fieldList2)
        }
        //修改记录
        if (record.lastUpdataIndex) {
          let uploadData = JSON.parse(record.lastUpdataIndex)
          //修改人跟审批人查看 修改记录
          if ((this.handleInfo.role === '1' || this.handleInfo.ifCheck === 1) && this.handleInfo.status === 2) {
            record = Object.assign(record, uploadData)
          }
          if ([1, 4].includes(this.type)) {
            this.uploadFieldData = uploadData
          }
        }
        this.$nextTick(() => {
          this.model = Object.assign({}, record)
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
            dateField = Object.assign(pick(this.model, fields), dateField)
            this.form.setFieldsValue(dateField)
          }
        })
      }
      if (xcustomerCompanySales) {
        this.companySales = xcustomerCompanySales
      }
    },
    onValuesChange(props, values) {
      let keys = Object.keys(values)
      if (keys.length > 1) {
        return
      }
      // this.uploadFieldData = Object.assign(this.uploadFieldData, values)
      // if (values[keys[0]] === this.model[keys[0]]) {
      //   delete this.uploadFieldData[keys[0]]
      // }
      if (keys[0] === 'ifNew') {
        if (values[keys[0]] === '1') {
          this.fieldList = this.fieldList0.concat(this.fieldList2)
        } else {
          this.fieldList = this.fieldList0.concat(this.fieldList1)
        }
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
      if (keys[0] === 'ifNew' || keys[0] === 'qyzrndyshj' || keys[0] === 'hyzrndyshj') {
        this.setZjzysbData()
      }
      if (keys[0] === 'dnRecpar' || keys[0] === 'dnpjczl') {
        this.setDnpjfjData()
      }
      if (keys[0] === 'dnkfyshj' || keys[0] === 'dncyyshj' || keys[0] === 'dnqtyshj') {
        this.setDnljyshjData()
      }
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
          this.$message.warning('请检查门店运营数据必填验证!')
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
    getSales() {
      return this.companySales
    },

    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.companySales = info.file.response.result.list
          this.$message.success('上传成功!')
          this.$nextTick(() => {
            let ifNew = this.form.getFieldValue('ifNew')
            if (ifNew !== '1') {
              this.form.setFieldsValue({
                qyzrndyshj: numCal(info.file.response.result.fristValues, 2),
                qezrndyshj: numCal(info.file.response.result.secondValues, 2),
                qszrndyshj: numCal(info.file.response.result.thirdValues, 2),
              })
              this.setZjzysbData()
            }
          })
        } else {
          this.$message.error(info.file.response.message)
        }
        this.uploadLoading = false
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
        this.uploadLoading = false
      }
    },
    downloadMoban(fjname) {
      this.uploadLoading = true
      downFile(this.url.exportExcel).then((data) => {
        this.uploadLoading = false
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fjname)
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fjname)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    //当年累计营收合计 当年营业总收入=客房收入+餐饮收入+其他收入
    totalValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      let data = this.form.getFieldsValue(['dnkfyshj', 'dncyyshj', 'dnqtyshj'])
      if (this.isEmity(data.dnkfyshj) || this.isEmity(data.dncyyshj) || this.isEmity(data.dnqtyshj)) {
        callback()
      }
      let sum = CAL.accAdd(CAL.accAdd(data.dnkfyshj, data.dncyyshj), data.dnqtyshj)
      if (value !== sum) {
        callback('当年营业总收入=客房收入+餐饮收入+其他收入')
      }
      callback()
    },
    //租金占营收比=年租金/前一自然年营业收入或后一自然年预测营收
    zjzysbValidator(rule, value, callback) {
      if (!value) {
        callback()
      }
      let values = this.form.getFieldsValue(['ifNew', 'qyzrndyshj', 'hyzrndyshj'])
      if (this.isEmity(values.ifNew) || !this.nzjData) {
        callback()
      }
      if (values.ifNew === '0' && !this.isEmity(values.qyzrndyshj)) {
        let zjzysb = CAL.accDiv(this.nzjData * 10000, values.qyzrndyshj)
        if (value !== numCal(zjzysb, 2, '%')) {
          callback('租金占营收比=年租金/前一自然年营业收入')
        }
      }
      if (values.ifNew === '1' && !this.isEmity(values.hyzrndyshj)) {
        let zjzysb = CAL.accDiv(this.nzjData * 10000, values.hyzrndyshj)
        if (value !== numCal(zjzysb, 2, '%')) {
          callback('租金占营收比=年租金/后一自然年预测营收')
        }
      }
      callback()
    },
    //租金占营收比=年租金(万)/前一自然年营业收入或后一自然年预测营收(元)
    nzjChange(data) {
      this.nzjData = data
      this.setZjzysbData()
    },
    setZjzysbData() {
      this.$nextTick(() => {
        let values = this.form.getFieldsValue(['ifNew', 'qyzrndyshj', 'hyzrndyshj'])
        let zjzysb = null
        if (values.ifNew === '0' && !this.isEmity(values.qyzrndyshj)) {
          zjzysb = CAL.accDiv(this.nzjData * 10000, values.qyzrndyshj)
        }
        if (values.ifNew === '1' && !this.isEmity(values.hyzrndyshj)) {
          zjzysb = CAL.accDiv(this.nzjData * 10000, values.hyzrndyshj)
        }
        if (zjzysb !== null) {
          this.form.setFieldsValue({
            zjzysb: numCal(zjzysb, 2, '%'),
          })
        }
      })
    },
    // 当年累计营业合计=当年客房营收合计+当年餐饮营收合计+当年其他营收合计
    setDnljyshjData() {
      this.$nextTick(() => {
        let data = this.form.getFieldsValue(['dnkfyshj', 'dncyyshj', 'dnqtyshj'])
        if (this.isEmity(data.dnkfyshj) || this.isEmity(data.dncyyshj) || this.isEmity(data.dnqtyshj)) {
          return
        }
        let sum = CAL.accAdd(CAL.accAdd(data.dnkfyshj, data.dncyyshj), data.dnqtyshj)
        this.form.setFieldsValue({
          dnljyshj: numCal(sum, 2),
        })
      })
    },
    // 当年平均房价=当年revpar/当年出租率
    setDnpjfjData() {
      this.$nextTick(() => {
        let values = this.form.getFieldsValue(['dnRecpar', 'dnpjczl'])
        let dnpjfj = null

        if (!this.isEmity(values.dnRecpar) && !this.isEmity(values.dnpjczl)) {
          dnpjfj = CAL.accDiv(values.dnRecpar * 100, values.dnpjczl)
        }
        if (dnpjfj !== null) {
          this.form.setFieldsValue({
            dnpjfj: numCal(dnpjfj, 2),
          })
        }
      })
    },
    //0 判断不为空
    isEmity(value) {
      return !value && value !== 0
    },
    //查看月销售额
    viewMoban() {
      this.$refs.cardDetails2ModalList.init(this.companySales)
    },
  },
}
</script>