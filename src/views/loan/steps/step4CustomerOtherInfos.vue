<template>
  <div>
    <a-form class="my-descriptions-form m0 no-line" labelAlign="left" layout="horizontal">
      <a-row :gutter="0">
        <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
          <a-form-item :required="field.required" :label="field.name">
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
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import { filterObj } from '@/utils/util.js'
import { ifTypes2, zjType, gdType } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  props: {
    record: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      fieldList: [],
      companyFieldList: [
        {
          name: '股东类型',
          code: 'type',
          type: 3,
          types: gdType,
          span: 8,
          required: false,
        },
        {
          name: '股东名称',
          code: 'gdxm',
          type: 1,
          span: 8,
          required: false,
        },
        {
          name: '持股比例',
          code: 'cgbl',
          type: 1,
          span: 8,
          required: false,
          unit: '%',
        },
        {
          name: '实际出资金额',
          code: 'sjczje',
          type: 1,
          span: 8,
          required: false,
          unit: '万元',
        },
        {
          name: '工商注册名称',
          code: 'gszcmc',
          type: 1,
          span: 8,
          required: false,
        },
        {
          name: '统一社会信用代码',
          code: 'tyshxydm',
          type: 1,
          span: 8,
          required: false,
        },
        {
          name: '注册资本',
          code: 'zczb',
          type: 1,
          span: 8,
          required: false,
          unit: '万元',
        },
        {
          name: '联系人',
          code: 'lxr',
          type: 1,
          span: 8,
          required: false,
        },
        {
          name: '联系方式',
          code: 'lxfs',
          type: 1,
          span: 8,
          required: false,
        },

        {
          name: '实际营业地址',
          code: 'sjjydz',
          type: 1,
          span: 8,
          required: false,
        },

        {
          name: '是否涉诉',
          code: 'sfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          required: false,
        },
        {
          name: '是否有征信疑问',
          code: 'sfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 8,
          required: false,
        },
        {
          name: '征信疑问说明',
          code: 'zxywsm',
          type: 1,
          span: 24,
          required: false,
        },
        {
          name: '法定代表人姓名',
          code: 'xm',
          type: 1,
          span: 8,
          required: false,
        },

        {
          name: '证件类型',
          code: 'zjlx',
          type: 2,
          types: zjType,
          span: 8,
          required: false,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          required: false,
        },
        {
          name: '是否涉诉',
          code: 'fdsfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          required: false,
        },
        {
          name: '是否有征信疑问',
          code: 'fdsfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          required: false,
        },
        {
          name: '征信疑问说明',
          code: 'fdzxywsm',
          type: 1,
          span: 24,
          required: false,
        },
        {
          name: '实际控制人姓名',
          code: 'sjxm',
          type: 1,
          span: 8,
          required: false,
        },

        {
          name: '证件类型',
          code: 'sjzjlx',
          type: 2,
          types: zjType,
          span: 8,
          required: false,
        },
        {
          name: '证件号码',
          code: 'sjzjhm',
          type: 1,
          span: 8,
          required: false,
        },
        {
          name: '是否涉诉',
          code: 'sjsfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          required: false,
        },
        {
          name: '是否有征信疑问',
          code: 'sjsfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          required: false,
        },
        {
          name: '征信疑问说明',
          code: 'sjzxywsm',
          type: 1,
          span: 24,
          required: false,
        },
      ],
      personFieldList: [
        {
          name: '股东类型',
          code: 'type',
          type: 3,
          types: gdType,
          span: 8,
          required: false,
        },
        {
          name: '股东名称',
          code: 'gdxm',
          type: 1,
          span: 8,
          required: false,
        },
        {
          name: '持股比例',
          code: 'cgbl',
          type: 1,
          span: 8,
          required: false,
          unit: '%',
        },
        {
          name: '实际出资金额',
          code: 'sjczje',
          type: 1,
          span: 8,
          required: false,
          unit: '万元',
        },
        {
          name: '证件类型',
          code: 'zjlx',
          type: 2,
          types: zjType,
          span: 8,
          required: false,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          required: false,
        },

        {
          name: '联系方式',
          code: 'lxfs',
          type: 1,
          span: 8,
          required: false,
        },

        {
          name: '联系地址',
          code: 'sjjydz',
          type: 1,
          span: 16,
          required: false,
        },

        {
          name: '是否涉诉',
          code: 'sfss',
          type: 3,
          types: ifTypes2,
          span: 8,
          required: false,
        },
        {
          name: '是否有征信疑问',
          code: 'sfyzxyw',
          type: 3,
          types: ifTypes2,
          span: 16,
          required: false,
        },
        {
          name: '征信疑问说明',
          code: 'zxywsm',
          type: 1,
          span: 24,
          required: false,
        },
      ],
      model: {},
    }
  },

  created() {
    this.fieldList = this.companyFieldList
    if (this.record.type === 2) {
      this.fieldList = this.personFieldList
    }
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.model = Object.assign({}, this.record)
      })
    },
  },
}
</script>