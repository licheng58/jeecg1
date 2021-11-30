<template>
  <div>
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
            <span v-else-if="field.type === 8">
              <comUpload :value="model[field.code]" disabled />
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
          <a-form-item v-else-if="field.code === 'code'" :label="field.name">
            <CustomerSelect v-decorator="[field.code]" :valueCode="field.code" @select="codeSelect"></CustomerSelect>
          </a-form-item>
          <a-form-item v-else-if="field.code === 'jmjddm'" :label="field.name">
            <CustomerSelect v-decorator="[field.code]" :valueCode="field.code" @select="jmjddmSelect"></CustomerSelect>
          </a-form-item>
          <a-form-item v-else-if="field.code === 'fjname'">
            <span slot="label">
              <span style="margin-right: 5px">{{ field.name }}</span>
              <a-tooltip title="只能上传一份,请将文件打包上传!"><a-icon type="question-circle" /></a-tooltip
            ></span>
            <comUpload v-decorator="[field.code]" />
          </a-form-item>
          <a-form-item v-else :label="field.name">
            <comInput
              v-if="field.type === 1"
              v-decorator="[field.code]"
              :placeholder="field.placeholder ? field.placeholder : ''"
              :type="field.inputType ? field.inputType : 'text'"
              :unit="field.unit ? field.unit : ''"
            />
            <a-select v-if="field.type === 2" v-decorator="[field.code]">
              <a-select-option v-for="(value, key, index) of field.types" :key="index" :value="key">{{
                value
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { filterObj } from '@/utils/util.js'
import pick from 'lodash.pick'
import { getAction, postAction } from '@/api/manage'
import { jkrsfType, dbType, bzType, gjrType, dywType, zywType } from '@/utils/dictionary'
import comUpload from '@/components/jeecg/comUpload'

export default {
  components: {
    comUpload,
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
    record: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      customerData: null,
      model: {},
      fieldDefaultList: [
        {
          name: '借款人身份',
          code: 'jkrsf',
          type: 2,
          types: jkrsfType,
          span: 8,
          required: true,
        },
        {
          name: '担保类型',
          code: 'dblx',
          filter: [{ code: 'jkrsf', value: '1' }],
          type: 2,
          types: dbType,
          span: 8,
          required: true,
        },
        {
          name: '共借人',
          code: 'gjr',
          filter: [{ code: 'jkrsf', value: '2' }],
          type: 2,
          types: gjrType,
          span: 8,
          required: true,
        },
        {
          name: '保证人',
          code: 'bzr',
          filter: [{ code: 'dblx', value: '1' }],
          type: 2,
          types: bzType,
          span: 8,
          required: true,
        },
        {
          name: '抵押物',
          code: 'dyw',
          filter: [{ code: 'dblx', value: '2' }],
          type: 2,
          types: dywType,
          span: 8,
          required: true,
        },
        {
          name: '质押物',
          code: 'zyw',
          filter: [{ code: 'dblx', value: '3' }],
          type: 2,
          types: zywType,
          span: 8,
          required: true,
        },
        {
          name: '门店编号',
          code: 'code',
          filter: [
            { code: 'bzr', value: '1' },
            { code: 'gjr', value: '1' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '加盟酒店店名',
          code: 'jmjddm',
          filter: [
            { code: 'bzr', value: '1' },
            { code: 'gjr', value: '1' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '工商注册名称',
          code: 'gszcmc',
          filter: [{ code: 'bzr', value: '2' }],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '统一社会信用代码',
          code: 'tyshxydm',
          filter: [{ code: 'bzr', value: '2' }],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '姓名',
          code: 'xm',
          filter: [
            { code: 'bzr', value: '3' },
            { code: 'gjr', value: '2' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '身份证号',
          code: 'sfzh',
          filter: [
            { code: 'bzr', value: '3' },
            { code: 'gjr', value: '2' },
          ],
          type: 1,
          span: 8,
          required: true,
        },

        {
          name: '担保额',
          code: 'dbe',
          filter: [{ code: 'dblx', value: '1' }],
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
        },

        {
          name: '名称',
          code: 'mc',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '权属',
          code: 'qs',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          span: 8,
          required: true,
        },

        {
          name: '状况',
          code: 'zk',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '抵押额', //质押物
          code: 'dyye',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
        },
        {
          name: '上传附件',
          code: 'fjname', //fjcode
          filter: [
            { code: 'gjr', value: '2' },
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
            { code: 'bzr', value: '2' },
            { code: 'bzr', value: '3' },
          ],
          type: 8,
          span: 8,
          required: true,
        },
      ],
      fieldList: [],
      form: this.$form.createForm(this, {
        onValuesChange: (props, values) => {
          this.onValuesChange(props, values)
        },
      }),
    }
  },

  created() {
    this.init()
  },
  methods: {
    init() {
      if (this.type === 2) {
        this.fieldDefaultList[7].span = this.record.jkrsf === '1' || this.record.gjr !== '1' ? 8 : 24
        this.fieldDefaultList[16].name = this.record.dblx === '2' ? '抵押额' : '质押额'
        this.fieldDefaultList[17].span = this.record.dblx === '1' ? 24 : 16
        this.fieldList = this.fieldDefaultList.filter(
          (item) => !item.filter || item.filter.some((data) => data.value === this.record[data.code])
        )
      } else {
        this.fieldList = this.fieldDefaultList
      }
      this.$nextTick(() => {
        this.model = Object.assign({}, this.record)
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
    },
    // 第一层：借款人身份【担保人、共借人】；
    //   if jkrsf == 担保人：
    //      第二层：担保类型【保证、抵押、质押】
    //             if dblx== 保证：
    //                第三层：保证人【酒店企业、非酒店企业、自然人】
    //                        if dbbd== 酒店企业：
    //                            展示字段：门店编号、加盟酒店店名、担保额
    //                        else if dbbd == 非酒店企业：
    //                            展示字段：工商注册名称、统一社会信用代码、担保额、上传附件
    //                        else if dbbd == 自然人：
    //                            展示字段：姓名、身份证号、担保额、上传附件
    //             else if dblx== 抵押：
    //                第三层：抵押物【房屋建筑物、土地使用权、机器设备、交通运输工具、其他】
    //                        通用{名称、权属、状况、抵押额、上传附件}

    //              else if dblx== 质押：
    //                 第三层：质押物【保证金、存单、债券、股票股权、保险单、其他】
    //                         通用{名称、权属、状况、质押额、上传附件}

    //   else if jkrsf == 共借人：
    //        第二层：共借人【酒店企业、自然人】
    //               if gjr== 酒店企业：
    //                   展示字段：门店编号、加盟酒店店名
    //                else if gjr == 自然人：
    //                     示字段：姓名、身份证号、上传附件
    onValuesChange(props, values) {
      if (values.hasOwnProperty('jkrsf')) {
        this.model = {
          jkrsf: values.jkrsf,
        }
        if (values.jkrsf === '1') {
          this.model.dblx = '1'
          this.model.bzr = '1'
        } else {
          this.model.gjr = '1'
        }
        this.fieldDefaultList[7].span = values.jkrsf === '1' ? 8 : 24
        this.fieldDefaultList[17].span = values.jkrsf === '2' ? 16 : 24
      }
      if (values.hasOwnProperty('dblx')) {
        this.model = {
          jkrsf: this.model.jkrsf,
          dblx: values.dblx,
        }
        if (values.dblx === '1') {
          this.model.bzr = '1'
        }
        this.fieldDefaultList[16].name = values.dblx === '2' ? '抵押额' : '质押额'
        this.fieldDefaultList[17].span = values.dblx === '1' ? 24 : 16
      }
      if (values.hasOwnProperty('bzr')) {
        this.model = {
          jkrsf: this.model.jkrsf,
          dblx: this.model.dblx,
          bzr: values.bzr,
        }
      }
      if (values.hasOwnProperty('gjr')) {
        this.model = {
          jkrsf: this.model.jkrsf,
          gjr: values.gjr,
        }
        this.fieldDefaultList[7].span = values.gjr === '1' ? 24 : 8
        this.fieldDefaultList[17].span = values.gjr === '1' ? 8 : 16
      }
      this.model = Object.assign(this.model, values)
      console.log(this.model)
      this.fieldList = this.fieldDefaultList.filter(
        (item) => !item.filter || item.filter.some((data) => data.value === this.model[data.code])
      )
    },

    codeSelect(customerData) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          jmjddm: customerData.jmjddm,
        })
      })
    },
    jmjddmSelect(customerData) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          code: customerData.code,
        })
      })
    },
    getData() {
      let formData = Object.assign(this.model, this.form.getFieldsValue())
      return filterObj(formData)
    },
  },
}
</script>
